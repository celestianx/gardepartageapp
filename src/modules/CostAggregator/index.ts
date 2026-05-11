import { compute as computeSchedule } from '../ScheduleEngine';
import { calculate as calculatePayroll, loadRates as loadURSSAFRates } from '../PayrollCalculator';
import { calculate as calculateCMG, loadCMGRates } from '../CMGCalculator';
import { split as splitExpenses } from '../ExpenseSplitter';
import type { GardeConfig, AggregatedResult, FamilySummary } from './types';

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function aggregate(config: GardeConfig): AggregatedResult {
  const urssafRates = loadURSSAFRates();
  const cmgRates = loadCMGRates();

  const scheduleResult = computeSchedule(config.weekSchedules, config.families, config.children);
  const payroll = calculatePayroll(config.nounouNetSalary, urssafRates);
  const totalEmployerCost = payroll.totalEmployerCost;

  const familyIds = config.families.map(f => f.id);
  const totalFamilyHours = Object.values(scheduleResult.familyAnnualHours).reduce((a, b) => a + b, 0);

  const grossShares: Record<string, number> = {};
  if (config.splitRule === 'per-family') {
    let distributed = 0;
    familyIds.forEach((id, i) => {
      grossShares[id] = i === familyIds.length - 1
        ? round2(totalEmployerCost - distributed)
        : round2(totalEmployerCost / familyIds.length);
      distributed += grossShares[id];
    });
  } else {
    let distributed = 0;
    familyIds.forEach((id, i) => {
      const ratio = totalFamilyHours > 0 ? (scheduleResult.familyAnnualHours[id] ?? 0) / totalFamilyHours : 0;
      grossShares[id] = i === familyIds.length - 1
        ? round2(totalEmployerCost - distributed)
        : round2(totalEmployerCost * ratio);
      distributed += grossShares[id];
    });
  }

  const cmgResults: Record<string, number> = {};
  for (const family of config.families) {
    const cmgResult = calculateCMG({
      id: family.id,
      annualNetRevenue: family.annualNetRevenue,
      youngestChildAge: family.youngestChildAge,
      declaredMonthlyHours: family.declaredMonthlyHours,
      actualCMGOverride: family.actualCMGOverride,
    }, cmgRates);
    const maxCMG = round2(grossShares[family.id] * cmgRates.maxCoverageRatio);
    cmgResults[family.id] = Math.min(cmgResult.effectiveAmount, maxCMG);
  }

  const scheduleRef = {
    familyAnnualHours: scheduleResult.familyAnnualHours,
    childToFamily: Object.fromEntries(config.children.map(c => [c.id, c.familyId])),
  };
  const expenseSplit = splitExpenses(config.expenses, scheduleRef, familyIds);

  const families: FamilySummary[] = config.families.map(f => {
    const grossShare = grossShares[f.id] ?? 0;
    const cmgDeduction = cmgResults[f.id] ?? 0;
    const expensesShare = expenseSplit.totalByFamily[f.id] ?? 0;
    const netCharge = round2(grossShare - cmgDeduction + expensesShare);
    return { familyId: f.id, familyName: f.name, grossShare, cmgDeduction, expensesShare, netCharge };
  });

  return { totalEmployerCost, families };
}
