'use client';

import { useState } from 'react';
import Link from 'next/link';
import { WordCard } from '@/components/WordCard';
import { calculateNextReview, performanceToQuality } from '@/lib/spaced-repetition';
import { BookOpen, Sparkles, LayoutDashboard, GraduationCap, BarChart3 } from 'lucide-react';

const MOCK_WORDS = [
  { id: 1, word: 'apple', meaning: 'りんご', pronunciation: '/ˈæp.əl/', part_of_speech: 'noun', example_sentence: 'I eat an apple every morning.', image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop' },
  { id: 2, word: 'book', meaning: '本', pronunciation: '/bʊk/', part_of_speech: 'noun', example_sentence: 'She is reading an interesting book.', image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop' },
  { id: 3, word: 'cat', meaning: '猫', pronunciation: '/kæt/', part_of_speech: 'noun', example_sentence: 'The cat is sleeping on the sofa.', image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop' },
  { id: 4, word: 'dog', meaning: '犬', pronunciation: '/dɒɡ/', part_of_speech: 'noun', example_sentence: 'He takes his dog for a walk.', image_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&auto=format&fit=crop' },
  { id: 5, word: 'elephant', meaning: '象', pronunciation: '/ˈel.ɪ.fənt/', part_of_speech: 'noun', example_sentence: 'Elephants are the largest land animals.', image_url: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&auto=format&fit=crop' },
];

export default function Home() {
  const [view, setView] = useState<'home' | 'learn'>('home');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const currentWord = MOCK_WORDS[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / MOCK_WORDS.length) * 100);

  const handleAnswer = (isCorrect: boolean) => {
    const quality = performanceToQuality(isCorrect);
    const result = calculateNextReview(quality, 0);
    console.log(`Word: ${currentWord.word}, Result:`, result);

    if (currentIndex < MOCK_WORDS.length - 1) {
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
    setView('learn');
  };

  return (
    <div className="min-h-screen bg-background">
      {view === 'home' ? (
        /* Navigation for Home */
        <nav className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('home')}>
                <BookOpen className="h-9 w-9 text-primary" />
                <span className="text-3xl font-bold text-gradient font-serif">Imavo</span>
              </div>
              
            <div className="hidden md:flex items-center space-x-8">
              <button className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-medium">
                <LayoutDashboard size={20} /> ダッシュボード
              </button>
              <button 
                onClick={startLearning}
                className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-medium"
              >
                <GraduationCap size={20} /> 学習
              </button>
              <button className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-medium">
                <BarChart3 size={20} /> 進捗
              </button>
              <Link href="/pricing" className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-medium">
                料金プラン
              </Link>
              <div className="pl-4 border-l border-border h-6 flex items-center">
                <span className="text-sm text-muted-foreground">こんにちは、あまね</span>
              </div>
            </div>
            </div>
          </div>
        </nav>
      ) : (
        /* Navigation for Learning */
        <nav className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <button 
                onClick={() => setView('home')}
                className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-medium"
              >
                <span className="text-xl">←</span> ホームに戻る
              </button>
              
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-gradient font-serif">Imavo</span>
              </div>

              <div className="text-foreground font-bold text-lg">
                {currentIndex + 1} / {MOCK_WORDS.length}
              </div>
            </div>
          </div>
        </nav>
      )}

      {view === 'home' ? (
        /* Hero Section */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col items-center text-center">
          <div className="animate-fade-in space-y-8 max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-bold text-gradient font-serif leading-tight">
              イラストで<br />英単語を楽しく学習
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              視覚と聴覚を刺激する革新的な学習体験。<br />
              イラストと音声で、英単語が自然に記憶に定着します。
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <button 
                onClick={startLearning}
                className="gradient-primary text-white text-xl px-10 py-5 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 font-bold"
              >
                <Sparkles size={24} /> 学習を始める
              </button>
              <Link href="/pricing" className="bg-white text-foreground border-2 border-border text-xl px-10 py-5 rounded-2xl shadow-md hover:bg-muted/50 transition-all font-bold flex items-center justify-center">
                料金プラン
              </Link>
            </div>
          </div>
        </main>
      ) : (
        /* Learning View */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isFinished ? (
            <div className="max-w-2xl mx-auto animate-scale-in">
              <div className="bg-white p-12 rounded-3xl shadow-2xl text-center border border-border/50">
                <h2 className="text-4xl font-bold text-gradient font-serif mb-6">🎉 お疲れ様でした！</h2>
                <p className="text-xl text-muted-foreground mb-10">
                  今日の5単語の学習が完了しました。<br />
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
                    onClick={() => setView('home')}
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
                    <span className="text-sm font-bold text-primary uppercase tracking-wider">進捗: {progressPercent}%</span>
                    <span className="text-sm font-bold text-muted-foreground">{currentIndex + 1} / {MOCK_WORDS.length}</span>
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
                <WordCard 
                  word={currentWord} 
                  isFavorite={favorites.has(currentWord.id)}
                  onToggleFavorite={() => toggleFavorite(currentWord.id)}
                  onAnswer={handleAnswer}
                />
              </div>

              <div className="flex justify-center mt-8">
                <button 
                  onClick={() => setView('home')}
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
