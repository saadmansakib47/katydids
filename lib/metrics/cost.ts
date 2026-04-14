export const calculateTotalCost = (personMonths: number, monthlyRate: number): number => {
  return personMonths * monthlyRate;
};

export const calculateCostPerFP = (totalCost: number, adjustedFP: number): number => {
  return adjustedFP > 0 ? totalCost / adjustedFP : 0;
};

export const calculateCostPerLOC = (totalCost: number, loc: number): number => {
  return loc > 0 ? totalCost / loc : 0;
};
