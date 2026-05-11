export type SplitRule = 'per-child' | 'per-family';

export type FamilyInput = {
  id: string;
  name: string;
  annualNetRevenue: number;
  youngestChildAge: number;
  declaredMonthlyHours: number;
  actualCMGOverride?: number;
};

export type GardeConfig = {
  families: FamilyInput[];
  children: Array<{ id: string; familyId: string; name: string }>;
  weekSchedules: import('../ScheduleEngine/types').WeekSchedule[];
  expenses: import('../ExpenseSplitter/types').Expense[];
  nounouNetSalary: number;
  splitRule: SplitRule;
};

export type FamilySummary = {
  familyId: string;
  familyName: string;
  grossShare: number;
  cmgDeduction: number;
  expensesShare: number;
  netCharge: number;
};

export type AggregatedResult = {
  totalEmployerCost: number;
  families: FamilySummary[];
};
