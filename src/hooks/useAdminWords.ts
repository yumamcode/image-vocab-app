import React from "react";
import { useAdminWordsData } from "./useAdminWordsData";
import { useAdminWordsFilter } from "./useAdminWordsFilter";
import { useAdminWordsForm } from "./useAdminWordsForm";

/**
 * 管理画面で単語を操作するための、すべての機能をまとめた道具（フック）です。
 */
export function useAdminWords() {
  // 単語のデータを取ってきたり、追加・更新したりする機能
  const { words, setWords, loading, fetchWords, addWord, updateWord } = useAdminWordsData();
  // リストを検索して絞り込む機能
  const { search, setSearch, filteredWords } = useAdminWordsFilter(words);
  // 入力フォームの状態を管理する機能
  const {
    isAdding, setIsAdding,
    editingWord, setEditingWord,
    isEditModalOpen, setIsEditModalOpen,
    newWord, setNewWord, resetNewWord,
    handleEditClick,
  } = useAdminWordsForm();

  // 新しい単語を登録するボタンが押された時の動き
  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    // 単語と意味が入力されていない時は何もしない
    if (!newWord.word || !newWord.meaning) return;
    const success = await addWord(newWord);
    if (success) {
      // 登録できたら入力をリセットして、入力画面を閉じる
      resetNewWord();
      setIsAdding(false);
    }
  };

  // 単語の情報を書き換えるボタンが押された時の動き
  const handleUpdateWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWord) return;
    const success = await updateWord(editingWord);
    if (success) {
      // 書き換えができたら、編集画面を閉じる
      setIsEditModalOpen(false);
      setEditingWord(null);
    }
  };

  return {
    words, setWords, loading, search, setSearch,
    isAdding, setIsAdding, newWord, setNewWord,
    editingWord, setEditingWord, isEditModalOpen, setIsEditModalOpen,
    filteredWords, fetchWords, handleAddWord, handleUpdateWord, handleEditClick,
  };
}
