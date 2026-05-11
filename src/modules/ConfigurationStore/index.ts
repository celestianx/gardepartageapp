import { nanoid } from 'nanoid';
import type { GardeConfig } from './types';
import { ConfigNotFoundError } from './types';

export { ConfigNotFoundError } from './types';
export type { GardeConfig };

// In-memory fallback for local development (no Vercel KV env vars)
const memoryStore = new Map<string, string>();

function hasKV(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function kvSet(key: string, value: string): Promise<void> {
  if (hasKV()) {
    const { kv } = await import('@vercel/kv');
    await kv.set(key, value);
  } else {
    memoryStore.set(key, value);
  }
}

async function kvGet(key: string): Promise<string | null> {
  if (hasKV()) {
    const { kv } = await import('@vercel/kv');
    return kv.get<string>(key);
  } else {
    return memoryStore.get(key) ?? null;
  }
}

export async function save(config: GardeConfig): Promise<string> {
  const id = config.id ?? nanoid(10);
  const now = new Date().toISOString();
  const toStore: GardeConfig = {
    ...config,
    id,
    updatedAt: now,
    createdAt: config.createdAt ?? now,
  };
  await kvSet(`garde:${id}`, JSON.stringify(toStore));
  return id;
}

export async function load(id: string): Promise<GardeConfig> {
  const raw = await kvGet(`garde:${id}`);
  if (!raw) throw new ConfigNotFoundError(id);
  return JSON.parse(raw) as GardeConfig;
}
