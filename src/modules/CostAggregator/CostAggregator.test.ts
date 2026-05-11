import { describe, it, expect } from 'vitest';
import { aggregate } from './index';
import type { GardeConfig } from './types';

const config: GardeConfig = {
  families: [
    { id: 'fA', name: 'Famille A', annualNetRevenue: 30000, youngestChildAge: 3, declaredMonthlyHours: 40 },
    { id: 'fB', name: 'Famille B', annualNetRevenue: 50000, youngestChildAge: 5, declaredMonthlyHours: 30 },
  ],
  children: [
    { id: 'c1', familyId: 'fA', name: 'Enfant 1' },
    { id: 'c2', familyId: 'fA', name: 'Enfant 2' },
    { id: 'c3', familyId: 'fB', name: 'Enfant 3' },
  ],
  weekSchedules: [
    {
      id: 'w1', name: 'Scolaire', weeksPerYear: 36,
      days: {
        0: [
          { childId: 'c1', slots: [32, 33, 34, 35, 36, 37, 38, 39] },
          { childId: 'c2', slots: [32, 33, 34, 35, 36, 37, 38, 39] },
          { childId: 'c3', slots: [32, 33, 34, 35, 36, 37, 38, 39] },
        ],
      },
    },
    {
      id: 'w2', name: 'Vacances', weeksPerYear: 6,
      days: {
        0: [
          { childId: 'c1', slots: [32, 33, 34, 35] },
          { childId: 'c3', slots: [32, 33, 34, 35] },
        ],
      },
    },
  ],
  expenses: [{ id: 'e1', label: 'Km', amount: 1200, rule: 'equal-split' }],
  nounouNetSalary: 1500,
  splitRule: 'per-family',
};

describe('CostAggregator', () => {
  it('produit un résultat avec toutes les familles', () => {
    const result = aggregate(config);
    expect(result.families).toHaveLength(2);
    expect(result.totalEmployerCost).toBeGreaterThan(0);
  });

  it('équilibre: somme grossShares ≈ totalEmployerCost', () => {
    const result = aggregate(config);
    const total = result.families.reduce((sum, f) => sum + f.grossShare, 0);
    expect(Math.abs(total - result.totalEmployerCost)).toBeLessThanOrEqual(0.02);
  });

  it('équilibre: somme frais annexes = 1200€', () => {
    const result = aggregate(config);
    const total = result.families.reduce((sum, f) => sum + f.expensesShare, 0);
    expect(Math.abs(total - 1200)).toBeLessThanOrEqual(0.02);
  });

  it('CMG plafonné à 85% de la grossShare', () => {
    const result = aggregate(config);
    for (const f of result.families) {
      expect(f.cmgDeduction).toBeLessThanOrEqual(f.grossShare * 0.85 + 0.01);
    }
  });

  it('netCharge = grossShare - cmgDeduction + expensesShare', () => {
    const result = aggregate(config);
    for (const f of result.families) {
      const expected = Math.round((f.grossShare - f.cmgDeduction + f.expensesShare) * 100) / 100;
      expect(f.netCharge).toBeCloseTo(expected, 1);
    }
  });
});
