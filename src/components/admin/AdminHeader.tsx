import React from "react";
import { Upload, Loader2 } from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  isAdding: boolean;
  setIsAdding: (value: boolean) => void;
  uploadingBulk: boolean;
  onBulkUpload: () => void;
}

export function AdminHeader({
  isAdding,
  setIsAdding,
  uploadingBulk,
  onBulkUpload,
}: AdminHeaderProps) {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-gray-900">
          管理者ダッシュボード
        </h1>
        <p className="text-gray-500">単語データ管理と画像登録</p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-all flex items-center gap-2"
        >
          {isAdding ? "フォームを閉じる" : "＋ 新規単語登録"}
        </button>
        <button
          onClick={onBulkUpload}
          disabled={uploadingBulk}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {uploadingBulk ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Upload size={20} />
          )}
          フォルダから一括登録
        </button>
        <Link
          href="/"
          className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-700 transition-all"
        >
          ホームへ
        </Link>
      </div>
    </header>
  );
}

