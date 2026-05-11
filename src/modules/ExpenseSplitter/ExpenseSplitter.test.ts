import { describe, it, expect } from 'vitest';
import { split } from './index';
import type { Expense, ScheduleResultRef } from './types';

const scheduleRef: ScheduleResultRef = {
  familyAnnualHours: { fA: 100, fB: 60 },
  childToFamily: { cX: 'fA', cY: 'fB' },
};
const familyIds = ['fA', 'fB'];

describe('ExpenseSplitter', () => {
  it('equal-split: 120€ → 60€ chacun', () => {
    const expense: Expense = { id: 'e1', label: 'Transport', amount: 120, rule: 'equal-split' };
    const result = split([expense], scheduleRef, familyIds);
    expect(result.totalByFamily['fA']).toBe(60);
    expect(result.totalByFamily['fB']).toBe(60);
  });

  it('proportional-to-hours: 160€ → fA=100€, fB=60€', () => {
    const expense: Expense = { id: 'e2', label: 'Km', amount: 160, rule: 'proportional-to-hours' };
    const result = split([expense], scheduleRef, familyIds);
    expect(result.totalByFamily['fA']).toBeCloseTo(100, 1);
    expect(result.totalByFamily['fB']).toBeCloseTo(60, 1);
  });

  it('per-child: 80€ attribué à enfant X → fA=80€, fB=0€', () => {
    const expense: Expense = { id: 'e3', label: 'Repas', amount: 80, rule: 'per-child', childId: 'cX' };
    const result = split([expense], scheduleRef, familyIds);
    expect(result.totalByFamily['fA']).toBe(80);
    expect(result.totalByFamily['fB']).toBe(0);
  });

  it('per-child enfant inconnu: 0€ pour tout le monde', () => {
    const expense: Expense = { id: 'e4', label: 'Frais', amount: 50, rule: 'per-child', childId: 'cZ' };
    const result = split([expense], scheduleRef, familyIds);
    expect(result.totalByFamily['fA']).toBe(0);
    expect(result.totalByFamily['fB']).toBe(0);
  });

  it('arrondis: 100€ equal-split 3 familles → somme exacte 100€', () => {
    const expense: Expense = { id: 'e5', label: 'Misc', amount: 100, rule: 'equal-split' };
    const result = split(
      [expense],
      { familyAnnualHours: { f1: 10, f2: 10, f3: 10 }, childToFamily: {} },
      ['f1', 'f2', 'f3']
    );
    const total = Object.values(result.totalByFamily).reduce((a, b) => a + b, 0);
    expect(Math.round(total * 100)).toBe(10000);
  });

  it('plusieurs frais: totalByFamily est la somme de toutes les lignes', () => {
    const expenses: Expense[] = [
      { id: 'e1', label: 'A', amount: 120, rule: 'equal-split' },
      { id: 'e2', label: 'B', amount: 80, rule: 'per-child', childId: 'cX' },
    ];
    const result = split(expenses, scheduleRef, familyIds);
    expect(result.totalByFamily['fA']).toBe(60 + 80);
    expect(result.totalByFamily['fB']).toBe(60 + 0);
  });
});
