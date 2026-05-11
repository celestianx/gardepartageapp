import fs from 'fs';
import path from 'path';
import type { URSSAFRates, PayrollResult } from './types';

export function loadRates(): URSSAFRates {
  const filePath = path.join(process.cwd(), 'rates', '2026.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  return data.urssaf as URSSAFRates;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculate(netSalary: number, rates: URSSAFRates): PayrollResult {
  const grossSalary = round2(netSalary * rates.netToGrossMultiplier);
  const employeeCharges = round2(grossSalary * rates.employeeChargesRate);
  const employerCharges = round2(grossSalary * rates.employerChargesRate);
  const totalEmployerCost = round2(grossSalary * rates.grossToTotalCostMultiplier);
  return { netSalary, grossSalary, employeeCharges, employerCharges, totalEmployerCost };
}
