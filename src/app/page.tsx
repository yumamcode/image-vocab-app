"use client";
// アプリケーションのトップページコンポーネント
import { useState } from "react";
import Link from "next/link";
import { WordCard } from "@/components/WordCard";
import { MultipleChoiceQuiz } from "@/components/MultipleChoiceQuiz";
import { ListeningQuiz } from "@/components/ListeningQuiz";
import { SpellingQuiz } from "@/components/SpellingQuiz";
import { ImageChoiceQuiz } from "@/components/ImageChoiceQuiz";
import { useUser } from "@/hooks/useUser";
import { useWords } from "@/hooks/useWords";
import { useLearningSession } from "@/hooks/useLearningSession";
import { Navigation } from "@/components/home/Navigation";
import { HeroSection, FeaturesSection } from "@/components/home/HomeView";
import { LearnSettingsView } from "@/components/home/LearnSettingsView";
import { QuizMenuView } from "@/components/home/QuizMenuView";
import { SessionHeader } from "@/components/home/SessionHeader";
import { SessionFinishedView } from "@/components/home/SessionFinishedView";
import { QUIZ_MODES, FEATURES } from "@/constants/navigation";
import { Loader2 } from "lucide-react";
import { AppView } from "@/types/view";

export default function Home() {
  const [view, setView] = useState<AppView>("home");
  const [questionCount, setQuestionCount] = useState(10);
  const { user } = useUser();
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
  } = useLearningSession(words, user);

  const startLearning = () => {
    setView("learn-settings");
  };

  const beginLearning = (count: number) => {
    startSession(count);
    setView("learn");
  };

  const start4ChoiceQuiz = (count: number = 10) => {
    startSession(count);
    setView("quiz-4-choice");
  };

  const startListeningQuiz = (count: number = 10) => {
    startSession(count);
    setView("quiz-listening");
  };

  const startSpellingQuiz = (count: number = 10) => {
    startSession(count);
    setView("quiz-spelling");
  };

  const startImageChoiceQuiz = (count: number = 10) => {
    startSession(count);
    setView("quiz-image-choice");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        view={view}
        setView={setView}
        startLearning={startLearning}
        currentIndex={currentIndex}
        totalWords={sessionWords.length}
      />

      {view === "home" ? (
        /* Hero & Features */
        <div className="animate-fade-in">
          <HeroSection startLearning={startLearning} />
          <FeaturesSection
            features={FEATURES}
            setView={setView}
            startLearning={startLearning}
          />
        </div>
      ) : view === "learn-settings" ? (
        <LearnSettingsView
          questionCount={questionCount}
          setQuestionCount={setQuestionCount}
          beginLearning={beginLearning}
          setView={setView}
        />
      ) : view === "quiz-menu" ? (
        <QuizMenuView
          quizModes={QUIZ_MODES}
          start4ChoiceQuiz={start4ChoiceQuiz}
          startListeningQuiz={startListeningQuiz}
          startSpellingQuiz={startSpellingQuiz}
          startImageChoiceQuiz={startImageChoiceQuiz}
          startLearning={startLearning}
        />
      ) : view === "quiz-listening" ? (
        /* Listening Quiz View */
        <div className="animate-fade-in">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {isFinished ? (
              <SessionFinishedView
                title="🎉 リスニング完了！"
                description="素晴らしい耳をお持ちですね！全問終了しました。"
                onRestart={startListeningQuiz}
                onHome={() => setView("home")}
                buttonColorClass="bg-orange-500"
              />
            ) : (
              <div className="space-y-12">
                <SessionHeader
                  progressPercent={progressPercent}
                  currentIndex={currentIndex}
                  totalWords={sessionWords.length}
                  colorClass="text-orange-500"
                />

                <div className="flex flex-col items-center">
                  {loading ? (
                    <div className="py-20 text-center">
                      <Loader2
                        className="animate-spin mx-auto text-orange-500 mb-4"
                        size={48}
                      />
                      <p className="text-gray-500">音声データを準備中...</p>
                    </div>
                  ) : sessionWords.length > 0 ? (
                    <ListeningQuiz
                      currentWord={currentWord}
                      allWords={sessionWords}
                      onAnswer={handleAnswer}
                    />
                  ) : (
                    <div className="py-20 text-center">
                      <p className="text-gray-500 mb-4">データがありません。</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      ) : view === "quiz-spelling" ? (
        /* Spelling Quiz View */
        <div className="animate-fade-in">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {isFinished ? (
              <SessionFinishedView
                title="🎉 スペルクイズ完了！"
                description="完璧なスペリングです！全問終了しました。"
                onRestart={startSpellingQuiz}
                onHome={() => setView("home")}
                buttonColorClass="bg-blue-500"
              />
            ) : (
              <div className="space-y-12">
                <SessionHeader
                  progressPercent={progressPercent}
                  currentIndex={currentIndex}
                  totalWords={sessionWords.length}
                  colorClass="text-blue-500"
                />

                <div className="flex flex-col items-center">
                  {loading ? (
                    <div className="py-20 text-center">
                      <Loader2
                        className="animate-spin mx-auto text-blue-500 mb-4"
                        size={48}
                      />
                      <p className="text-gray-500">問題を準備中...</p>
                    </div>
                  ) : sessionWords.length > 0 ? (
                    <SpellingQuiz
                      currentWord={currentWord}
                      onAnswer={handleAnswer}
                    />
                  ) : (
                    <div className="py-20 text-center">
                      <p className="text-gray-500 mb-4">データがありません。</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      ) : view === "quiz-image-choice" ? (
        /* Image Choice Quiz View */
        <div className="animate-fade-in">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {isFinished ? (
              <SessionFinishedView
                title="🎉 画像クイズ完了！"
                description="視覚的な記憶力もバッチリですね！全問終了しました。"
                onRestart={startImageChoiceQuiz}
                onHome={() => setView("home")}
                buttonColorClass="bg-purple-500"
              />
            ) : (
              <div className="space-y-12">
                <SessionHeader
                  progressPercent={progressPercent}
                  currentIndex={currentIndex}
                  totalWords={sessionWords.length}
                  colorClass="text-purple-500"
                />

                <div className="flex flex-col items-center">
                  {loading ? (
                    <div className="py-20 text-center">
                      <Loader2
                        className="animate-spin mx-auto text-purple-500 mb-4"
                        size={48}
                      />
                      <p className="text-gray-500">画像を読み込み中...</p>
                    </div>
                  ) : sessionWords.length > 0 ? (
                    <ImageChoiceQuiz
                      currentWord={currentWord}
                      allWords={sessionWords}
                      onAnswer={handleAnswer}
                    />
                  ) : (
                    <div className="py-20 text-center">
                      <p className="text-gray-500 mb-4">データがありません。</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      ) : view === "quiz-4-choice" ? (
        /* 4-Choice Quiz View */
        <div className="animate-fade-in">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {isFinished ? (
              <SessionFinishedView
                title="🎉 クイズ完了！"
                description="全問終了しました。素晴らしい！"
                onRestart={() => start4ChoiceQuiz()}
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
                      <p className="text-gray-500">問題を生成中...</p>
                    </div>
                  ) : sessionWords.length > 0 ? (
                    <MultipleChoiceQuiz
                      currentWord={currentWord}
                      allWords={sessionWords}
                      onAnswer={handleAnswer}
                    />
                  ) : (
                    <div className="py-20 text-center">
                      <p className="text-gray-500 mb-4">データがありません。</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      ) : (
        /* Learning View */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isFinished ? (
            <SessionFinishedView
              title="🎉 お疲れ様でした！"
              description={`${sessionWords.length}単語の学習が完了しました。素晴らしい進歩です！`}
              onRestart={startLearning}
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
                    word={currentWord}
                    isFavorite={favorites.has(currentWord.id)}
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
                  onClick={() => setView("home")}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-2"
                >
                  ← 学習を中断してホームに戻る
                </button>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
