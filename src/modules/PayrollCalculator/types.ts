export type URSSAFRates = {
  employerChargesRate: number;
  employeeChargesRate: number;
  netToGrossMultiplier: number;
  grossToTotalCostMultiplier: number;
};

export type PayrollResult = {
  netSalary: number;
  grossSalary: number;
  employeeCharges: number;
  employerCharges: number;
  totalEmployerCost: number;
};
