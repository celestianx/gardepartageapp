export type SplitRule = 'per-child' | 'proportional-to-hours' | 'equal-split';

export type Expense = {
  id: string;
  label: string;
  amount: number;
  rule: SplitRule;
  childId?: string;
};

export type ScheduleResultRef = {
  familyAnnualHours: Record<string, number>;
  childToFamily: Record<string, string>;
};

export type ExpenseSplitLine = {
  expenseId: string;
  familyId: string;
  amount: number;
};

export type ExpenseSplitResult = {
  lines: ExpenseSplitLine[];
  totalByFamily: Record<string, number>;
};
