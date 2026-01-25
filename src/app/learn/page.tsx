"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { WordCard } from "@/components/learn/WordCard";
import { PrefetchImages } from "@/components/common/PrefetchImages";
import { LearnNavigation } from "@/components/navigation/LearnNavigation";
import { SessionHeader } from "@/components/session/SessionHeader";
import { SessionFinishedView } from "@/components/session/SessionFinishedView";
import { useWords } from "@/hooks/useWords";
import { useLearningSession } from "@/hooks/useLearningSession";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";

function LearnContent() {
  const { setView } = useAppNavigation();
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
    goToNextWord,
    toggleFavorite,
  } = useLearningSession(words);

  useEffect(() => {
    if (words.length > 0 && sessionWords.length === 0 && !isFinished) {
      startSession(count);
    }
  }, [words, sessionWords.length, isFinished, startSession, count]);

  return (
    <div className="min-h-screen bg-background">
      <PrefetchImages
        imageUrls={sessionWords.map((w) => w.image_url)}
        currentIndex={currentIndex}
      />
      <LearnNavigation
        view="learn"
        onBack={() => setView("home")}
        currentIndex={currentIndex}
        totalWords={sessionWords.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isFinished ? (
          <SessionFinishedView
            title="🎉 お疲れ様でした！"
            description={`${sessionWords.length}単語の学習が完了しました。素晴らしい進歩です！`}
            onRestart={() => setView("learn-settings")}
            onHome={() => setView("home")}
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
                  key={currentWord?.id || currentIndex}
                  word={currentWord}
                  isFavorite={favorites.has(currentWord?.id)}
                  onToggleFavorite={() => toggleFavorite(currentWord.id)}
                  onAnswer={handleAnswer}
                  onNext={goToNextWord}
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
                onClick={() => setView("home")}
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
