"use client";

import { useState, useCallback } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return { favorites, toggleFavorite };
}
