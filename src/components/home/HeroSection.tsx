"use client";

import { Sparkles } from "lucide-react";

interface HeroSectionProps {
  startLearning: () => void;
}

export function HeroSection({ startLearning }: HeroSectionProps) {
  return (
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
        </div>
      </div>
    </main>
  );
}

