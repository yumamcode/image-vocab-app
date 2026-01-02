import React from "react";

export function WordTableHeader() {
  const headers = ["単語", "意味", "カテゴリー", "画像", "操作"];

  return (
    <thead className="bg-gray-50">
      <tr>
        {headers.map((header) => (
          <th
            key={header}
            className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
