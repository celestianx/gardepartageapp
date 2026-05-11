export type GardeConfig = {
  id?: string;
  families: Array<{
    id: string;
    name: string;
    annualNetRevenue: number;
    youngestChildAge: number;
    declaredMonthlyHours: number;
    actualCMGOverride?: number;
  }>;
  children: Array<{
    id: string;
    familyId: string;
    name: string;
  }>;
  weekSchedules: Array<{
    id: string;
    name: string;
    weeksPerYear: number;
    days: Record<number, Array<{
      childId: string;
      slots: number[];
    }>>;
  }>;
  expenses: Array<{
    id: string;
    label: string;
    amount: number;
    rule: 'per-child' | 'proportional-to-hours' | 'equal-split';
    childId?: string;
  }>;
  nounouNetSalary: number;
  splitRule: 'per-child' | 'per-family';
  createdAt: string;
  updatedAt: string;
};

export class ConfigNotFoundError extends Error {
  constructor(id: string) {
    super(`Configuration not found: ${id}`);
    this.name = 'ConfigNotFoundError';
  }
}
