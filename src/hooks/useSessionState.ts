"use client";

import { useState } from "react";
import { Word } from "@/types/word";

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
