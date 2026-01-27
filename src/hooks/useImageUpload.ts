import { Word } from "@/types/word";
import { useIndividualImageUpload } from "./useIndividualImageUpload";
import { useBulkImageUpload } from "./useBulkImageUpload";
import { useImageDragDrop } from "./useImageDragDrop";

/**
 * 単語に画像をアップロードするための、いろいろな方法をまとめた道具（フック）です。
 */
export function useImageUpload(
  words: Word[],
  setWords: (words: Word[]) => void,
  fetchWords: () => Promise<void>
) {
  // 1つずつ画像をアップロードする機能
  const { uploadingId, uploadIndividualImage, handleImageUpload } =
    useIndividualImageUpload(words, setWords);

  // たくさんの画像をまとめてアップロードする機能
  const { uploadingBulk, bulkStatus, handleBulkImageUpload, handleFiles } =
    useBulkImageUpload(fetchWords);

  // マウスで画像を引っ張ってきて（ドラッグ＆ドロップ）置く時の状態を管理する機能
  const { isDragging, setIsDragging, dragOverId, setDragOverId } =
    useImageDragDrop();

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
