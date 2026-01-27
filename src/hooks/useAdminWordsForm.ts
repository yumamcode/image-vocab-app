import { useState } from "react";
import { Word, NewWord } from "@/types/word";

const INITIAL_NEW_WORD: NewWord = {
  word: "",
  meaning: "",
  pronunciation: "",
  category: "general",
  part_of_speech: "noun",
  difficulty: "beginner",
};

/**
 * 単語の登録や編集で使う、入力フォームの状態を管理する道具（フック）です。
 */
export function useAdminWordsForm() {
  // 新しい単語を追加する画面を表示しているかどうか
  const [isAdding, setIsAdding] = useState(false);
  // 今編集している単語のデータ（編集していない時は空っぽ）
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  // 編集用の画面（モーダル）が開いているかどうか
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // 新しく登録しようとしている単語の入力内容
  const [newWord, setNewWord] = useState<NewWord>(INITIAL_NEW_WORD);

  // 入力内容を最初（空っぽ）の状態に戻す関数
  const resetNewWord = () => setNewWord(INITIAL_NEW_WORD);

  // 「編集」ボタンが押された時の動き
  const handleEditClick = (word: Word) => {
    setEditingWord({ ...word });
    setIsEditModalOpen(true);
  };

  return {
    isAdding,
    setIsAdding,
    editingWord,
    setEditingWord,
    isEditModalOpen,
    setIsEditModalOpen,
    newWord,
    setNewWord,
    resetNewWord,
    handleEditClick,
  };
}
