export const calculateMaintainabilityIndex = (
  halsteadVolume: number,
  cyclomaticComplexity: number,
  loc: number
): number => {
  // SEI Maintainability Index formula
  // MI = 171 - 5.2 * ln(V) - 0.23 * (G) - 16.2 * ln(LOC)
  if (halsteadVolume <= 0 || loc <= 0) return 100;

  const mi = 171 
    - 5.2 * Math.log(halsteadVolume) 
    - 0.23 * cyclomaticComplexity 
    - 16.2 * Math.log(loc);
  
  // Normalize to 0-100 (Original scale can go slightly above 100 or below 0)
  return Math.min(100, Math.max(0, (mi * 100) / 171));
};

export const calculateDefectDensity = (defects: number, kloc: number): number => {
  return kloc > 0 ? defects / kloc : 0;
};
