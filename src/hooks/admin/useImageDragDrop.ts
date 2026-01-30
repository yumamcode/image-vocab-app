import { useState } from "react";

/**
 * マウスで画像を引っ張ってきて（ドラッグ＆ドロップ）置く時の状態を管理する道具（フック）です。
 */
export function useImageDragDrop() {
  // 今、画像を引っ張ってきている（ドラッグ中）かどうか
  const [isDragging, setIsDragging] = useState(false);
  // どの単語の上に画像が重なっているか（IDで覚える）
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  return {
    isDragging,
    setIsDragging,
    dragOverId,
    setDragOverId,
  };
}
