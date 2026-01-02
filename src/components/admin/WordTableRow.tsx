import React from "react";
import { Check, Loader2, Upload } from "lucide-react";
import { Word } from "@/types/word";
import { WORD_CATEGORIES } from "@/constants/word";

interface WordTableRowProps {
  word: Word;
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

export function WordTableRow({
  word,
  onEditClick,
  uploadingId,
  dragOverId,
  onRowDragOver,
  onRowDragLeave,
  onRowDrop,
  onImageUpload,
}: WordTableRowProps) {
  const isUploading = uploadingId === word.id;
  const isDragOver = dragOverId === word.id;

  return (
    <tr
      onClick={() => onEditClick(word)}
      onDragOver={(e) => onRowDragOver(e, word.id)}
      onDragLeave={onRowDragLeave}
      onDrop={(e) => onRowDrop(e, word.id)}
      className={`hover:bg-gray-50 transition-all cursor-pointer ${
        isDragOver
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
          {WORD_CATEGORIES.find((c) => c.value === word.category)?.label ||
            word.category}
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
            isUploading
              ? "bg-gray-100 text-gray-400"
              : "bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          {isUploading ? (
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
  );
}
