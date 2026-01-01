"use client";

import React, { useEffect, useState } from "react";

interface PrefetchImagesProps {
  imageUrls: string[];
  currentIndex: number;
  count?: number;
}

/**
 * 次に表示される予定の画像をあらかじめ読み込んでキャッシュさせるコンポーネント
 */
export const PrefetchImages: React.FC<PrefetchImagesProps> = ({
  imageUrls,
  currentIndex,
  count = 3,
}) => {
  const [prefetchedUrls, setPrefetchedUrls] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 現在のインデックスから count 分だけ先の画像 URL を取得
    const nextUrls = imageUrls
      .slice(currentIndex + 1, currentIndex + 1 + count)
      .filter((url) => url && !prefetchedUrls.has(url));

    if (nextUrls.length === 0) return;

    // 新しい URL をプリフェッチ済みリストに追加
    setPrefetchedUrls((prev) => {
      const next = new Set(prev);
      nextUrls.forEach((url) => next.add(url));
      return next;
    });

    // 実際のプリフェッチ処理（Image オブジェクトを作成してブラウザにキャッシュさせる）
    nextUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [imageUrls, currentIndex, count, prefetchedUrls]);

  // UI には何も表示しない
  return null;
};

