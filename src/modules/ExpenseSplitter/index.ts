import type { Expense, ScheduleResultRef, ExpenseSplitLine, ExpenseSplitResult } from './types';

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function split(
  expenses: Expense[],
  scheduleRef: ScheduleResultRef,
  familyIds: string[]
): ExpenseSplitResult {
  const lines: ExpenseSplitLine[] = [];

  for (const expense of expenses) {
    const expenseLines: ExpenseSplitLine[] = [];

    if (expense.rule === 'equal-split') {
      let distributed = 0;
      familyIds.forEach((familyId, i) => {
        const amount = i === familyIds.length - 1
          ? round2(expense.amount - distributed)
          : round2(expense.amount / familyIds.length);
        distributed += amount;
        expenseLines.push({ expenseId: expense.id, familyId, amount });
      });

    } else if (expense.rule === 'proportional-to-hours') {
      const totalHours = Object.values(scheduleRef.familyAnnualHours).reduce((a, b) => a + b, 0);
      let distributed = 0;
      familyIds.forEach((familyId, i) => {
        const ratio = totalHours > 0 ? (scheduleRef.familyAnnualHours[familyId] ?? 0) / totalHours : 0;
        const amount = i === familyIds.length - 1
          ? round2(expense.amount - distributed)
          : round2(expense.amount * ratio);
        distributed += amount;
        expenseLines.push({ expenseId: expense.id, familyId, amount });
      });

    } else if (expense.rule === 'per-child') {
      const familyId = expense.childId ? scheduleRef.childToFamily[expense.childId] : undefined;
      familyIds.forEach(fId => {
        expenseLines.push({
          expenseId: expense.id,
          familyId: fId,
          amount: familyId === fId ? expense.amount : 0,
        });
      });
    }

    lines.push(...expenseLines);
  }

  const totalByFamily: Record<string, number> = {};
  for (const familyId of familyIds) {
    totalByFamily[familyId] = round2(
      lines.filter(l => l.familyId === familyId).reduce((sum, l) => sum + l.amount, 0)
    );
  }

  return { lines, totalByFamily };
}
