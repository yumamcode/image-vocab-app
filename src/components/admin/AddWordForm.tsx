import React from "react";
import { Loader2 } from "lucide-react";
import { NewWord } from "@/types/word";
import { AdminFormField, adminInputClass } from "./AdminFormField";
import { WORD_CATEGORIES } from "@/constants/word";

interface AddWordFormProps {
  newWord: NewWord;
  setNewWord: (word: NewWord) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

/**
 * 新しい単語を追加するための入力フォームを表示する部品です。
 */
export function AddWordForm({
  newWord,
  setNewWord,
  onSubmit,
  loading,
}: AddWordFormProps) {
  // 入力された内容を一時的に保存する関数
  const updateField = (field: keyof NewWord, value: string) => {
    setNewWord({ ...newWord, [field]: value });
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 mb-8 animate-fade-in text-gray-900">
      <h2 className="text-2xl font-bold mb-6">新規単語登録</h2>
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* 英単語を入力する場所 */}
        <AdminFormField label="英単語" required>
          <input
            type="text"
            required
            value={newWord.word}
            className={adminInputClass}
            placeholder="apple"
            onChange={(e) => updateField("word", e.target.value)}
          />
        </AdminFormField>

        {/* 日本語の意味を入力する場所 */}
        <AdminFormField label="意味" required>
          <input
            type="text"
            required
            value={newWord.meaning}
            className={adminInputClass}
            placeholder="りんご"
            onChange={(e) => updateField("meaning", e.target.value)}
          />
        </AdminFormField>

        {/* 発音記号を入力する場所 */}
        <AdminFormField label="発音記号">
          <input
            type="text"
            value={newWord.pronunciation || ""}
            className={adminInputClass}
            placeholder="/ˈæp.əl/"
            onChange={(e) => updateField("pronunciation", e.target.value)}
          />
        </AdminFormField>

        {/* 名詞や動詞などの種類を選ぶ場所 */}
        <AdminFormField label="品詞">
          <select
            value={newWord.part_of_speech || "noun"}
            className={adminInputClass}
            onChange={(e) => updateField("part_of_speech", e.target.value)}
          >
            <option value="noun">名詞 (noun)</option>
            <option value="verb">動詞 (verb)</option>
            <option value="adj">形容詞 (adj)</option>
            <option value="adv">副詞 (adv)</option>
          </select>
        </AdminFormField>

        {/* 難易度（初級・中級・上級）を選ぶ場所 */}
        <AdminFormField label="難易度">
          <select
            value={newWord.difficulty}
            className={adminInputClass}
            onChange={(e) => updateField("difficulty", e.target.value)}
          >
            <option value="beginner">初級 (beginner)</option>
            <option value="intermediate">中級 (intermediate)</option>
            <option value="advanced">上級 (advanced)</option>
          </select>
        </AdminFormField>

        {/* カテゴリー（日常会話など）を選ぶ場所 */}
        <AdminFormField label="カテゴリー">
          <select
            value={newWord.category || "general"}
            className={adminInputClass}
            onChange={(e) => updateField("category", e.target.value)}
          >
            {WORD_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </AdminFormField>

        {/* 登録ボタンを表示する場所 */}
        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all disabled:opacity-50"
          >
            {loading ? (
              // 登録中のぐるぐるマーク
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "単語を登録する"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
