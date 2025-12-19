"use client";

import { ChevronRight } from "lucide-react";

interface QuizMenuViewProps {
  quizModes: any[];
  start4ChoiceQuiz: () => void;
  startListeningQuiz: () => void;
  startSpellingQuiz: () => void;
  startImageChoiceQuiz: () => void;
  startLearning: () => void;
}

export function QuizMenuView({
  quizModes,
  start4ChoiceQuiz,
  startListeningQuiz,
  startSpellingQuiz,
  startImageChoiceQuiz,
  startLearning,
}: QuizMenuViewProps) {
  return (
    <div className="animate-fade-in">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground font-serif">
            クイズ形式を選択
          </h2>
          <p className="text-xl text-muted-foreground">
            自分に合ったスタイルで、知識の定着を確認しましょう
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                if (mode.id === "multiple-choice") {
                  start4ChoiceQuiz();
                } else if (mode.id === "listening") {
                  startListeningQuiz();
                } else if (mode.id === "spelling") {
                  startSpellingQuiz();
                } else if (mode.id === "image-choice") {
                  startImageChoiceQuiz();
                } else {
                  startLearning();
                }
              }}
              className="bg-white p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group flex items-center text-left gap-6"
            >
              <div
                className={`${mode.color} w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
              >
                <mode.icon size={40} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">
                  {mode.title}
                </h3>
                <p className="text-gray-500">{mode.description}</p>
              </div>
              <ChevronRight
                className="text-gray-300 group-hover:text-primary transition-colors"
                size={32}
              />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

