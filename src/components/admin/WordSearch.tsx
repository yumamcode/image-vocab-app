import React from "react";
import { Search } from "lucide-react";

interface WordSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function WordSearch({ search, onSearchChange }: WordSearchProps) {
  return (
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
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
