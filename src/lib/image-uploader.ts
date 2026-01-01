// サーバーサイドでの画像アップロード処理
import { createAdminClient } from "./supabase-admin";
import { SupabaseClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

/**
 * 単語テキストからDB内の単語データを取得する
 */
async function findWordByText(supabase: SupabaseClient, wordText: string) {
  const { data, error } = await supabase
    .from("words")
    .select("id")
    .eq("word", wordText)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * 画像ファイルをSupabase Storageにアップロードする
 */
async function uploadImageToStorage(
  supabase: SupabaseClient,
  wordId: number,
  fileBuffer: Buffer,
  ext: string
) {
  const fileName = `bulk_${wordId}_${Date.now()}${ext}`;
  const contentType = `image/${ext.replace(".", "")}`;

  const { error } = await supabase.storage
    .from("word-images")
    .upload(fileName, fileBuffer, {
      contentType,
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("word-images").getPublicUrl(fileName);

  return publicUrl;
}

/**
 * DB内の単語の画像URLを更新する
 */
async function updateWordImageUrl(
  supabase: SupabaseClient,
  wordId: number,
  imageUrl: string
) {
  const { error } = await supabase
    .from("words")
    .update({ image_url: imageUrl })
    .eq("id", wordId);

  if (error) throw error;
}

export async function bulkUploadImages() {
  const supabase = createAdminClient();
  const imagesDir = path.join(process.cwd(), "word-images");

  if (!fs.existsSync(imagesDir)) {
    throw new Error(
      "word-images フォルダが見つかりません。プロジェクトルートに作成してください。"
    );
  }

  const files = fs.readdirSync(imagesDir).filter((f) => !f.startsWith("."));
  const results = {
    success: 0,
    failed: 0,
    logs: [] as string[],
  };

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) continue;

    const wordName = path.basename(file, path.extname(file)).toLowerCase();
    const filePath = path.join(imagesDir, file);

    try {
      // 1. DBに単語が存在するか確認
      const wordData = await findWordByText(supabase, wordName);

      if (!wordData) {
        results.logs.push(
          `⚠️ スキップ: 単語 "${wordName}" がDBに見つかりません。`
        );
        results.failed++;
        continue;
      }

      // 2. アップロード
      const fileBuffer = fs.readFileSync(filePath);
      const publicUrl = await uploadImageToStorage(
        supabase,
        wordData.id,
        fileBuffer,
        ext
      );

      // 3. DB更新
      await updateWordImageUrl(supabase, wordData.id, publicUrl);

      results.logs.push(`✅ 完了: ${wordName} (${file})`);
      results.success++;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      results.logs.push(`❌ エラー: ${wordName} - ${errorMessage}`);
      results.failed++;
    }
  }

  return results;
}
