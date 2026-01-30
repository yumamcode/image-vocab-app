import { useState, useCallback } from "react";

/**
 * 音声を再生するための道具です。
 * 文字を読み上げたり、録音された音を鳴らしたりします。
 */
export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = useCallback((text: string, audioUrl?: string | null) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.play();
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return { isPlaying, playAudio };
};


