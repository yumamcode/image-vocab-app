"use client";
import { BookOpen } from "lucide-react";
import { AppView } from "@/types/view";
import { BaseSubNavigation } from "./BaseSubNavigation";

interface LearnSettingsNavigationProps {
  view: AppView;
  onBack: () => void;
}

export function LearnSettingsNavigation({
  view,
  onBack,
}: LearnSettingsNavigationProps) {
  const isSettings = view === "learn-settings";

  return (
    <BaseSubNavigation
      backButtonText="ホームに戻る"
      onBack={onBack}
      icon={<BookOpen className="h-8 w-8 text-primary" />}
      title="Imavo"
      showProgress={!isSettings}
    />
  );
}
