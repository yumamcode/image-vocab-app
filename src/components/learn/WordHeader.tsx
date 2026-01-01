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
  <div className="flex justify-between items-start mb-6">
    <div className="flex-1">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="text-5xl font-bold text-gradient font-serif">{word}</h2>
        <button
          onClick={onPlayAudio}
          disabled={isPlaying}
          className={`p-2 rounded-full hover:bg-primary/10 transition-colors ${
            isPlaying ? "text-primary animate-pulse" : "text-muted-foreground"
          }`}
        >
          <Volume2 size={28} />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-xl text-muted-foreground italic">{pronunciation}</p>
        {partOfSpeech && (
          <span className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full font-medium">
            {partOfSpeech}
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
);

