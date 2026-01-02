import React from "react";
import { Volume2, Heart } from "lucide-react";

interface WordHeaderProps {
  word: string;
  pronunciation?: string | null;
  partOfSpeech?: string | null;
  isPlaying: boolean;
  isFavorite: boolean;
  onPlayAudio: () => void;
  onToggleFavorite?: () => void;
}

export const WordHeader: React.FC<WordHeaderProps> = ({
  word,
  pronunciation,
  partOfSpeech,
  isPlaying,
  isFavorite,
  onPlayAudio,
  onToggleFavorite,
}) => (
  <div className="flex justify-between items-start gap-4 mb-6">
    <div className="flex-1 min-w-0">
      <h2 className="text-4xl sm:text-5xl font-bold text-gradient font-serif mb-2 break-words leading-tight">
        {word}
      </h2>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-lg sm:text-xl text-muted-foreground italic break-all">
          {pronunciation}
        </p>
        {partOfSpeech && (
          <span className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full font-medium shrink-0">
            {partOfSpeech}
          </span>
        )}
      </div>
    </div>
    <div className="flex items-center gap-1 shrink-0">
      <button
        onClick={onPlayAudio}
        disabled={isPlaying}
        className={`p-2.5 rounded-full hover:bg-primary/10 transition-colors ${
          isPlaying ? "text-primary animate-pulse" : "text-muted-foreground"
        }`}
        aria-label="音声を聞く"
      >
        <Volume2 size={26} className="sm:w-7 sm:h-7" />
      </button>
      <button
        onClick={onToggleFavorite}
        className={`p-2.5 rounded-full hover:bg-accent/10 transition-colors ${
          isFavorite ? "text-accent" : "text-muted-foreground"
        }`}
        aria-label="お気に入り登録"
      >
        <Heart
          size={26}
          fill={isFavorite ? "currentColor" : "none"}
          className="sm:w-7 sm:h-7"
        />
      </button>
    </div>
  </div>
);
