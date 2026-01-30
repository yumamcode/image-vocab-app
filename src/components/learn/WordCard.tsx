"use client";
// 単語の詳細を表示するカードコンポーネント
import React from "react";
import { ArrowRight } from "lucide-react";
import { WordIllustration } from "./WordIllustration";
import { WordHeader } from "./WordHeader";
import { WordMeaning } from "./WordMeaning";
import { useAudioPlayer } from "@/hooks/ui/useAudioPlayer";

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
  onNext?: () => void;
}

/**
 * 単語カードのメインコンポーネント
 * パーツごとに分離されたコンポーネントを統合して表示する
 */
export const WordCard: React.FC<WordCardProps> = ({
  word,
  isFavorite = false,
  onToggleFavorite,
  onAnswer,
  onNext,
}) => {
  const { isPlaying, playAudio } = useAudioPlayer();

  return (
    <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-border/50 animate-scale-in">
      <WordIllustration imageUrl={word.image_url} wordText={word.word} />

      <div className="p-8">
        <WordHeader
          word={word.word}
          pronunciation={word.pronunciation}
          partOfSpeech={word.part_of_speech}
          isPlaying={isPlaying}
          isFavorite={isFavorite}
          onPlayAudio={() => playAudio(word.word, word.audio_url)}
          onToggleFavorite={onToggleFavorite}
        />

        <WordMeaning
          meaning={word.meaning}
          exampleSentence={word.example_sentence}
          onAnswer={onAnswer}
        />

        {onNext && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={onNext}
              className="w-full py-4 px-6 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:bg-primary/90"
            >
              次へ進む <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
