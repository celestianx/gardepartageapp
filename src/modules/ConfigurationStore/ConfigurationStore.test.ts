import { describe, it, expect, beforeEach, vi } from 'vitest';
import { save, load } from './index';
import { ConfigNotFoundError } from './types';
import type { GardeConfig } from './types';

// Force in-memory fallback (no KV)
vi.stubEnv('KV_REST_API_URL', '');
vi.stubEnv('KV_REST_API_TOKEN', '');

const baseConfig: GardeConfig = {
  families: [{ id: 'f1', name: 'Famille A', annualNetRevenue: 30000, youngestChildAge: 3, declaredMonthlyHours: 40 }],
  children: [{ id: 'c1', familyId: 'f1', name: 'Enfant A' }],
  weekSchedules: [{
    id: 'w1', name: 'Scolaire', weeksPerYear: 30,
    days: { 0: [{ childId: 'c1', slots: [8, 9, 10] }] },
  }],
  expenses: [],
  nounouNetSalary: 1500,
  splitRule: 'per-family',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('ConfigurationStore', () => {
  it('save + load aller-retour: champs identiques', async () => {
    const id = await save({ ...baseConfig });
    const loaded = await load(id);
    expect(loaded.families).toEqual(baseConfig.families);
    expect(loaded.children).toEqual(baseConfig.children);
    expect(loaded.nounouNetSalary).toBe(baseConfig.nounouNetSalary);
  });

  it('save: id généré et non vide', async () => {
    const id = await save({ ...baseConfig });
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('load ID inconnu: lève ConfigNotFoundError', async () => {
    await expect(load('nonexistent-id-xyz')).rejects.toThrow(ConfigNotFoundError);
  });

  it('deux saves successifs: IDs différents', async () => {
    const id1 = await save({ ...baseConfig });
    const id2 = await save({ ...baseConfig });
    expect(id1).not.toBe(id2);
  });

  it('updatedAt mis à jour après save', async () => {
    const before = new Date().toISOString();
    const id = await save({ ...baseConfig, createdAt: before });
    const loaded = await load(id);
    expect(loaded.updatedAt >= before).toBe(true);
  });
});
