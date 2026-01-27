import { useState, useMemo } from "react";
import { Word } from "@/types/word";

/**
 * たくさんある単語の中から、探したい単語だけを絞り込むための道具（フック）です。
 */
export function useAdminWordsFilter(words: Word[]) {
  // 検索窓に入力された文字を覚えておく場所
  const [search, setSearch] = useState("");

  // 入力された文字に合わせて、単語のリストを絞り込む
  const filteredWords = useMemo(() => {
    return words.filter(
      (w) =>
        // 英単語の中に検索した文字が入っているか、または意味の中に文字が入っているかチェック
        w.word.toLowerCase().includes(search.toLowerCase()) ||
        w.meaning.includes(search)
    );
  }, [words, search]);

  return { search, setSearch, filteredWords };
}
