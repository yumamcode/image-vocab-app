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

interface FeaturesSectionProps {
  features: any[];
  setView: (view: any) => void;
  startLearning: () => void;
}

export function FeaturesSection({ features, setView, startLearning }: FeaturesSectionProps) {
  return (
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
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={() => {
              if (feature.title === "多様なクイズ形式") {
                setView("quiz-menu");
              } else if (feature.title === "イラスト学習") {
                startLearning();
              }
            }}
            className={`bg-white p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-xl transition-all group cursor-pointer`}
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
  );
}

