import React from "react";
import { Loader2 } from "lucide-react";
import { Word } from "@/types/word";
import { WordSearch } from "./WordSearch";
import { WordTableHeader } from "./WordTableHeader";
import { WordTableRow } from "./WordTableRow";

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
  onImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    wordId: number
  ) => void;
}

export function WordTable(props: WordTableProps) {
  const { words, loading, search, setSearch } = props;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <WordSearch search={search} onSearchChange={setSearch} />

      <div className="overflow-x-auto">
        <table className="w-full">
          <WordTableHeader />
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
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  単語が見つかりません
                </td>
              </tr>
            ) : (
              words.map((word) => (
                <WordTableRow key={word.id} {...props} word={word} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
