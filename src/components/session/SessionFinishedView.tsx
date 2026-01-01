"use client";

interface SessionFinishedViewProps {
  title: string;
  description: string;
  onRestart: () => void;
  onHome: () => void;
  buttonColorClass: string;
}

export function SessionFinishedView({
  title,
  description,
  onRestart,
  onHome,
  buttonColorClass,
}: SessionFinishedViewProps) {
  return (
    <div className="max-w-2xl mx-auto animate-scale-in">
      <div className="bg-white p-12 rounded-3xl shadow-2xl text-center border border-border/50">
        <h2 className="text-4xl font-bold text-gradient font-serif mb-6">
          {title}
        </h2>
        <p className="text-xl text-muted-foreground mb-10">
          {description}
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={onRestart}
            className={`w-full py-5 ${buttonColorClass} text-white rounded-2xl font-bold text-xl shadow-lg hover:opacity-90 transition-all`}
          >
            もう一度挑戦する
          </button>
          <button
            onClick={onHome}
            className="w-full py-5 bg-muted text-foreground rounded-2xl font-bold text-xl hover:bg-muted/80 transition-all"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    </div>
  );
}

