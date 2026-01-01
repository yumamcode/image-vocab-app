"use client";

import { Trophy, Volume2 as VolumeIcon, Type, ImageIcon } from "lucide-react";
import { AppView } from "@/types/view";
import { BaseSubNavigation } from "./BaseSubNavigation";

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
  
  const getConfig = () => {
    switch (view) {
      case "quiz-listening":
        return {
          icon: <VolumeIcon className="h-8 w-8 text-orange-500" />,
          title: "リスニング問題",
        };
      case "quiz-spelling":
        return {
          icon: <Type className="h-8 w-8 text-blue-500" />,
          title: "スペル入力",
        };
      case "quiz-image-choice":
        return {
          icon: <ImageIcon className="h-8 w-8 text-purple-500" />,
          title: "画像選択問題",
        };
      case "quiz-4-choice":
        return {
          icon: <Trophy className="h-8 w-8 text-primary" />,
          title: "4択クイズ",
        };
      case "quiz-menu":
      default:
        return {
          icon: <Trophy className="h-8 w-8 text-primary" />,
          title: "Quiz Modes",
        };
    }
  };

  const { icon, title } = getConfig();

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

