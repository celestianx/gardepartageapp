import { describe, it, expect } from 'vitest';
import { calculate } from './index';
import type { CMGRates, FamilyProfile } from './types';

const rates: CMGRates = {
  childUnder6: {
    lowIncome: { maxRevenue: 26271, monthlyMax: 877, hourlyCapHours: 57.5 },
    midIncome: { minRevenue: 26271, maxRevenue: 57016, monthlyMax: 618, hourlyCapHours: 57.5 },
    highIncome: { minRevenue: 57016, monthlyMax: 264, hourlyCapHours: 57.5 },
  },
  childFrom6: {
    lowIncome: { maxRevenue: 26271, monthlyMax: 438, hourlyCapHours: 57.5 },
    midIncome: { minRevenue: 26271, maxRevenue: 57016, monthlyMax: 309, hourlyCapHours: 57.5 },
    highIncome: { minRevenue: 57016, monthlyMax: 132, hourlyCapHours: 57.5 },
  },
  maxCoverageRatio: 0.85,
};

const base: FamilyProfile = {
  id: 'f1',
  annualNetRevenue: 20000,
  youngestChildAge: 3,
  declaredMonthlyHours: 40,
};

describe('CMGCalculator', () => {
  it('enfant < 6 ans, revenu bas → 877', () => {
    expect(calculate({ ...base, annualNetRevenue: 20000, youngestChildAge: 3 }, rates).theoreticalAmount).toBe(877);
  });

  it('enfant < 6 ans, revenu moyen → 618', () => {
    expect(calculate({ ...base, annualNetRevenue: 35000, youngestChildAge: 2 }, rates).theoreticalAmount).toBe(618);
  });

  it('enfant < 6 ans, revenu élevé → 264', () => {
    expect(calculate({ ...base, annualNetRevenue: 60000, youngestChildAge: 4 }, rates).theoreticalAmount).toBe(264);
  });

  it('enfant ≥ 6 ans, revenu bas → 438', () => {
    expect(calculate({ ...base, annualNetRevenue: 20000, youngestChildAge: 7 }, rates).theoreticalAmount).toBe(438);
  });

  it('heures > plafond: montant reste à la valeur de la tranche', () => {
    expect(calculate({ ...base, declaredMonthlyHours: 80 }, rates).theoreticalAmount).toBe(877);
  });

  it('override manuel: effectiveAmount = override, isOverridden = true', () => {
    const result = calculate({ ...base, actualCMGOverride: 500 }, rates);
    expect(result.effectiveAmount).toBe(500);
    expect(result.isOverridden).toBe(true);
  });

  it('sans override: isOverridden = false, effectiveAmount = theoreticalAmount', () => {
    const result = calculate(base, rates);
    expect(result.isOverridden).toBe(false);
    expect(result.effectiveAmount).toBe(result.theoreticalAmount);
  });
});
