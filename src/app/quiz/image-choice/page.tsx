"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ImageChoiceQuiz } from "@/components/ImageChoiceQuiz";
import { Navigation } from "@/components/home/Navigation";
import { SessionHeader } from "@/components/home/SessionHeader";
import { SessionFinishedView } from "@/components/home/SessionFinishedView";
import { useWords } from "@/hooks/useWords";
import { useLearningSession } from "@/hooks/useLearningSession";
import { Loader2 } from "lucide-react";

function ImageChoiceQuizContent() {
  const router = useRouter();
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
        view="quiz-image-choice"
        startLearning={() => router.push("/learn/settings")}
        currentIndex={currentIndex}
        totalWords={sessionWords.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isFinished ? (
          <SessionFinishedView
            title="🎉 画像クイズ完了！"
            description="視覚的な記憶力もバッチリですね！全問終了しました。"
            onRestart={() => startSession(count)}
            onHome={() => router.push("/")}
            buttonColorClass="bg-purple-500"
          />
        ) : (
          <div className="space-y-12">
            <SessionHeader
              progressPercent={progressPercent}
              currentIndex={currentIndex}
              totalWords={sessionWords.length}
              colorClass="text-purple-500"
            />

            <div className="flex flex-col items-center">
              {loading ? (
                <div className="py-20 text-center">
                  <Loader2
                    className="animate-spin mx-auto text-purple-500 mb-4"
                    size={48}
                  />
                  <p className="text-gray-500">画像を読み込み中...</p>
                </div>
              ) : sessionWords.length > 0 ? (
                <ImageChoiceQuiz
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

export default function ImageChoiceQuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-purple-500" size={48} />
        </div>
      }
    >
      <ImageChoiceQuizContent />
    </Suspense>
  );
}
