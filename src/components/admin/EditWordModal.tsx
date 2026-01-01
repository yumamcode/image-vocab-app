import React from "react";
import { X, Loader2 } from "lucide-react";
import { Word } from "@/types/word";

interface EditWordModalProps {
  word: Word;
  setWord: (word: Word) => void;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function EditWordModal({
  word,
  setWord,
  isOpen,
  onClose,
  onSubmit,
  loading,
}: EditWordModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in text-gray-900">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-2xl font-bold">単語情報を編集</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                英単語
              </label>
              <input
                type="text"
                required
                value={word.word}
                onChange={(e) => setWord({ ...word, word: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                意味
              </label>
              <input
                type="text"
                required
                value={word.meaning}
                onChange={(e) => setWord({ ...word, meaning: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                発音記号
              </label>
              <input
                type="text"
                value={word.pronunciation || ""}
                onChange={(e) =>
                  setWord({ ...word, pronunciation: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                品詞
              </label>
              <select
                value={word.part_of_speech || "noun"}
                onChange={(e) =>
                  setWord({ ...word, part_of_speech: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
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
                value={word.difficulty || "beginner"}
                onChange={(e) =>
                  setWord({
                    ...word,
                    difficulty: e.target.value as any,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
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
                value={word.category || ""}
                onChange={(e) => setWord({ ...word, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "保存する"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

