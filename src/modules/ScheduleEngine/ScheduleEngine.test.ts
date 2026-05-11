import { describe, it, expect } from 'vitest';
import { compute } from './index';
import type { WeekSchedule, Family, Child } from './types';

const familyA: Family = { id: 'fA', name: 'Famille A' };
const familyB: Family = { id: 'fB', name: 'Famille B' };
const childA: Child = { id: 'cA', familyId: 'fA', name: 'Enfant A' };
const childB: Child = { id: 'cB', familyId: 'fB', name: 'Enfant B' };

describe('ScheduleEngine', () => {
  it('chevauchement partiel: union correcte des slots', () => {
    const ws: WeekSchedule = {
      id: 'w1', name: 'Test', weeksPerYear: 1,
      days: {
        0: [
          { childId: 'cA', slots: [8, 9, 10] },
          { childId: 'cB', slots: [10, 11, 12] },
        ],
      },
    };
    const result = compute([ws], [familyA, familyB], [childA, childB]);
    // union = 5 slots × 15min/60 × 1 semaine = 1.25h
    expect(result.nounouAnnualHours).toBeCloseTo(1.25, 5);
  });

  it('un seul enfant: heures nounou = heures famille', () => {
    const ws: WeekSchedule = {
      id: 'w1', name: 'Test', weeksPerYear: 10,
      days: { 0: [{ childId: 'cA', slots: [8, 9, 10, 11] }] },
    };
    const result = compute([ws], [familyA], [childA]);
    expect(result.nounouAnnualHours).toBeCloseTo(result.familyAnnualHours['fA'], 5);
  });

  it('journée sans garde: ne contribue pas', () => {
    const ws: WeekSchedule = {
      id: 'w1', name: 'Test', weeksPerYear: 10,
      days: { 0: [] },
    };
    const result = compute([ws], [familyA], [childA]);
    expect(result.nounouAnnualHours).toBe(0);
  });

  it('deux plannings: pondération correcte par weeksPerYear', () => {
    const ws1: WeekSchedule = {
      id: 'w1', name: 'Scolaire', weeksPerYear: 30,
      days: { 0: [{ childId: 'cA', slots: [8, 9, 10, 11] }] },
    };
    const ws2: WeekSchedule = {
      id: 'w2', name: 'Vacances', weeksPerYear: 10,
      days: { 0: [{ childId: 'cA', slots: [8, 9] }] },
    };
    const result = compute([ws1, ws2], [familyA], [childA]);
    // 4 slots × 15/60 × 30 + 2 slots × 15/60 × 10 = 30 + 5 = 35h
    expect(result.nounouAnnualHours).toBeCloseTo(35, 5);
  });

  it('deux familles: chaque famille accumule uniquement ses heures', () => {
    const ws: WeekSchedule = {
      id: 'w1', name: 'Test', weeksPerYear: 10,
      days: {
        0: [{ childId: 'cA', slots: [8, 9, 10] }],
        1: [{ childId: 'cB', slots: [8, 9] }],
      },
    };
    const result = compute([ws], [familyA, familyB], [childA, childB]);
    expect(result.familyAnnualHours['fA']).toBeCloseTo(3 * 15 / 60 * 10, 5);
    expect(result.familyAnnualHours['fB']).toBeCloseTo(2 * 15 / 60 * 10, 5);
  });
});
