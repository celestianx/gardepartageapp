import fs from 'fs';
import path from 'path';
import type { FamilyProfile, CMGRates, CMGResult, CMGTranche } from './types';

export function loadCMGRates(): CMGRates {
  const filePath = path.join(process.cwd(), 'rates', '2026.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  return data.cmg as CMGRates;
}

function findTranche(
  revenue: number,
  grid: { lowIncome: CMGTranche; midIncome: CMGTranche; highIncome: CMGTranche }
): CMGTranche {
  if (revenue < (grid.lowIncome.maxRevenue ?? Infinity)) return grid.lowIncome;
  if (revenue < (grid.midIncome.maxRevenue ?? Infinity)) return grid.midIncome;
  return grid.highIncome;
}

export function calculate(profile: FamilyProfile, rates: CMGRates): CMGResult {
  const grid = profile.youngestChildAge < 6 ? rates.childUnder6 : rates.childFrom6;
  const tranche = findTranche(profile.annualNetRevenue, grid);
  const theoreticalAmount = tranche.monthlyMax;
  const isOverridden = profile.actualCMGOverride !== undefined;
  const effectiveAmount = isOverridden ? profile.actualCMGOverride! : theoreticalAmount;
  return { theoreticalAmount, effectiveAmount, isOverridden };
}
