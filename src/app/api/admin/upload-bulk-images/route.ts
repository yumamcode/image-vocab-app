import { NextResponse } from 'next/server';
import { bulkUploadImages } from '@/lib/image-uploader';

export async function POST() {
  try {
    const results = await bulkUploadImages();
    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

