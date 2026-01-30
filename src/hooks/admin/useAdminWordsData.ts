import { useEffect } from "react";
import { useAdminWordsFetch } from "./useAdminWordsFetch";
import { useAdminWordsMutate } from "./useAdminWordsMutate";

/**
 * 管理画面で使う単語データを管理する道具を一つにまとめました。
 */
export function useAdminWordsData() {
  const { words, setWords, loading, fetchWords, supabase } = useAdminWordsFetch();
  const { addWord, updateWord } = useAdminWordsMutate(supabase, fetchWords);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  return { words, setWords, loading, fetchWords, addWord, updateWord };
}
