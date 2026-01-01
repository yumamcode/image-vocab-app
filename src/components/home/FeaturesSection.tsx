"use client";

import { AppView } from "@/types/view";

interface FeaturesSectionProps {
  features: any[];
  setView: (view: AppView) => void;
}

export function FeaturesSection({ features, setView }: FeaturesSectionProps) {
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
                setView("learn-settings");
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

