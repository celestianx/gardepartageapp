export type CMGTranche = {
  maxRevenue?: number;
  minRevenue?: number;
  monthlyMax: number;
  hourlyCapHours: number;
};

export type CMGRates = {
  childUnder6: { lowIncome: CMGTranche; midIncome: CMGTranche; highIncome: CMGTranche };
  childFrom6: { lowIncome: CMGTranche; midIncome: CMGTranche; highIncome: CMGTranche };
  maxCoverageRatio: number;
};

export type FamilyProfile = {
  id: string;
  annualNetRevenue: number;
  youngestChildAge: number;
  declaredMonthlyHours: number;
  actualCMGOverride?: number;
};

export type CMGResult = {
  theoreticalAmount: number;
  effectiveAmount: number;
  isOverridden: boolean;
};
