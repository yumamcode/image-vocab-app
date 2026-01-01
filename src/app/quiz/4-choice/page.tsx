"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MultipleChoiceQuiz } from "@/components/quiz/MultipleChoiceQuiz";
import { QuizNavigation } from "@/components/navigation/QuizNavigation";
import { SessionHeader } from "@/components/session/SessionHeader";
import { SessionFinishedView } from "@/components/session/SessionFinishedView";
import { useWords } from "@/hooks/useWords";
import { useLearningSession } from "@/hooks/useLearningSession";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { Loader2 } from "lucide-react";

function MultipleChoiceQuizContent() {
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
      <QuizNavigation
        view="quiz-4-choice"
        onBack={() => setView("quiz-menu")}
        currentIndex={currentIndex}
        totalWords={sessionWords.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isFinished ? (
          <SessionFinishedView
            title="🎉 クイズ完了！"
            description="全問終了しました。素晴らしい！"
            onRestart={() => startSession(count)}
            onHome={() => setView("home")}
            buttonColorClass="gradient-primary"
          />
        ) : (
          <div className="space-y-12">
            <SessionHeader
              progressPercent={progressPercent}
              currentIndex={currentIndex}
              totalWords={sessionWords.length}
              colorClass="text-primary"
            />

            <div className="flex flex-col items-center">
              {loading ? (
                <div className="py-20 text-center">
                  <Loader2
                    className="animate-spin mx-auto text-primary mb-4"
                    size={48}
                  />
                  <p className="text-gray-500">問題を生成中...</p>
                </div>
              ) : sessionWords.length > 0 ? (
                <MultipleChoiceQuiz
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

export default function MultipleChoiceQuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      }
    >
      <MultipleChoiceQuizContent />
    </Suspense>
  );
}
