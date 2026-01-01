import React from "react";
import { Loader2 } from "lucide-react";
import { NewWord } from "@/types/word";

interface AddWordFormProps {
  newWord: NewWord;
  setNewWord: (word: NewWord) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function AddWordForm({
  newWord,
  setNewWord,
  onSubmit,
  loading,
}: AddWordFormProps) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 mb-8 animate-fade-in text-gray-900">
      <h2 className="text-2xl font-bold mb-6">新規単語登録</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            英単語 *
          </label>
          <input
            type="text"
            required
            value={newWord.word}
            onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            placeholder="apple"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            意味 *
          </label>
          <input
            type="text"
            required
            value={newWord.meaning}
            onChange={(e) => setNewWord({ ...newWord, meaning: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            placeholder="りんご"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            発音記号
          </label>
          <input
            type="text"
            value={newWord.pronunciation || ""}
            onChange={(e) =>
              setNewWord({ ...newWord, pronunciation: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            placeholder="/ˈæp.əl/"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            品詞
          </label>
          <select
            value={newWord.part_of_speech || "noun"}
            onChange={(e) =>
              setNewWord({ ...newWord, part_of_speech: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
          >
            <option value="noun">名詞 (noun)</option>
            <option value="verb">動詞 (verb)</option>
            <option value="adj">形容詞 (adj)</option>
            <option value="adv">副詞 (adv)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            難易度
          </label>
          <select
            value={newWord.difficulty}
            onChange={(e) =>
              setNewWord({
                ...newWord,
                difficulty: e.target.value as any,
              })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
          >
            <option value="beginner">初級 (beginner)</option>
            <option value="intermediate">中級 (intermediate)</option>
            <option value="advanced">上級 (advanced)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            カテゴリー
          </label>
          <input
            type="text"
            value={newWord.category || ""}
            onChange={(e) => setNewWord({ ...newWord, category: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            placeholder="fruit"
          />
        </div>
        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all disabled:opacity-50"
          >
            {loading ? (
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

