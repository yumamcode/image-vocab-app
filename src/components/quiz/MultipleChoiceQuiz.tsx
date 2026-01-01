'use client';
// 4択形式のクイズコンポーネント
import React, { useState, useEffect, useMemo } from 'react';
import { Check, X, Volume2, ArrowRight } from 'lucide-react';

interface Word {
  id: number;
  word: string;
  meaning: string;
  pronunciation?: string;
  audio_url?: string;
}

interface MultipleChoiceQuizProps {
  currentWord: Word;
  allWords: Word[];
  onAnswer: (isCorrect: boolean) => void;
}

export const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({
  currentWord,
  allWords,
  onAnswer
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // 選択肢を生成（正解 + ランダムな不正解3つ）
  const options = useMemo(() => {
    const distractors = allWords
      .filter(w => w.id !== currentWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    return [currentWord, ...distractors].sort(() => Math.random() - 0.5);
  }, [currentWord, allWords]);

  const handleSelect = (wordId: number) => {
    if (isAnswered) return;
    setSelectedId(wordId);
    setIsAnswered(true);
    
    // 音声再生（正解の場合のみ、または常に再生するかは好みによりますが、ここでは正解確認として再生）
    if (wordId === currentWord.id) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto space-y-8 animate-scale-in">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-border/50 text-center space-y-6">
        <h3 className="text-sm font-bold text-primary uppercase tracking-widest">意味に合う単語を選んでください</h3>
        <div className="p-6 bg-secondary/10 rounded-2xl">
          <p className="text-4xl font-bold text-foreground leading-tight">
            {currentWord.meaning}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option) => {
          const isCorrect = option.id === currentWord.id;
          const isSelected = option.id === selectedId;
          
          let buttonStyles = "bg-white hover:border-primary/50 hover:bg-primary/5 transition-all";
          if (isAnswered) {
            if (isCorrect) {
              buttonStyles = "bg-green-50 border-green-500 text-green-700 ring-2 ring-green-500/20";
            } else if (isSelected) {
              buttonStyles = "bg-red-50 border-red-500 text-red-700 opacity-80";
            } else {
              buttonStyles = "bg-gray-50 border-gray-100 text-gray-400 opacity-50";
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={isAnswered}
              className={`p-6 rounded-2xl border-2 text-2xl font-bold flex items-center justify-between group ${buttonStyles}`}
            >
              <span>{option.word}</span>
              {isAnswered && isCorrect && <Check className="text-green-500" size={28} />}
              {isAnswered && isSelected && !isCorrect && <X className="text-red-500" size={28} />}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="flex flex-col items-center animate-fade-in">
          <button
            onClick={() => {
              onAnswer(selectedId === currentWord.id);
              setIsAnswered(false);
              setSelectedId(null);
            }}
            className="gradient-primary text-white px-12 py-4 rounded-2xl font-bold text-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3"
          >
            次へ進む <ArrowRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

