import { Word, NewWord } from "@/types/word";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * 新しい単語を追加したり、既存の単語を更新したりする機能を提供します。
 */
export function useAdminWordsMutate(supabase: SupabaseClient, fetchWords: () => Promise<void>) {
  const addWord = async (newWord: NewWord) => {
    const { error } = await supabase.from("words").insert([newWord]);
    if (error) {
      alert("登録に失敗しました: " + error.message);
      return false;
    }
    await fetchWords();
    return true;
  };

  const updateWord = async (editingWord: Word) => {
    const { error } = await supabase
      .from("words")
      .update({
        word: editingWord.word,
        meaning: editingWord.meaning,
        pronunciation: editingWord.pronunciation,
        part_of_speech: editingWord.part_of_speech,
        difficulty: editingWord.difficulty,
        category: editingWord.category,
        example_sentence: editingWord.example_sentence,
      })
      .eq("id", editingWord.id);

    if (error) {
      alert("更新に失敗しました: " + error.message);
      return false;
    }
    await fetchWords();
    return true;
  };

  return { addWord, updateWord };
}
