import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Word, NewWord } from "@/types/word";

/**
 * データベースから単語のデータを取ってきたり、新しく登録したりするための便利な道具（フック）です。
 */
export function useAdminWordsData() {
  // 単語のリストを保存しておく場所
  const [words, setWords] = useState<Word[]>([]);
  // データを読み込み中かどうかを覚えておく場所
  const [loading, setLoading] = useState(true);
  // データベースとやり取りするための準備
  const supabase = useMemo(() => createClient(), []);

  // データベースから単語のリストを読み込む関数
  const fetchWords = useCallback(async () => {
    const { data, error } = await supabase
      .from("words")
      .select("*")
      .order("word", { ascending: true });

    if (data) setWords(data as Word[]);
    if (error) console.error("Error fetching words:", error);
    setLoading(false);
  }, [supabase]);

  // この道具を使い始めた時に、一度だけ単語を読み込む
  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  // 新しい単語をデータベースに保存する関数
  const addWord = async (newWord: NewWord) => {
    setLoading(true);
    const { error } = await supabase.from("words").insert([newWord]);
    if (error) {
      alert("単語の登録に失敗しました: " + error.message);
      setLoading(false);
      return false;
    }
    // 登録できたら、リストを最新の状態に更新する
    await fetchWords();
    return true;
  };

  // すでにある単語の情報を書き換える関数
  const updateWord = async (editingWord: Word) => {
    setLoading(true);
    const { error } = await supabase
      .from("words")
      .update({
        word: editingWord.word,
        meaning: editingWord.meaning,
        pronunciation: editingWord.pronunciation,
        part_of_speech: editingWord.part_of_speech,
        difficulty: editingWord.difficulty,
        category: editingWord.category,
      })
      .eq("id", editingWord.id);

    if (error) {
      alert("更新に失敗しました: " + error.message);
      setLoading(false);
      return false;
    }
    // 書き換えができたら、リストを最新の状態に更新する
    await fetchWords();
    return true;
  };

  return { words, setWords, loading, setLoading, fetchWords, addWord, updateWord };
}
