import { SupabaseClient } from "@supabase/supabase-js";

/**
 * 1枚の画像をアップロードして、単語のデータと結びつける機能です。
 */
export async function uploadWordImage(supabase: SupabaseClient, file: File, wordId: number) {
  const fileExt = file.name.split(".").pop();
  const fileName = `bulk_${wordId}_${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from("word-images")
    .upload(fileName, file, { cacheControl: "3600", upsert: true });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage.from("word-images").getPublicUrl(fileName);

  const { error: updateError } = await supabase
    .from("words")
    .update({ image_url: publicUrl })
    .eq("id", wordId);

  if (updateError) throw updateError;
}
