import { useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Word } from "@/types/word";

/**
 * データベースから単語のリストを読み込むための道具です。
 */
export function useAdminWordsFetch() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const fetchWords = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("words")
      .select("*")
      .order("word", { ascending: true });

    if (data) setWords(data as Word[]);
    if (error) console.error("Error fetching words:", error);
    setLoading(false);
  }, [supabase]);

  return { words, setWords, loading, fetchWords, supabase };
}
