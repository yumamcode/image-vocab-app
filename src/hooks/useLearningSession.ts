"use client";

import { useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase-browser";
import { calculateNextReview, performanceToQuality } from "@/lib/spaced-repetition";
import { User } from "@supabase/supabase-js";

export function useLearningSession(words: any[], user: User | null) {
  const [sessionWords, setSessionWords] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const supabase = createClient();

  const currentWord = useMemo(() => sessionWords[currentIndex], [sessionWords, currentIndex]);
  
  const progressPercent = useMemo(() => {
    return sessionWords.length > 0
      ? Math.round(((currentIndex + 1) / sessionWords.length) * 100)
      : 0;
  }, [sessionWords.length, currentIndex]);

  const startSession = useCallback((count: number = 10) => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count === -1 ? words.length : count);
    
    setSessionWords(selected);
    setCurrentIndex(0);
    setIsFinished(false);
  }, [words]);

  const handleAnswer = useCallback(async (isCorrect: boolean) => {
    const quality = performanceToQuality(isCorrect);

    if (user && currentWord) {
      const { data: progress } = await supabase
        .from("user_word_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("word_id", currentWord.id)
        .maybeSingle();

      const result = calculateNextReview(
        quality,
        progress?.correct_count || 0,
        progress?.ease_factor || 2.5,
        progress?.interval || 0
      );

      const { error } = await supabase.from("user_word_progress").upsert({
        user_id: user.id,
        word_id: currentWord.id,
        status: result.status,
        correct_count: isCorrect
          ? (progress?.correct_count || 0) + 1
          : progress?.correct_count || 0,
        incorrect_count: !isCorrect
          ? (progress?.incorrect_count || 0) + 1
          : progress?.incorrect_count || 0,
        ease_factor: result.ease_factor,
        interval: result.interval,
        next_review_date: result.next_review_date.toISOString(),
        last_reviewed_at: new Date().toISOString(),
      });

      if (error) console.error("Error saving progress:", error);
    } else if (currentWord) {
      const result = calculateNextReview(quality, 0);
      console.log(`Word: ${currentWord.word}, Result:`, result);
    }

    if (currentIndex < sessionWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  }, [user, currentWord, currentIndex, sessionWords.length, supabase]);

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
    toggleFavorite,
    setSessionWords,
    setCurrentIndex,
    setIsFinished,
  };
}

