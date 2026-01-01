import React from "react";
import { Upload, Loader2 } from "lucide-react";

interface BulkUploadZoneProps {
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  uploadingBulk: boolean;
  bulkStatus: { current: number; total: number } | null;
  onFilesDrop: (files: FileList | File[]) => void;
}

export function BulkUploadZone({
  isDragging,
  setIsDragging,
  uploadingBulk,
  bulkStatus,
  onFilesDrop,
}: BulkUploadZoneProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    onFilesDrop(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`mb-8 p-12 border-4 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center text-center ${
        isDragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {uploadingBulk ? (
        <div className="space-y-4">
          <Loader2 className="animate-spin text-primary mx-auto" size={48} />
          <div className="text-xl font-bold text-gray-900">
            アップロード中...
          </div>
          {bulkStatus && (
            <div className="text-gray-500">
              {bulkStatus.current} / {bulkStatus.total} 枚を処理中
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Upload className="text-primary" size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            画像をここにドラッグ＆ドロップ
          </h2>
          <p className="text-gray-500 mb-6">
            ファイル名を「単語名.jpg/png」にしてドロップすると、自動的に紐付けて一括登録します。
          </p>
          <label className="cursor-pointer bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all">
            ファイルを選択
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && onFilesDrop(e.target.files)}
            />
          </label>
        </>
      )}
    </div>
  );
}

