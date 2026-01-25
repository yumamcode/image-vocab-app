"use client";

import { useState, useCallback, useMemo } from "react";

export function useLearningSession(words: any[]) {
  const [sessionWords, setSessionWords] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const currentWord = useMemo(
    () => sessionWords[currentIndex],
    [sessionWords, currentIndex]
  );

  const progressPercent = useMemo(() => {
    return sessionWords.length > 0
      ? Math.round(((currentIndex + 1) / sessionWords.length) * 100)
      : 0;
  }, [sessionWords.length, currentIndex]);

  const startSession = useCallback(
    (count: number = 10) => {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, count === -1 ? words.length : count);

      setSessionWords(selected);
      setCurrentIndex(0);
      setIsFinished(false);
    },
    [words]
  );

  const handleAnswer = useCallback(
    async (_isCorrect: boolean) => {
      // 回答を記録するロジック（将来的に拡張可能）
      console.log(`Answered: ${_isCorrect}`);
    },
    []
  );

  const goToNextWord = useCallback(() => {
    if (currentIndex < sessionWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  }, [currentIndex, sessionWords.length]);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return {
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
    setSessionWords,
    setCurrentIndex,
    setIsFinished,
  };
}
