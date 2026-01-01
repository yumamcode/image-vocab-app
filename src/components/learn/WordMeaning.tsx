import React, { useState } from "react";
import { WordMeaningHidden } from "./WordMeaningHidden";
import { WordMeaningVisible } from "./WordMeaningVisible";

export interface WordMeaningProps {
  meaning: string;
  exampleSentence?: string | null;
  onAnswer?: (isCorrect: boolean) => void;
}

export const WordMeaning: React.FC<WordMeaningProps> = ({
  meaning,
  exampleSentence,
  onAnswer,
}) => {
  const [showMeaning, setShowMeaning] = useState(false);

  return (
    <div className="pt-6 border-t border-border/50">
      {showMeaning ? (
        <WordMeaningVisible
          meaning={meaning}
          exampleSentence={exampleSentence}
          onAnswer={onAnswer}
          onHide={() => setShowMeaning(false)}
        />
      ) : (
        <WordMeaningHidden onShow={() => setShowMeaning(true)} />
      )}
    </div>
  );
};
