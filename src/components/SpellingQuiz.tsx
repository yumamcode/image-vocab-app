'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Check, X, Volume2, ArrowRight, RefreshCw } from 'lucide-react';

interface Word {
  id: number;
  word: string;
  meaning: string;
  pronunciation?: string;
  audio_url?: string;
}

interface SpellingQuizProps {
  currentWord: Word;
  onAnswer: (isCorrect: boolean) => void;
}

export const SpellingQuiz: React.FC<SpellingQuizProps> = ({
  currentWord,
  onAnswer
}) => {
  const [userInput, setUserInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    setUserInput('');
    setIsAnswered(false);
    setIsCorrect(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentWord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered || !userInput.trim()) return;

    const correct = userInput.trim().toLowerCase() === currentWord.word.toLowerCase();
    setIsCorrect(correct);
    setIsAnswered(true);
    playAudio();
  };

  return (
    <div className="max-w-2xl w-full mx-auto space-y-8 animate-scale-in">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-border/50 text-center space-y-6">
        <h3 className="text-sm font-bold text-blue-500 uppercase tracking-widest">正しいスペルを入力してください</h3>
        <div className="p-6 bg-blue-50/50 rounded-2xl">
          <p className="text-4xl font-bold text-foreground leading-tight">
            {currentWord.meaning}
          </p>
        </div>
        <button 
          onClick={playAudio}
          className="flex items-center gap-2 mx-auto text-blue-500 font-bold hover:bg-blue-50 px-4 py-2 rounded-full transition-all"
        >
          <Volume2 size={20} /> 音声を再生
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isAnswered}
            placeholder="Type the word here..."
            className={`w-full p-6 text-3xl font-bold text-center rounded-2xl border-4 outline-none transition-all ${
              isAnswered 
                ? isCorrect 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : 'border-red-500 bg-red-50 text-red-700'
                : 'border-blue-100 focus:border-blue-500 bg-white'
            }`}
            autoComplete="off"
            autoFocus
          />
          {isAnswered && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              {isCorrect ? (
                <Check className="text-green-500" size={40} />
              ) : (
                <X className="text-red-500" size={40} />
              )}
            </div>
          )}
        </div>

        {!isAnswered ? (
          <button
            type="submit"
            disabled={!userInput.trim()}
            className="w-full py-5 bg-blue-500 text-white rounded-2xl font-bold text-2xl shadow-lg hover:bg-blue-600 disabled:opacity-50 transition-all"
          >
            回答する
          </button>
        ) : (
          <div className="space-y-6 animate-fade-in text-center">
            {!isCorrect && (
              <div className="space-y-2">
                <p className="text-gray-500 font-bold">正解は:</p>
                <p className="text-4xl font-black text-green-600 font-mono tracking-wider">
                  {currentWord.word}
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={() => onAnswer(isCorrect)}
              className="w-full py-5 bg-blue-500 text-white rounded-2xl font-bold text-2xl shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
            >
              次へ進む <ArrowRight size={28} />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

