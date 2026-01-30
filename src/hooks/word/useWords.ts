import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Word } from "@/types/word";

/**
 * データベースから単語のリストを読み込んで、みんなに見えるようにする道具です。
 */
export function useWords() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const fetchWords = useCallback(async () => {
    const { data } = await supabase.from("words").select("*").limit(100);
    if (data) setWords(data as Word[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchWords(); }, [fetchWords]);

  return { words, loading, fetchWords };
}
