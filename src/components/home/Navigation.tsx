"use client";

import { AppView } from "@/types/view";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { HomeNavigation } from "./navigation/HomeNavigation";
import { QuizNavigation } from "./navigation/QuizNavigation";
import { LearnNavigation } from "./navigation/LearnNavigation";

interface NavigationProps {
  view: AppView;
  setView?: (view: AppView) => void;
  startLearning: () => void;
  currentIndex?: number;
  totalWords?: number;
}

export function Navigation({
  view,
  setView: propsSetView,
  startLearning,
  currentIndex,
  totalWords,
}: NavigationProps) {
  const { setView } = useAppNavigation();
  const effectiveSetView = propsSetView || setView;

  const handleBack = () => {
    if (view === "learn" || view === "quiz-menu" || view === "learn-settings") {
      effectiveSetView("home");
    } else {
      effectiveSetView("quiz-menu");
    }
  };

  if (view === "home") {
    return <HomeNavigation startLearning={startLearning} />;
  }

  if (view.startsWith("quiz")) {
    return (
      <QuizNavigation
        view={view}
        onBack={handleBack}
        currentIndex={currentIndex}
        totalWords={totalWords}
      />
    );
  }

  return (
    <LearnNavigation
      view={view}
      onBack={handleBack}
      currentIndex={currentIndex}
      totalWords={totalWords}
    />
  );
}
