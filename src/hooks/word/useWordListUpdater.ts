import { Word } from "@/types/word";

/**
 * 画面に表示されている単語のリストを、新しい情報に書き換えるための道具です。
 */
export function useWordListUpdater(words: Word[], setWords: (words: Word[]) => void) {
  const updateWordInList = (wordId: number, imageUrl: string) => {
    setWords(words.map(w => w.id === wordId ? { ...w, image_url: imageUrl } : w));
  };

  return updateWordInList;
}
