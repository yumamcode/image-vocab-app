import React from "react";
import { Search, Loader2, Check, Upload } from "lucide-react";
import { Word } from "@/types/word";

interface WordTableProps {
  words: Word[];
  loading: boolean;
  search: string;
  setSearch: (value: string) => void;
  onEditClick: (word: Word) => void;
  uploadingId: number | null;
  dragOverId: number | null;
  onRowDragOver: (e: React.DragEvent, id: number) => void;
  onRowDragLeave: () => void;
  onRowDrop: (e: React.DragEvent, id: number) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, wordId: number) => void;
}

export function WordTable({
  words,
  loading,
  search,
  setSearch,
  onEditClick,
  uploadingId,
  dragOverId,
  onRowDragOver,
  onRowDragLeave,
  onRowDrop,
  onImageUpload,
}: WordTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="単語や意味で検索..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                単語
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                意味
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                カテゴリー
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                画像
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <Loader2
                    className="animate-spin mx-auto text-primary mb-2"
                    size={32}
                  />
                  <p className="text-gray-500">単語を読み込み中...</p>
                </td>
              </tr>
            ) : words.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  単語が見つかりません
                </td>
              </tr>
            ) : (
              words.map((word) => (
                <tr
                  key={word.id}
                  onClick={() => onEditClick(word)}
                  onDragOver={(e) => onRowDragOver(e, word.id)}
                  onDragLeave={onRowDragLeave}
                  onDrop={(e) => onRowDrop(e, word.id)}
                  className={`hover:bg-gray-50 transition-all cursor-pointer ${
                    dragOverId === word.id
                      ? "bg-blue-50 ring-2 ring-blue-400 ring-inset scale-[1.01]"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{word.word}</div>
                    <div className="text-xs text-gray-400 font-mono">
                      {word.pronunciation}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{word.meaning}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold uppercase">
                      {word.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {word.image_url ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={word.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0 right-0 bg-green-500 text-white p-0.5 rounded-bl">
                          <Check size={10} />
                        </div>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                        なし
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <label
                      className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        uploadingId === word.id
                          ? "bg-gray-100 text-gray-400"
                          : "bg-primary/10 text-primary hover:bg-primary/20"
                      }`}
                    >
                      {uploadingId === word.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                      {word.image_url ? "変更" : "登録"}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        disabled={uploadingId !== null}
                        onChange={(e) => onImageUpload(e, word.id)}
                      />
                    </label>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

