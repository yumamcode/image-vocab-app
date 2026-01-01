"use client";
// 単語の詳細を表示するカードコンポーネント
import React, { useState } from "react";
import { Volume2, Heart, Eye, EyeOff, Check, X } from "lucide-react";

interface WordCardProps {
  word: {
    word: string;
    meaning: string;
    pronunciation?: string;
    part_of_speech?: string;
    example_sentence?: string;
    image_url?: string;
    audio_url?: string;
  };
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onAnswer?: (isCorrect: boolean) => void;
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  isFavorite = false,
  onToggleFavorite,
  onAnswer,
}) => {
  const [showMeaning, setShowMeaning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    if (word.audio_url) {
      const audio = new Audio(word.audio_url);
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.play();
    } else {
      // Fallback to Web Speech API
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-border/50 animate-scale-in">
      {/* Illustration Section */}
      <div className="relative h-80 bg-gradient-to-br from-secondary/20 to-accent/20">
        {word.image_url ? (
          <img
            src={word.image_url}
            alt={word.word}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>

      <div className="p-8">
        {/* Word Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-5xl font-bold text-gradient font-serif">
                {word.word}
              </h2>
              <button
                onClick={playAudio}
                disabled={isPlaying}
                className={`p-2 rounded-full hover:bg-primary/10 transition-colors ${
                  isPlaying
                    ? "text-primary animate-pulse"
                    : "text-muted-foreground"
                }`}
              >
                <Volume2 size={28} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-xl text-muted-foreground italic">
                {word.pronunciation}
              </p>
              {word.part_of_speech && (
                <span className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full font-medium">
                  {word.part_of_speech}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-full hover:bg-accent/10 transition-colors ${
              isFavorite ? "text-accent" : "text-muted-foreground"
            }`}
          >
            <Heart size={28} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Meaning Section */}
        <div className="space-y-6 pt-6 border-t border-border/50">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold font-serif text-foreground">
              意味
            </h3>
            <button
              onClick={() => setShowMeaning(!showMeaning)}
              className="flex items-center gap-2 text-primary font-semibold hover:opacity-80 transition-opacity"
            >
              {showMeaning ? (
                <>
                  <EyeOff size={20} /> 隠す
                </>
              ) : (
                <>
                  <Eye size={20} /> 表示
                </>
              )}
            </button>
          </div>

          {showMeaning ? (
            <div className="space-y-6 animate-fade-in">
              <div className="p-5 bg-muted/50 rounded-2xl">
                <p className="text-2xl font-bold text-foreground">
                  {word.meaning}
                </p>
              </div>

              {word.example_sentence && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                    例文
                  </h4>
                  <p className="text-lg text-foreground italic border-l-4 border-primary pl-4 py-1">
                    {word.example_sentence}
                  </p>
                </div>
              )}

              {onAnswer && (
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => onAnswer(false)}
                    className="flex-1 py-4 px-6 bg-red-50 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                  >
                    <X size={24} /> わからない
                  </button>
                  <button
                    onClick={() => onAnswer(true)}
                    className="flex-1 py-4 px-6 gradient-success text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Check size={24} /> わかる
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-24 flex items-center justify-center border-2 border-dashed border-border rounded-2xl bg-muted/20">
              <p className="text-muted-foreground italic">
                「表示」を押して意味を確認
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
