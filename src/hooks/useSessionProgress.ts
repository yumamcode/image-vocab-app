"use client";

import { useMemo } from "react";
import { Word } from "@/types/word";

export function useSessionProgress(sessionWords: Word[], currentIndex: number) {
  const currentWord = useMemo(
    () => sessionWords[currentIndex],
    [sessionWords, currentIndex]
  );

  const progressPercent = useMemo(() => {
    return sessionWords.length > 0
      ? Math.round(((currentIndex + 1) / sessionWords.length) * 100)
      : 0;
  }, [sessionWords.length, currentIndex]);

  return { currentWord, progressPercent };
}
