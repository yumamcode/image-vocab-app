'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Check, X, Volume2, ArrowRight } from 'lucide-react';

interface Word {
  id: number;
  word: string;
  meaning: string;
  image_url?: string;
}

interface ImageChoiceQuizProps {
  currentWord: Word;
  allWords: Word[];
  onAnswer: (isCorrect: boolean) => void;
}

export const ImageChoiceQuiz: React.FC<ImageChoiceQuizProps> = ({
  currentWord,
  allWords,
  onAnswer
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Generate 4 choices (including the correct one)
  const choices = useMemo(() => {
    // Filter out words that don't have images
    const wordsWithImages = allWords.filter(w => w.image_url && w.id !== currentWord.id);
    
    // Shuffle and pick 3 wrong answers
    const shuffledWrong = [...wordsWithImages].sort(() => 0.5 - Math.random());
    const wrongAnswers = shuffledWrong.slice(0, 3);
    
    // Combine with correct answer and shuffle
    return [...wrongAnswers, currentWord].sort(() => 0.5 - Math.random());
  }, [currentWord, allWords]);

  const handleSelect = (id: number) => {
    if (isAnswered) return;
    setSelectedId(id);
    setIsAnswered(true);
  };

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    setSelectedId(null);
    setIsAnswered(false);
  }, [currentWord]);

  return (
    <div className="max-w-4xl w-full mx-auto space-y-12 animate-scale-in">
      <div className="text-center space-y-6">
        <h3 className="text-sm font-bold text-purple-500 uppercase tracking-widest">
          単語に最も適したイラストを選択してください
        </h3>
        <div className="flex flex-col items-center gap-4">
          <p className="text-6xl font-black text-foreground font-serif tracking-tight">
            {currentWord.word}
          </p>
          <button 
            onClick={playAudio}
            className="flex items-center gap-2 text-purple-500 font-bold hover:bg-purple-50 px-4 py-2 rounded-full transition-all"
          >
            <Volume2 size={24} /> 発音を聞く
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {choices.map((choice) => {
          const isCorrectChoice = choice.id === currentWord.id;
          const isSelectedChoice = choice.id === selectedId;
          
          let borderColor = "border-border/50";
          let bgColor = "bg-white";
          
          if (isAnswered) {
            if (isCorrectChoice) {
              borderColor = "border-green-500 ring-4 ring-green-100";
              bgColor = "bg-green-50";
            } else if (isSelectedChoice) {
              borderColor = "border-red-500 ring-4 ring-red-100";
              bgColor = "bg-red-50";
            }
          } else {
            borderColor = "hover:border-purple-500 hover:shadow-xl";
          }

          return (
            <button
              key={choice.id}
              onClick={() => handleSelect(choice.id)}
              disabled={isAnswered}
              className={`relative aspect-square rounded-3xl border-2 overflow-hidden transition-all group ${borderColor} ${bgColor}`}
            >
              {choice.image_url ? (
                <img 
                  src={choice.image_url} 
                  alt="Choice" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground italic">
                  No Image Available
                </div>
              )}
              
              {isAnswered && isCorrectChoice && (
                <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <Check className="text-green-500" size={48} />
                  </div>
                </div>
              )}
              
              {isAnswered && isSelectedChoice && !isCorrectChoice && (
                <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <X className="text-red-500" size={48} />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="animate-fade-in space-y-8">
          <div className="bg-white p-8 rounded-3xl border-2 border-border/50 shadow-lg text-center">
            <p className="text-sm font-bold text-muted-foreground mb-2">意味</p>
            <p className="text-3xl font-bold text-foreground">{currentWord.meaning}</p>
          </div>
          
          <button
            onClick={() => onAnswer(selectedId === currentWord.id)}
            className="w-full py-6 bg-purple-500 text-white rounded-2xl font-bold text-2xl shadow-lg hover:bg-purple-600 transition-all flex items-center justify-center gap-3"
          >
            次へ進む <ArrowRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
};

