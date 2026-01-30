"use client";

import { Loader2 } from "lucide-react";

export function LearnLoading() {
  return (
    <div className="py-20 text-center">
      <Loader2 className="animate-spin mx-auto text-primary mb-4" size={48} />
      <p className="text-gray-500">学習データを読み込み中...</p>
    </div>
  );
}
