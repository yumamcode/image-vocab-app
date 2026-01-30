"use client";

import { WordCard } from "@/components/learn/WordCard";
import { PrefetchImages } from "@/components/common/PrefetchImages";
import { LearnNavigation } from "@/components/navigation/LearnNavigation";
import { SessionHeader } from "@/components/session/SessionHeader";
import { SessionFinishedView } from "@/components/session/SessionFinishedView";
import { LearnLoading } from "./LearnLoading";
import { LearnEmpty } from "./LearnEmpty";

/**
 * LearnViewProps: この画面を表示するために必要な「データ」や「機能」のリストです。
 * 
 * - loading: 読み込み中かどうか（くるくる回る画面を出すか）
 * - isFinished: 全部の単語が終わったかどうか
 * - sessionWords: 今回勉強する単語のリスト
 * - currentIndex: 今何番目の単語を見ているか
 * - currentWord: 今表示している単語のデータ
 * - progressPercent: 進み具合（％）
 * - favorites: お気に入り登録している単語の番号
 * - setView: 画面を切り替えるための機能（ホームに戻るなど）
 * - toggleFavorite: お気に入りのオンオフを切り替える機能
 * - handleAnswer: 正解・不正解を判定した時の処理
 * - goToNextWord: 次の単語に進む機能
 */
interface LearnViewProps {
  loading: boolean;
  isFinished: boolean;
  sessionWords: any[];
  currentIndex: number;
  currentWord: any;
  progressPercent: number;
  favorites: Set<number>;
  setView: (view: any) => void;
  toggleFavorite: (id: number) => void;
  handleAnswer: (isCorrect: boolean) => void;
  goToNextWord: () => void;
}

/**
 * LearnView: 単語学習のメイン画面を作る部品です。
 * 
 * 中学生のみなさんへ：
 * この関数は、今の状況（読み込み中、勉強中、終わった後）に合わせて、
 * 画面に何を出すかを決める「司令塔」のような役割をしています。
 */
export function LearnView({
  loading,
  isFinished,
  sessionWords,
  currentIndex,
  currentWord,
  progressPercent,
  favorites,
  setView,
  toggleFavorite,
  handleAnswer,
  goToNextWord,
}: LearnViewProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* 次に使う画像をあらかじめ準備しておく（動きをスムーズにするため） */}
      <PrefetchImages
        imageUrls={sessionWords.map((w) => w.image_url)}
        currentIndex={currentIndex}
      />
      
      {/* 画面の一番上にあるナビゲーション（戻るボタンや今の場所を表示） */}
      <LearnNavigation
        view="learn"
        onBack={() => setView("home")}
        currentIndex={currentIndex}
        totalWords={sessionWords.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* もし全部終わっていたら「お疲れ様」画面を出す */}
        {isFinished ? (
          <SessionFinishedView
            title="🎉 お疲れ様でした！"
            description={`${sessionWords.length}単語の学習が完了しました。素晴らしい進歩です！`}
            onRestart={() => setView("learn-settings")}
            onHome={() => setView("home")}
            buttonColorClass="gradient-primary"
          />
        ) : (
          /* まだ終わっていなければ、学習画面を出す */
          <div className="space-y-12">
            {/* 今の進み具合をバーや数字で表示するヘッダー */}
            <SessionHeader
              progressPercent={progressPercent}
              currentIndex={currentIndex}
              totalWords={sessionWords.length}
              colorClass="text-primary"
            />

            <div className="flex flex-col items-center">
              {/* 読み込み中なら「読み込み中...」の画面、
                  単語があれば「単語カード」、
                  単語がなければ「空っぽ」の画面を出す */}
              {loading ? (
                <LearnLoading />
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
                <LearnEmpty />
              )}
            </div>

            {/* 画面の下の方に「ホームに戻る」ボタンを配置 */}
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
