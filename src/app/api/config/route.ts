import { NextRequest, NextResponse } from 'next/server';
import { save } from '@/modules/ConfigurationStore';

export async function POST(req: NextRequest) {
  const config = await req.json();
  const id = await save(config);
  return NextResponse.json({ id });
}
