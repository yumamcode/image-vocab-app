"use client";

import { useState } from "react";
import { Word } from "@/types/word";

/**
 * 学習セッションの「今の状態」を覚えておくための道具です。
 * どの単語を勉強しているか、今は何番目か、終わったかどうかを管理します。
 */
export function useSessionState() {
  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  return {
    sessionWords,
    setSessionWords,
    currentIndex,
    setCurrentIndex,
    isFinished,
    setIsFinished,
  };
}

