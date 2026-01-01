import React, { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";

interface WordMeaningProps {
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
    <div className="space-y-6 pt-6 border-t border-border/50">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold font-serif text-foreground">意味</h3>
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
            <p className="text-2xl font-bold text-foreground">{meaning}</p>
          </div>
          {exampleSentence && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">例文</h4>
              <p className="text-lg text-foreground italic border-l-4 border-primary pl-4 py-1">
                {exampleSentence}
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
          <p className="text-muted-foreground italic">「表示」を押して意味を確認</p>
        </div>
      )}
    </div>
  );
};

