import { Trophy, Volume2 as VolumeIcon, Type, ImageIcon } from "lucide-react";
import { AppView } from "@/types/view";
import { ReactNode } from "react";

interface QuizConfig {
  icon: ReactNode;
  title: string;
}

export const getQuizConfig = (view: AppView): QuizConfig => {
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

