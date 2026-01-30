"use client";

import Link from "next/link";

export function LearnEmpty() {
  return (
    <div className="py-20 text-center">
      <p className="text-gray-500 mb-4">
        単語データがありません。管理画面から投入してください。
      </p>
      <Link href="/admin" className="text-primary font-bold hover:underline">
        管理者画面へ
      </Link>
    </div>
  );
}
