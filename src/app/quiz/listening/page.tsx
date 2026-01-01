"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ListeningQuiz } from "@/components/ListeningQuiz";
import { Navigation } from "@/components/home/Navigation";
import { SessionHeader } from "@/components/home/SessionHeader";
import { SessionFinishedView } from "@/components/home/SessionFinishedView";
import { useWords } from "@/hooks/useWords";
import { useLearningSession } from "@/hooks/useLearningSession";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { Loader2 } from "lucide-react";

function ListeningQuizContent() {
  const { setView } = useAppNavigation();
  const searchParams = useSearchParams();
  const countParam = searchParams.get("count");
  const count = countParam ? parseInt(countParam) : 10;

  const { words, loading } = useWords();
  const {
    sessionWords,
    currentIndex,
    isFinished,
    currentWord,
    progressPercent,
    startSession,
    handleAnswer,
  } = useLearningSession(words);

  useEffect(() => {
    if (words.length > 0 && sessionWords.length === 0 && !isFinished) {
      startSession(count);
    }
  }, [words, sessionWords.length, isFinished, startSession, count]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        view="quiz-listening"
        startLearning={() => setView("learn-settings")}
        currentIndex={currentIndex}
        totalWords={sessionWords.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isFinished ? (
          <SessionFinishedView
            title="🎉 リスニング完了！"
            description="素晴らしい耳をお持ちですね！全問終了しました。"
            onRestart={() => startSession(count)}
            onHome={() => setView("home")}
            buttonColorClass="bg-orange-500"
          />
        ) : (
          <div className="space-y-12">
            <SessionHeader
              progressPercent={progressPercent}
              currentIndex={currentIndex}
              totalWords={sessionWords.length}
              colorClass="text-orange-500"
            />

            <div className="flex flex-col items-center">
              {loading ? (
                <div className="py-20 text-center">
                  <Loader2
                    className="animate-spin mx-auto text-orange-500 mb-4"
                    size={48}
                  />
                  <p className="text-gray-500">音声データを準備中...</p>
                </div>
              ) : sessionWords.length > 0 ? (
                <ListeningQuiz
                  currentWord={currentWord}
                  allWords={sessionWords}
                  onAnswer={handleAnswer}
                />
              ) : (
                <div className="py-20 text-center">
                  <p className="text-gray-500 mb-4">データがありません。</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ListeningQuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-orange-500" size={48} />
        </div>
      }
    >
      <ListeningQuizContent />
    </Suspense>
  );
}
