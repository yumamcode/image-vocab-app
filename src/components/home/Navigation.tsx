"use client";

import {
  BookOpen,
  Brain,
  Trophy,
  Volume2 as VolumeIcon,
  Type,
  ImageIcon,
} from "lucide-react";
import { AppView } from "@/types/view";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavigationProps {
  view: AppView;
  setView?: (view: AppView) => void;
  startLearning: () => void;
  currentIndex: number;
  totalWords: number;
}

export function Navigation({
  view,
  setView,
  startLearning,
  currentIndex,
  totalWords,
}: NavigationProps) {
  const router = useRouter();

  const handleBack = () => {
    if (setView) {
      if (
        view === "learn" ||
        view === "quiz-menu" ||
        view === "learn-settings"
      ) {
        setView("home");
      } else {
        setView("quiz-menu");
      }
      return;
    }

    // fallback to routing
    if (view === "learn" || view === "quiz-menu" || view === "learn-settings") {
      router.push("/");
    } else {
      router.push("/quiz");
    }
  };

  if (view === "home") {
    return (
      <nav className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link
              href="/"
              className="flex items-center space-x-3 cursor-pointer"
            >
              <BookOpen className="h-9 w-9 text-primary" />
              <span className="text-3xl font-bold text-gradient font-serif">
                Imavo
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={startLearning}
                className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-medium"
              >
                <Brain size={20} /> イラスト学習
              </button>
              <Link
                href="/quiz"
                className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-medium"
              >
                <Trophy size={20} /> 多様なクイズ形式
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-medium"
          >
            <span className="text-xl">←</span>{" "}
            {view === "learn" ||
            view === "quiz-menu" ||
            view === "learn-settings"
              ? "ホームに戻る"
              : "クイズメニューへ"}
          </button>

          <div className="flex items-center space-x-3">
            {view === "quiz-menu" || view === "quiz-4-choice" ? (
              <Trophy className="h-8 w-8 text-primary" />
            ) : view === "quiz-listening" ? (
              <VolumeIcon className="h-8 w-8 text-orange-500" />
            ) : view === "quiz-spelling" ? (
              <Type className="h-8 w-8 text-blue-500" />
            ) : view === "quiz-image-choice" ? (
              <ImageIcon className="h-8 w-8 text-purple-500" />
            ) : (
              <BookOpen className="h-8 w-8 text-primary" />
            )}
            <span className="text-2xl font-bold text-gradient font-serif">
              {view === "quiz-menu"
                ? "Quiz Modes"
                : view === "quiz-4-choice"
                ? "4択クイズ"
                : view === "quiz-listening"
                ? "リスニング問題"
                : view === "quiz-spelling"
                ? "スペル入力"
                : view === "quiz-image-choice"
                ? "画像選択問題"
                : "Imavo"}
            </span>
          </div>

          <div className="text-foreground font-bold text-lg">
            {view !== "quiz-menu" && view !== "learn-settings" && (
              <>
                {currentIndex + 1} / {totalWords}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
