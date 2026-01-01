"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Word } from "@/types/word";

export function useWords() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  // Supabase クライアントを安定化させる
  const supabase = useMemo(() => createClient(), []);

  const fetchWords = useCallback(async () => {
    // await の前に同期的 setState を行わないことで useEffect 内の警告を回避する
    const { data, error } = await supabase.from("words").select("*").limit(100);

    if (error) {
      console.error("Error fetching words:", error);
    }

    if (data) {
      setWords(data as Word[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const initFetch = async () => {
      await fetchWords();
    };
    initFetch();
  }, [fetchWords]);

  return { words, loading, fetchWords };
}
