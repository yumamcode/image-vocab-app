import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Word } from "@/types/word";

/**
 * 1つの単語に対して、1枚の画像をアップロードするための道具（フック）です。
 */
export function useIndividualImageUpload(
  words: Word[],
  setWords: (words: Word[]) => void
) {
  // 今、どの単語の画像をアップロードしているか（IDで覚える）
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const supabase = createClient();

  // 実際に画像をアップロードする関数
  const uploadIndividualImage = async (file: File, wordId: number) => {
    // 画像ファイルじゃない時は何もしない
    if (!file.type.startsWith("image/")) return;

    setUploadingId(wordId);
    try {
      // ファイル名を決める（例: 123_1737984000.jpg）
      const fileExt = file.name.split(".").pop();
      const fileName = `${wordId}_${Date.now()}.${fileExt}`;
      // 画像を保存する
      const { error: uploadError } = await supabase.storage
        .from("word-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 保存した画像のURL（ネット上の住所）を手に入れる
      const {
        data: { publicUrl },
      } = supabase.storage.from("word-images").getPublicUrl(fileName);

      // 単語のデータに画像のURLを書き込む
      const { error: updateError } = await supabase
        .from("words")
        .update({ image_url: publicUrl })
        .eq("id", wordId);

      if (updateError) throw updateError;

      // 画面上の単語リストも最新の画像URLに書き換える
      setWords(
        words.map((w) => (w.id === wordId ? { ...w, image_url: publicUrl } : w))
      );
    } catch (err: unknown) {
      console.error(err);
      alert(
        "画像のアップロードに失敗しました: " +
          (err instanceof Error ? err.message : "不明なエラー")
      );
    } finally {
      // アップロードが終わったらIDを空にする
      setUploadingId(null);
    }
  };

  // ファイルが選ばれた時に呼び出される関数
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    wordId: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadIndividualImage(file, wordId);
  };

  return {
    uploadingId,
    uploadIndividualImage,
    handleImageUpload,
  };
}
