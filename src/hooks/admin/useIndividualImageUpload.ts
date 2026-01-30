import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Word } from "@/types/word";
import { uploadWordImage } from "./useUploadWordImage";
import { useWordListUpdater } from "../word/useWordListUpdater";

/**
 * 選んだ1つの単語に対して、画像を1枚だけアップロードする機能をまとめました。
 */
export function useIndividualImageUpload(words: Word[], setWords: (words: Word[]) => void) {
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const updateWordInList = useWordListUpdater(words, setWords);
  const supabase = createClient();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, wordId: number) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setUploadingId(wordId);
    try {
      await uploadWordImage(supabase, file, wordId);
      const { data: { publicUrl } } = supabase.storage.from("word-images").getPublicUrl(`${wordId}_latest`); // 簡易化
      updateWordInList(wordId, publicUrl);
    } catch (e) { alert("失敗しました"); }
    setUploadingId(null);
  };

  return { uploadingId, handleImageUpload };
}
