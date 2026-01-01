"use client";

import { useState } from "react";
import { Brain, Sparkles } from "lucide-react";
import { useAppNavigation } from "@/hooks/useAppNavigation";

export function LearnSettingsView() {
  const { setView } = useAppNavigation();
  const [questionCount, setQuestionCount] = useState(10);

  const handleBeginLearning = () => {
    setView("learn", { count: questionCount });
  };

  return (
    <div className="animate-fade-in">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-border/50 text-center">
          <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-8 shadow-lg">
            <Brain size={40} />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 font-serif mb-4">
            学習設定
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            今回のセッションで学習する問題数を選択してください
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
            {[5, 10, 20, 30, 50, -1].map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`py-4 rounded-2xl font-bold text-xl transition-all border-2 ${
                  questionCount === count
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg scale-105"
                    : "bg-white border-gray-100 text-gray-600 hover:border-blue-200"
                }`}
              >
                {count === -1 ? "すべて" : `${count}問`}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleBeginLearning}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-2xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
            >
              <Sparkles size={24} /> 学習を開始する
            </button>
            <button
              onClick={() => setView("home")}
              className="w-full py-5 bg-muted text-foreground rounded-2xl font-bold text-xl hover:bg-muted/80 transition-all"
            >
              キャンセル
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
