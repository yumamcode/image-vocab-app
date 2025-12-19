// サーバーサイドでの画像アップロード処理
import { createAdminClient } from './supabase-admin';
import fs from 'fs';
import path from 'path';

export async function bulkUploadImages() {
  const supabase = createAdminClient();
  const imagesDir = path.join(process.cwd(), 'word-images');

  if (!fs.existsSync(imagesDir)) {
    throw new Error('word-images フォルダが見つかりません。プロジェクトルートに作成してください。');
  }

  const files = fs.readdirSync(imagesDir).filter(f => !f.startsWith('.'));
  const results = {
    success: 0,
    failed: 0,
    logs: [] as string[]
  };

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) continue;

    const wordName = path.basename(file, path.extname(file)).toLowerCase();
    const filePath = path.join(imagesDir, file);

    try {
      // 1. DBに単語が存在するか確認
      const { data: wordData, error: wordError } = await supabase
        .from('words')
        .select('id')
        .eq('word', wordName)
        .maybeSingle();

      if (wordError || !wordData) {
        results.logs.push(`⚠️ スキップ: 単語 "${wordName}" がDBに見つかりません。`);
        results.failed++;
        continue;
      }

      // 2. アップロード
      const fileBuffer = fs.readFileSync(filePath);
      const fileName = `bulk_${wordData.id}_${Date.now()}${ext}`;
      
      const { error: uploadError } = await supabase.storage
        .from('word-images')
        .upload(fileName, fileBuffer, {
          contentType: `image/${ext.replace('.', '')}`,
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 3. 公開URL取得
      const { data: { publicUrl } } = supabase.storage
        .from('word-images')
        .getPublicUrl(fileName);

      // 4. DB更新
      const { error: updateError } = await supabase
        .from('words')
        .update({ image_url: publicUrl })
        .eq('id', wordData.id);

      if (updateError) throw updateError;

      results.logs.push(`✅ 完了: ${wordName} (${file})`);
      results.success++;
    } catch (err: any) {
      results.logs.push(`❌ エラー: ${wordName} - ${err.message}`);
      results.failed++;
    }
  }

  return results;
}

