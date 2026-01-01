"use client";

import { BookOpen, Brain, Trophy } from "lucide-react";
import Link from "next/link";

interface HomeNavigationProps {
  startLearning: () => void;
}

export function HomeNavigation({ startLearning }: HomeNavigationProps) {
  return (
    <nav className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3 cursor-pointer">
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
