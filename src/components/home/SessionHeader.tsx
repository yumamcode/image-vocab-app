"use client";

interface SessionHeaderProps {
  progressPercent: number;
  currentIndex: number;
  totalWords: number;
  colorClass: string;
}

export function SessionHeader({ progressPercent, currentIndex, totalWords, colorClass }: SessionHeaderProps) {
  return (
    <header className="flex flex-col items-center gap-6">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-end mb-3">
          <span className={`text-sm font-bold ${colorClass} uppercase tracking-wider`}>
            進捗: {progressPercent}%
          </span>
          <span className="text-sm font-bold text-muted-foreground">
            {currentIndex + 1} / {totalWords}
          </span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full ${colorClass.startsWith('bg-') ? colorClass : colorClass.replace('text-', 'bg-')} transition-all duration-500 ease-out`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
}

