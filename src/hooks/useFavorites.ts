"use client";

import { useState, useCallback } from "react";

/**
 * お気に入り機能を管理するためのカスタムフック
 * 
 * 中学生向け解説:
 * これは「お気に入りリスト」を管理するための便利なツールです。
 * どの単語やアイテムがお気に入りに入っているかを覚えておいて、
 * ボタンが押されたときに入れ替えたり（追加・削除）する役割を持っています。
 */
export function useFavorites() {
  // favorites: 現在お気に入りに入っているID（番号）のリスト。
  // Set を使っているのは、同じ番号がダブらないようにするためです（出席番号のリストのようなイメージ）。
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  /**
   * お気に入りの状態を切り替える関数
   * 
   * 解説:
   * スイッチのように、すでにお気に入りなら「消す」、入っていなければ「追加する」という動きをします。
   */
  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      // 今までのリストをコピーして新しいリスト（next）を作ります
      const next = new Set(prev);
      if (next.has(id)) {
        // もしリストにその番号があったら、削除します（お気に入り解除）
        next.delete(id);
      } else {
        // リストになかったら、新しく追加します（お気に入り登録）
        next.add(id);
      }
      // 新しく作ったリストを保存します
      return next;
    });
  }, []);

  // favorites（お気に入りリスト本体）と toggleFavorite（切り替えスイッチ）を外で使えるようにします
  return { favorites, toggleFavorite };
}
