"use client";

import { AppView } from "@/types/view";
import { BaseSubNavigation } from "./BaseSubNavigation";
import { getQuizConfig } from "@/constants/quiz";

interface QuizNavigationProps {
  view: AppView;
  onBack: () => void;
  currentIndex?: number;
  totalWords?: number;
}

export function QuizNavigation({
  view,
  onBack,
  currentIndex,
  totalWords,
}: QuizNavigationProps) {
  const isMenu = view === "quiz-menu";
  const { icon, title } = getQuizConfig(view);

  return (
    <BaseSubNavigation
      backButtonText={isMenu ? "ホームに戻る" : "クイズメニューへ"}
      onBack={onBack}
      icon={icon}
      title={title}
      currentIndex={currentIndex}
      totalWords={totalWords}
      showProgress={!isMenu}
    />
  );
}
