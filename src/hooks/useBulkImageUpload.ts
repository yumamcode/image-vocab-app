import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

/**
 * たくさんの画像をまとめて（一括で）アップロードするための道具（フック）です。
 */
export function useBulkImageUpload(fetchWords: () => Promise<void>) {
  // まとめてアップロード中かどうか
  const [uploadingBulk, setUploadingBulk] = useState(false);
  // 今何枚中、何枚目をアップロードしているかの状況
  const [bulkStatus, setBulkStatus] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const supabase = createClient();

  // サーバーにある画像を一括で登録する機能
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

  // 自分のパソコンから選んだ複数の画像ファイルをアップロードする機能
  const handleFiles = async (files: FileList | File[]) => {
    // 画像ファイルだけを選び出す
    const fileArray = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (fileArray.length === 0) return;

    setUploadingBulk(true);
    setBulkStatus({ current: 0, total: fileArray.length });

    let successCount = 0;
    let failCount = 0;

    // 1枚ずつ順番にアップロードしていく
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setBulkStatus({ current: i + 1, total: fileArray.length });
      // ファイル名（例: apple.jpg）から単語名（apple）を取り出す
      const wordName = file.name.split(".")[0].toLowerCase();

      try {
        // その単語がデータベースにあるか探す
        const { data: wordData, error: findError } = await supabase
          .from("words")
          .select("id")
          .ilike("word", wordName)
          .maybeSingle();

        if (findError) throw findError;
        if (!wordData) {
          // 単語が見つからない時は失敗
          failCount++;
          continue;
        }

        // 画像を保存する
        const fileExt = file.name.split(".").pop();
        const fileName = `drop_${wordData.id}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("word-images")
          .upload(fileName, file, { cacheControl: "3600", upsert: true });

        if (uploadError) throw uploadError;

        // 保存した画像のURL（ネット上の住所）を手に入れる
        const {
          data: { publicUrl },
        } = supabase.storage.from("word-images").getPublicUrl(fileName);

        // 単語のデータに画像のURLを書き込む
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

  return {
    uploadingBulk,
    bulkStatus,
    handleBulkImageUpload,
    handleFiles,
  };
}
