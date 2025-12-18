import { NextResponse } from 'next/server';
import { seedWords } from '@/lib/seed';

export async function POST() {
  try {
    await seedWords();
    return NextResponse.json({ message: 'Seeding completed' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

