'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Check, X, Volume2, ArrowRight, Play } from 'lucide-react';

interface Word {
  id: number;
  word: string;
  meaning: string;
  pronunciation?: string;
  audio_url?: string;
}

interface ListeningQuizProps {
  currentWord: Word;
  allWords: Word[];
  onAnswer: (isCorrect: boolean) => void;
}

export const ListeningQuiz: React.FC<ListeningQuizProps> = ({
  currentWord,
  allWords,
  onAnswer
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = "en-US";
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  // 初回表示時に音声を再生
  useEffect(() => {
    const timer = setTimeout(() => {
      playAudio();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentWord]);

  // 選択肢を生成（正解の意味 + ランダムな不正解の意味3つ）
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
  };

  return (
    <div className="max-w-2xl w-full mx-auto space-y-8 animate-scale-in">
      <div className="bg-white p-12 rounded-3xl shadow-xl border border-border/50 text-center space-y-8">
        <h3 className="text-sm font-bold text-primary uppercase tracking-widest">音声を聞いて正しい意味を選んでください</h3>
        
        <div className="flex justify-center">
          <button
            onClick={playAudio}
            disabled={isPlaying}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isPlaying 
                ? 'bg-orange-100 text-orange-500 scale-110' 
                : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105'
            }`}
          >
            <Volume2 size={64} className={isPlaying ? 'animate-pulse' : ''} />
          </button>
        </div>
        
        <p className="text-gray-500 font-medium italic">タップして音声を再再生</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option) => {
          const isCorrect = option.id === currentWord.id;
          const isSelected = option.id === selectedId;
          
          let buttonStyles = "bg-white hover:border-orange-200 hover:bg-orange-50/30 transition-all";
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
              className={`p-6 rounded-2xl border-2 text-xl font-bold flex items-center justify-between group ${buttonStyles}`}
            >
              <span>{option.meaning}</span>
              {isAnswered && isCorrect && <div className="flex items-center gap-2 text-sm text-green-600">
                <span className="font-mono text-lg">{option.word}</span>
                <Check size={24} />
              </div>}
              {isAnswered && isSelected && !isCorrect && <X className="text-red-500" size={24} />}
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
            className="bg-orange-500 text-white px-12 py-4 rounded-2xl font-bold text-xl shadow-lg hover:bg-orange-600 hover:-translate-y-1 transition-all flex items-center gap-3"
          >
            次へ進む <ArrowRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

