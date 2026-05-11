import { NextRequest, NextResponse } from 'next/server';
import { load, ConfigNotFoundError } from '@/modules/ConfigurationStore';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const config = await load(id);
    return NextResponse.json(config);
  } catch (e) {
    if (e instanceof ConfigNotFoundError) {
      return NextResponse.json({ error: 'Configuration non trouvée' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
