// 画像の一括アップロードAPI（認証必須）
import { NextResponse } from 'next/server';
import { bulkUploadImages } from '@/lib/image-uploader';
import { createClient } from '@/lib/supabase-server';

export async function POST() {
  try {
    // 認証チェック
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '認証が必要です。ログインしてください。' },
        { status: 401 }
      );
    }

    const results = await bulkUploadImages();
    return NextResponse.json(results);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '不明なエラーが発生しました';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

