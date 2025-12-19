"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";

export function useWords() {
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const fetchWords = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("words").select("*").limit(100);
    if (data) setWords(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  return { words, loading, fetchWords };
}

