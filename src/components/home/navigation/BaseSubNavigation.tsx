"use client";

import { ReactNode } from "react";

interface BaseSubNavigationProps {
  backButtonText: string;
  onBack: () => void;
  icon: ReactNode;
  title: string;
  currentIndex?: number;
  totalWords?: number;
  showProgress?: boolean;
}

export function BaseSubNavigation({
  backButtonText,
  onBack,
  icon,
  title,
  currentIndex,
  totalWords,
  showProgress = false,
}: BaseSubNavigationProps) {
  return (
    <nav className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-medium"
          >
            <span className="text-xl">←</span> {backButtonText}
          </button>

          <div className="flex items-center space-x-3">
            {icon}
            <span className="text-2xl font-bold text-gradient font-serif">
              {title}
            </span>
          </div>

          <div className="text-foreground font-bold text-lg">
            {showProgress &&
              currentIndex !== undefined &&
              totalWords !== undefined && (
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
