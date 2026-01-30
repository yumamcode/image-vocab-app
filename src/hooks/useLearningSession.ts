"use client";

import { Word } from "@/types/word";
import { useSessionState } from "./useSessionState";
import { useSessionProgress } from "./useSessionProgress";
import { useFavorites } from "./useFavorites";
import { useSessionLogic } from "./useSessionLogic";

export function useLearningSession(words: Word[]) {
  const state = useSessionState();
  const progress = useSessionProgress(state.sessionWords, state.currentIndex);
  const { favorites, toggleFavorite } = useFavorites();
  const logic = useSessionLogic(words, state);

  return {
    ...state,
    ...progress,
    ...logic,
    favorites,
    toggleFavorite,
  };
}
