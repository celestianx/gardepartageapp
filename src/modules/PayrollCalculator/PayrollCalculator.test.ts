import { describe, it, expect } from 'vitest';
import { calculate } from './index';
import type { URSSAFRates } from './types';

const defaultRates: URSSAFRates = {
  employerChargesRate: 0.25,
  employeeChargesRate: 0.22,
  netToGrossMultiplier: 1.2821,
  grossToTotalCostMultiplier: 1.25,
};

describe('PayrollCalculator', () => {
  it('calcul de base avec netSalary=1500', () => {
    const result = calculate(1500, defaultRates);
    expect(result.grossSalary).toBeCloseTo(1923.15, 1);
    expect(result.employerCharges).toBeCloseTo(480.79, 1);
    expect(result.totalEmployerCost).toBeCloseTo(2403.94, 1);
  });

  it('cohérence comptable: netSalary + employeeCharges ≈ grossSalary', () => {
    const result = calculate(2000, defaultRates);
    expect(Math.abs(result.netSalary + result.employeeCharges - result.grossSalary)).toBeLessThanOrEqual(1);
  });

  it('salaire zéro: tous les champs à 0', () => {
    const result = calculate(0, defaultRates);
    expect(result.grossSalary).toBe(0);
    expect(result.employeeCharges).toBe(0);
    expect(result.employerCharges).toBe(0);
    expect(result.totalEmployerCost).toBe(0);
  });

  it('taux alternatifs: utilise les taux passés en paramètre', () => {
    const altRates: URSSAFRates = {
      employerChargesRate: 0.30,
      employeeChargesRate: 0.10,
      netToGrossMultiplier: 1.5,
      grossToTotalCostMultiplier: 1.30,
    };
    const result = calculate(1000, altRates);
    expect(result.grossSalary).toBeCloseTo(1500, 1);
    expect(result.employeeCharges).toBeCloseTo(150, 1);
    expect(result.employerCharges).toBeCloseTo(450, 1);
    expect(result.totalEmployerCost).toBeCloseTo(1950, 1);
  });
});
