import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Word } from "@/types/word";

export function useImageUpload(
  words: Word[],
  setWords: (words: Word[]) => void,
  fetchWords: () => Promise<void>
) {
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [uploadingBulk, setUploadingBulk] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [bulkStatus, setBulkStatus] = useState<{
    current: number;
    total: number;
  } | null>(null);

  const supabase = createClient();

  const uploadIndividualImage = async (file: File, wordId: number) => {
    if (!file.type.startsWith("image/")) return;

    setUploadingId(wordId);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${wordId}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("word-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("word-images").getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("words")
        .update({ image_url: publicUrl })
        .eq("id", wordId);

      if (updateError) throw updateError;

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
      setUploadingId(null);
    }
  };

  const handleBulkImageUpload = async () => {
    setUploadingBulk(true);
    try {
      const res = await fetch("/api/admin/upload-bulk-images", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        alert(
          `一括登録が完了しました。\n成功: ${data.success}\n失敗: ${
            data.failed
          }\n\nログ:\n${data.logs.join("\n")}`
        );
        fetchWords();
      } else {
        alert("エラーが発生しました: " + data.error);
      }
    } catch (err: unknown) {
      console.error(err);
      alert("エラーが発生しました");
    } finally {
      setUploadingBulk(false);
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (fileArray.length === 0) return;

    setUploadingBulk(true);
    setBulkStatus({ current: 0, total: fileArray.length });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setBulkStatus({ current: i + 1, total: fileArray.length });

      const wordName = file.name.split(".")[0].toLowerCase();

      try {
        const { data: wordData, error: findError } = await supabase
          .from("words")
          .select("id")
          .ilike("word", wordName)
          .maybeSingle();

        if (findError) throw findError;

        if (!wordData) {
          console.warn(`Word not found in DB: ${wordName}`);
          failCount++;
          continue;
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `drop_${wordData.id}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("word-images")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("word-images").getPublicUrl(fileName);

        const { error: updateError } = await supabase
          .from("words")
          .update({ image_url: publicUrl })
          .eq("id", wordData.id);

        if (updateError) throw updateError;

        successCount++;
      } catch (err) {
        console.error(`Error uploading ${wordName}:`, err);
        failCount++;
      }
    }

    alert(`一括アップロード完了\n成功: ${successCount}\n失敗: ${failCount}`);
    setUploadingBulk(false);
    setBulkStatus(null);
    fetchWords();
  };

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
    uploadingBulk,
    isDragging,
    setIsDragging,
    dragOverId,
    setDragOverId,
    bulkStatus,
    handleBulkImageUpload,
    handleFiles,
    handleImageUpload,
    uploadIndividualImage,
  };
}

