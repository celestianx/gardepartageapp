import { NextRequest, NextResponse } from 'next/server';
import { aggregate } from '@/modules/CostAggregator';
import type { GardeConfig } from '@/modules/ConfigurationStore/types';

export async function POST(req: NextRequest) {
  try {
    const config = (await req.json()) as GardeConfig;
    const result = aggregate(config);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
