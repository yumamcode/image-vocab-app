"use client";

import { BookOpen } from "lucide-react";
import { AppView } from "@/types/view";
import { BaseSubNavigation } from "./BaseSubNavigation";

interface LearnNavigationProps {
  view: AppView;
  onBack: () => void;
  currentIndex?: number;
  totalWords?: number;
}

export function LearnNavigation({
  view,
  onBack,
  currentIndex,
  totalWords,
}: LearnNavigationProps) {
  const isSettings = view === "learn-settings";

  return (
    <BaseSubNavigation
      backButtonText="ホームに戻る"
      onBack={onBack}
      icon={<BookOpen className="h-8 w-8 text-primary" />}
      title="Imavo"
      currentIndex={currentIndex}
      totalWords={totalWords}
      showProgress={!isSettings}
    />
  );
}
