"use client";

import { useMemo } from "react";
import { Word } from "@/types/word";

/**
 * 学習がどれくらい進んでいるか（進捗）を計算する道具です。
 * 今の単語や、全体の何パーセント終わったかを教えてくれます。
 */
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

