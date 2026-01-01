import React from "react";

interface WordIllustrationProps {
  imageUrl?: string | null;
  wordText: string;
}

export const WordIllustration: React.FC<WordIllustrationProps> = ({
  imageUrl,
  wordText,
}) => (
  <div className="relative h-80 bg-gradient-to-br from-secondary/20 to-accent/20">
    {imageUrl ? (
      <img src={imageUrl} alt={wordText} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        No Image
      </div>
    )}
  </div>
);

