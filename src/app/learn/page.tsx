"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useWords } from "@/hooks/word/useWords";
import { useLearningSession } from "@/hooks/session/useLearningSession";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { Loader2 } from "lucide-react";
import { LearnView } from "@/components/learn/LearnView";

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
    goToNextWord,
    toggleFavorite,
  } = useLearningSession(words);

  useEffect(() => {
    if (words.length > 0 && sessionWords.length === 0 && !isFinished) {
      startSession(count);
    }
  }, [words, sessionWords.length, isFinished, startSession, count]);

  return (
    <LearnView
      loading={loading}
      isFinished={isFinished}
      sessionWords={sessionWords}
      currentIndex={currentIndex}
      currentWord={currentWord}
      progressPercent={progressPercent}
      favorites={favorites}
      setView={setView}
      toggleFavorite={toggleFavorite}
      handleAnswer={handleAnswer}
      goToNextWord={goToNextWord}
    />
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
