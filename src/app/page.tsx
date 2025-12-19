"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { WordCard } from "@/components/WordCard";
import { MultipleChoiceQuiz } from "@/components/MultipleChoiceQuiz";
import { ListeningQuiz } from "@/components/ListeningQuiz";
import { SpellingQuiz } from "@/components/SpellingQuiz";
import { ImageChoiceQuiz } from "@/components/ImageChoiceQuiz";
import {
  calculateNextReview,
  performanceToQuality,
} from "@/lib/spaced-repetition";
import {
  BookOpen,
  Sparkles,
  LayoutDashboard,
  GraduationCap,
  BarChart3,
  Loader2,
  Brain,
  TrendingUp,
  Trophy,
  BookMarked,
  Smartphone,
  Star,
  Type,
  ImageIcon,
  Volume2 as VolumeIcon,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

const QUIZ_MODES = [
  {
    id: "multiple-choice",
    title: "4択クイズ",
    description: "意味に合う単語を4つの選択肢から選びます",
    icon: Trophy,
    color: "bg-green-500",
  },
  {
    id: "spelling",
    title: "スペル入力",
    description: "音声や意味を聞いて正しいスペルを入力します",
    icon: Type,
    color: "bg-blue-500",
  },
  {
    id: "image-choice",
    title: "画像選択問題",
    description: "単語に最も適したイラストを選択します",
    icon: ImageIcon,
    color: "bg-purple-500",
  },
  {
    id: "listening",
    title: "リスニング問題",
    description: "発音を聞き取って単語や意味を当てます",
    icon: VolumeIcon,
    color: "bg-orange-500",
  },
];

const FEATURES = [
  {
    title: "イラスト学習",
    description: "各単語に最適化されたイラストで視覚的記憶を強化",
    icon: Brain,
    color: "bg-blue-500",
  },
  {
    title: "多様なクイズ形式",
    description: "4択、スペル入力、画像・音声問題で多角的に学習",
    icon: Trophy,
    color: "bg-green-600",
  },
  {
    title: "学習進捗可視化",
    description: "グラフと統計で学習状況を一目で把握",
    icon: Star,
    color: "bg-amber-500",
  },
];

export default function Home() {
  const [view, setView] = useState<
    | "home"
    | "learn"
    | "quiz-menu"
    | "quiz-4-choice"
    | "quiz-listening"
    | "quiz-spelling"
    | "quiz-image-choice"
  >("home");
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const supabase = createClient();

  const fetchWords = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("words").select("*").limit(100);

    if (data) setWords(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const currentWord = words[currentIndex];
  const progressPercent =
    words.length > 0
      ? Math.round(((currentIndex + 1) / words.length) * 100)
      : 0;

  const handleAnswer = (isCorrect: boolean) => {
    const quality = performanceToQuality(isCorrect);
    const result = calculateNextReview(quality, 0);
    console.log(`Word: ${currentWord.word}, Result:`, result);

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const startLearning = () => {
    setCurrentIndex(0);
    setIsFinished(false);
    setView("learn");
  };

  const start4ChoiceQuiz = () => {
    setCurrentIndex(0);
    setIsFinished(false);
    setView("quiz-4-choice");
  };

  const startListeningQuiz = () => {
    setCurrentIndex(0);
    setIsFinished(false);
    setView("quiz-listening");
  };

  const startSpellingQuiz = () => {
    setCurrentIndex(0);
    setIsFinished(false);
    setView("quiz-spelling");
  };

  const startImageChoiceQuiz = () => {
    setCurrentIndex(0);
    setIsFinished(false);
    setView("quiz-image-choice");
  };

  return (
    <div className="min-h-screen bg-background">
      {view === "home" ? (
        /* Navigation for Home */
        <nav className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => setView("home")}
              >
                <BookOpen className="h-9 w-9 text-primary" />
                <span className="text-3xl font-bold text-gradient font-serif">
                  Imavo
                </span>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <button
                  onClick={startLearning}
                  className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-medium"
                >
                  <Brain size={20} /> イラスト学習
                </button>
                <button
                  onClick={() => setView("quiz-menu")}
                  className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-medium"
                >
                  <Trophy size={20} /> 多様なクイズ形式
                </button>
                <button className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-medium">
                  <Star size={20} /> 学習進捗可視化
                </button>
                <div className="pl-4 border-l border-border h-6 flex items-center">
                  <span className="text-sm text-muted-foreground">
                    こんにちは、あまね
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>
      ) : (
        /* Navigation for Learning & Quiz */
        <nav className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <button
                onClick={() =>
                  view === "learn" || view === "quiz-menu"
                    ? setView("home")
                    : setView("quiz-menu")
                }
                className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-medium"
              >
                <span className="text-xl">←</span>{" "}
                {view === "learn" || view === "quiz-menu"
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
                {view !== "quiz-menu" && (
                  <>
                    {currentIndex + 1} / {words.length}
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      {view === "home" ? (
        /* Hero & Features */
        <div className="animate-fade-in">
          {/* Hero Section */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col items-center text-center">
            <div className="space-y-8 max-w-4xl">
              <h1 className="text-6xl md:text-8xl font-bold text-gradient font-serif leading-tight">
                イラストで
                <br />
                英単語を楽しく学習
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                視覚と聴覚を刺激する革新的な学習体験。
                <br />
                イラストと音声で、英単語が自然に記憶に定着します。
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <button
                  onClick={startLearning}
                  className="gradient-primary text-white text-xl px-10 py-5 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 font-bold"
                >
                  <Sparkles size={24} /> 学習を始める
                </button>
                <Link
                  href="/pricing"
                  className="bg-white text-foreground border-2 border-border text-xl px-10 py-5 rounded-2xl shadow-md hover:bg-muted/50 transition-all font-bold flex items-center justify-center"
                >
                  料金プラン
                </Link>
              </div>
            </div>
          </main>

          {/* Features Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-border/40">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground font-serif">
                学習を加速する機能
              </h2>
              <p className="text-xl text-muted-foreground">
                科学的根拠に基づいた学習メソッドを、エレガントなUIで提供
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map((feature, index) => (
                <div
                  key={index}
                  onClick={() =>
                    feature.title === "多様なクイズ形式" && setView("quiz-menu")
                  }
                  className={`bg-white p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-xl transition-all group ${
                    feature.title === "多様なクイズ形式" ? "cursor-pointer" : ""
                  }`}
                >
                  <div
                    className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : view === "quiz-menu" ? (
        /* Quiz Menu View */
        <div className="animate-fade-in">
          <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground font-serif">
                クイズ形式を選択
              </h2>
              <p className="text-xl text-muted-foreground">
                自分に合ったスタイルで、知識の定着を確認しましょう
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {QUIZ_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    if (mode.id === "multiple-choice") {
                      start4ChoiceQuiz();
                    } else if (mode.id === "listening") {
                      startListeningQuiz();
                    } else if (mode.id === "spelling") {
                      startSpellingQuiz();
                    } else if (mode.id === "image-choice") {
                      startImageChoiceQuiz();
                    } else {
                      startLearning();
                    }
                  }}
                  className="bg-white p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group flex items-center text-left gap-6"
                >
                  <div
                    className={`${mode.color} w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <mode.icon size={40} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">
                      {mode.title}
                    </h3>
                    <p className="text-gray-500">{mode.description}</p>
                  </div>
                  <ChevronRight
                    className="text-gray-300 group-hover:text-primary transition-colors"
                    size={32}
                  />
                </button>
              ))}
            </div>
          </main>
        </div>
      ) : view === "quiz-listening" ? (
        /* Listening Quiz View */
        <div className="animate-fade-in">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {isFinished ? (
              <div className="max-w-2xl mx-auto animate-scale-in">
                <div className="bg-white p-12 rounded-3xl shadow-2xl text-center border border-border/50">
                  <h2 className="text-4xl font-bold text-gradient font-serif mb-6">
                    🎉 リスニング完了！
                  </h2>
                  <p className="text-xl text-muted-foreground mb-10">
                    素晴らしい耳をお持ちですね！全問終了しました。
                  </p>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={startListeningQuiz}
                      className="w-full py-5 bg-orange-500 text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-orange-600 transition-all"
                    >
                      もう一度挑戦する
                    </button>
                    <button
                      onClick={() => setView("home")}
                      className="w-full py-5 bg-muted text-foreground rounded-2xl font-bold text-xl hover:bg-muted/80 transition-all"
                    >
                      ホームに戻る
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <header className="flex flex-col items-center gap-6">
                  <div className="w-full max-w-2xl">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-orange-500 uppercase tracking-wider">
                        進捗: {progressPercent}%
                      </span>
                      <span className="text-sm font-bold text-muted-foreground">
                        {currentIndex + 1} / {words.length}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-orange-500 transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </header>

                <div className="flex flex-col items-center">
                  {loading ? (
                    <div className="py-20 text-center">
                      <Loader2
                        className="animate-spin mx-auto text-orange-500 mb-4"
                        size={48}
                      />
                      <p className="text-gray-500">音声データを準備中...</p>
                    </div>
                  ) : words.length > 0 ? (
                    <ListeningQuiz
                      currentWord={currentWord}
                      allWords={words}
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
              <div className="max-w-2xl mx-auto animate-scale-in">
                <div className="bg-white p-12 rounded-3xl shadow-2xl text-center border border-border/50">
                  <h2 className="text-4xl font-bold text-gradient font-serif mb-6">
                    🎉 スペルクイズ完了！
                  </h2>
                  <p className="text-xl text-muted-foreground mb-10">
                    完璧なスペリングです！全問終了しました。
                  </p>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={startSpellingQuiz}
                      className="w-full py-5 bg-blue-500 text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-blue-600 transition-all"
                    >
                      もう一度挑戦する
                    </button>
                    <button
                      onClick={() => setView("home")}
                      className="w-full py-5 bg-muted text-foreground rounded-2xl font-bold text-xl hover:bg-muted/80 transition-all"
                    >
                      ホームに戻る
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <header className="flex flex-col items-center gap-6">
                  <div className="w-full max-w-2xl">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-blue-500 uppercase tracking-wider">
                        進捗: {progressPercent}%
                      </span>
                      <span className="text-sm font-bold text-muted-foreground">
                        {currentIndex + 1} / {words.length}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </header>

                <div className="flex flex-col items-center">
                  {loading ? (
                    <div className="py-20 text-center">
                      <Loader2
                        className="animate-spin mx-auto text-blue-500 mb-4"
                        size={48}
                      />
                      <p className="text-gray-500">問題を準備中...</p>
                    </div>
                  ) : words.length > 0 ? (
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
              <div className="max-w-2xl mx-auto animate-scale-in">
                <div className="bg-white p-12 rounded-3xl shadow-2xl text-center border border-border/50">
                  <h2 className="text-4xl font-bold text-gradient font-serif mb-6">
                    🎉 画像クイズ完了！
                  </h2>
                  <p className="text-xl text-muted-foreground mb-10">
                    視覚的な記憶力もバッチリですね！全問終了しました。
                  </p>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={startImageChoiceQuiz}
                      className="w-full py-5 bg-purple-500 text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-purple-600 transition-all"
                    >
                      もう一度挑戦する
                    </button>
                    <button
                      onClick={() => setView("home")}
                      className="w-full py-5 bg-muted text-foreground rounded-2xl font-bold text-xl hover:bg-muted/80 transition-all"
                    >
                      ホームに戻る
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <header className="flex flex-col items-center gap-6">
                  <div className="w-full max-w-2xl">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-purple-500 uppercase tracking-wider">
                        進捗: {progressPercent}%
                      </span>
                      <span className="text-sm font-bold text-muted-foreground">
                        {currentIndex + 1} / {words.length}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-purple-500 transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </header>

                <div className="flex flex-col items-center">
                  {loading ? (
                    <div className="py-20 text-center">
                      <Loader2
                        className="animate-spin mx-auto text-purple-500 mb-4"
                        size={48}
                      />
                      <p className="text-gray-500">画像を読み込み中...</p>
                    </div>
                  ) : words.length > 0 ? (
                    <ImageChoiceQuiz
                      currentWord={currentWord}
                      allWords={words}
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
              <div className="max-w-2xl mx-auto animate-scale-in">
                <div className="bg-white p-12 rounded-3xl shadow-2xl text-center border border-border/50">
                  <h2 className="text-4xl font-bold text-gradient font-serif mb-6">
                    🎉 クイズ完了！
                  </h2>
                  <p className="text-xl text-muted-foreground mb-10">
                    全問終了しました。素晴らしい！
                  </p>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={start4ChoiceQuiz}
                      className="w-full py-5 gradient-primary text-white rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      もう一度挑戦する
                    </button>
                    <button
                      onClick={() => setView("home")}
                      className="w-full py-5 bg-muted text-foreground rounded-2xl font-bold text-xl hover:bg-muted/80 transition-all"
                    >
                      ホームに戻る
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <header className="flex flex-col items-center gap-6">
                  <div className="w-full max-w-2xl">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-primary uppercase tracking-wider">
                        進捗: {progressPercent}%
                      </span>
                      <span className="text-sm font-bold text-muted-foreground">
                        {currentIndex + 1} / {words.length}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full gradient-primary transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </header>

                <div className="flex flex-col items-center">
                  {loading ? (
                    <div className="py-20 text-center">
                      <Loader2
                        className="animate-spin mx-auto text-primary mb-4"
                        size={48}
                      />
                      <p className="text-gray-500">問題を生成中...</p>
                    </div>
                  ) : words.length > 0 ? (
                    <MultipleChoiceQuiz
                      currentWord={currentWord}
                      allWords={words}
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
            <div className="max-w-2xl mx-auto animate-scale-in">
              <div className="bg-white p-12 rounded-3xl shadow-2xl text-center border border-border/50">
                <h2 className="text-4xl font-bold text-gradient font-serif mb-6">
                  🎉 お疲れ様でした！
                </h2>
                <p className="text-xl text-muted-foreground mb-10">
                  今日の5単語の学習が完了しました。
                  <br />
                  素晴らしい進歩です！
                </p>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={startLearning}
                    className="w-full py-5 gradient-primary text-white rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    もう一度学習する
                  </button>
                  <button
                    onClick={() => setView("home")}
                    className="w-full py-5 bg-muted text-foreground rounded-2xl font-bold text-xl hover:bg-muted/80 transition-all"
                  >
                    ホームに戻る
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              <header className="flex flex-col items-center gap-6">
                <div className="w-full max-w-2xl">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-sm font-bold text-primary uppercase tracking-wider">
                      進捗: {progressPercent}%
                    </span>
                    <span className="text-sm font-bold text-muted-foreground">
                      {currentIndex + 1} / {words.length}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full gradient-primary transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </header>

              <div className="flex flex-col items-center">
                {loading ? (
                  <div className="py-20 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-primary mb-4"
                      size={48}
                    />
                    <p className="text-gray-500">学習データを読み込み中...</p>
                  </div>
                ) : words.length > 0 ? (
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
