"use client";

import { useCallback } from "react";
import { Word } from "@/types/word";

export function useSessionLogic(words: Word[], state: any) {
  const startSession = useCallback(
    (count: number = 10) => {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, count === -1 ? words.length : count);

      state.setSessionWords(selected);
      state.setCurrentIndex(0);
      state.setIsFinished(false);
    },
    [words, state]
  );

  const goToNextWord = useCallback(() => {
    if (state.currentIndex < state.sessionWords.length - 1) {
      state.setCurrentIndex(state.currentIndex + 1);
    } else {
      state.setIsFinished(true);
    }
  }, [state]);

  const handleAnswer = useCallback(async (_isCorrect: boolean) => {
    console.log(`Answered: ${_isCorrect}`);
  }, []);

  return { startSession, goToNextWord, handleAnswer };
}
