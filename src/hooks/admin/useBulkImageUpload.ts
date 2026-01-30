import { createClient } from "@/lib/supabase-browser";
import { useBulkUploadStatus } from "./useBulkUploadStatus";
import { uploadWordImage } from "./useUploadWordImage";

/**
 * たくさんの画像を一度にアップロードするための機能をまとめました。
 */
export function useBulkImageUpload(fetchWords: () => Promise<void>) {
  const { uploadingBulk, setUploadingBulk, bulkStatus, setBulkStatus } = useBulkUploadStatus();
  const supabase = createClient();

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (fileArray.length === 0) return;

    setUploadingBulk(true);
    setBulkStatus({ current: 0, total: fileArray.length });

    let success = 0;
    for (let i = 0; i < fileArray.length; i++) {
      setBulkStatus({ current: i + 1, total: fileArray.length });
      const wordName = fileArray[i].name.split(".")[0].toLowerCase();
      try {
        const { data: word } = await supabase.from("words").select("id").ilike("word", wordName).maybeSingle();
        if (word) {
          await uploadWordImage(supabase, fileArray[i], word.id);
          success++;
        }
      } catch (e) { console.error(e); }
    }

    alert(`完了！ 成功: ${success}, 失敗: ${fileArray.length - success}`);
    setUploadingBulk(false);
    setBulkStatus(null);
    fetchWords();
  };

  return { uploadingBulk, bulkStatus, handleFiles };
}
