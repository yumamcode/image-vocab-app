import { useState } from "react";

/**
 * 画像をアップロードしている最中の「今、何パーセント終わったかな？」という状態を管理します。
 */
export function useBulkUploadStatus() {
  const [uploadingBulk, setUploadingBulk] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<{ current: number; total: number } | null>(null);

  return { uploadingBulk, setUploadingBulk, bulkStatus, setBulkStatus };
}
