"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LearnNavigation } from "@/components/navigation/LearnNavigation";
import { SessionFinishedView } from "@/components/session/SessionFinishedView";
import { ActiveLearningView } from "@/components/learn/ActiveLearningView";
import { useWords } from "@/hooks/useWords";
import { useLearningSession } from "@/hooks/useLearningSession";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { Loader2 } from "lucide-react";

function LearnContent() {
  const { setView } = useAppNavigation();
  const searchParams = useSearchParams();
  const countParam = searchParams.get("count");
  const count = countParam ? parseInt(countParam) : 10;

  const { words, loading } = useWords();
  const {
    sessionWords,
    currentIndex,
    isFinished,
    favorites,
    currentWord,
    progressPercent,
    startSession,
    handleAnswer,
    toggleFavorite,
  } = useLearningSession(words);

  // セッションの初期化
  useEffect(() => {
    if (words.length > 0 && sessionWords.length === 0 && !isFinished) {
      startSession(count);
    }
  }, [words, sessionWords.length, isFinished, startSession, count]);

  return (
    <div className="min-h-screen bg-background">
      <LearnNavigation
        view="learn"
        onBack={() => setView("home")}
        currentIndex={currentIndex}
        totalWords={sessionWords.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isFinished ? (
          <SessionFinishedView
            title="🎉 お疲れ様でした！"
            description={`${sessionWords.length}単語の学習が完了しました。素晴らしい進歩です！`}
            onRestart={() => setView("learn-settings")}
            onHome={() => setView("home")}
            buttonColorClass="gradient-primary"
          />
        ) : (
          <ActiveLearningView
            loading={loading}
            sessionWords={sessionWords}
            currentWord={currentWord}
            progressPercent={progressPercent}
            currentIndex={currentIndex}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            handleAnswer={handleAnswer}
            onInterrupt={() => setView("home")}
          />
        )}
      </main>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      }
    >
      <LearnContent />
    </Suspense>
  );
}
