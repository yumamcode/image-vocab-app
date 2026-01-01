"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WordCard } from "@/components/WordCard";
import { Navigation } from "@/components/home/Navigation";
import { SessionHeader } from "@/components/home/SessionHeader";
import { SessionFinishedView } from "@/components/home/SessionFinishedView";
import { useWords } from "@/hooks/useWords";
import { useLearningSession } from "@/hooks/useLearningSession";
import { Loader2 } from "lucide-react";
import Link from "next/link";

function LearnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const countParam = searchParams.get("count");
  const count = countParam ? parseInt(countParam) : 10;

  const { words, loading } = useWords();
  const {
    sessionWords,
    currentIndex,
    isFinished,
    favorites,
    currentWord,
    progressPercent,
    startSession,
    handleAnswer,
    toggleFavorite,
  } = useLearningSession(words);

  useEffect(() => {
    if (words.length > 0 && sessionWords.length === 0 && !isFinished) {
      startSession(count);
    }
  }, [words, sessionWords.length, isFinished, startSession, count]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        view="learn"
        startLearning={() => router.push("/learn/settings")}
        currentIndex={currentIndex}
        totalWords={sessionWords.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isFinished ? (
          <SessionFinishedView
            title="🎉 お疲れ様でした！"
            description={`${sessionWords.length}単語の学習が完了しました。素晴らしい進歩です！`}
            onRestart={() => router.push("/learn/settings")}
            onHome={() => router.push("/")}
            buttonColorClass="gradient-primary"
          />
        ) : (
          <div className="space-y-12">
            <SessionHeader
              progressPercent={progressPercent}
              currentIndex={currentIndex}
              totalWords={sessionWords.length}
              colorClass="text-primary"
            />

            <div className="flex flex-col items-center">
              {loading ? (
                <div className="py-20 text-center">
                  <Loader2
                    className="animate-spin mx-auto text-primary mb-4"
                    size={48}
                  />
                  <p className="text-gray-500">学習データを読み込み中...</p>
                </div>
              ) : sessionWords.length > 0 ? (
                <WordCard
                  word={currentWord}
                  isFavorite={favorites.has(currentWord?.id)}
                  onToggleFavorite={() => toggleFavorite(currentWord.id)}
                  onAnswer={handleAnswer}
                />
              ) : (
                <div className="py-20 text-center">
                  <p className="text-gray-500 mb-4">
                    単語データがありません。管理画面から投入してください。
                  </p>
                  <Link
                    href="/admin"
                    className="text-primary font-bold hover:underline"
                  >
                    管理者画面へ
                  </Link>
                </div>
              )}
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => router.push("/")}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-2"
              >
                ← 学習を中断してホームに戻る
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      }
    >
      <LearnContent />
    </Suspense>
  );
}
