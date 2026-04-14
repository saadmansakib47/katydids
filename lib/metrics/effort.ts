export type CocomoMode = 'organic' | 'semidetached' | 'embedded';

export interface CocomoCoefficients {
  a: number;
  b: number;
  c: number;
  d: number;
}

export const COCOMO_COEFFICIENTS: Record<CocomoMode, CocomoCoefficients> = {
  organic: { a: 3.2, b: 1.05, c: 2.5, d: 0.38 },
  semidetached: { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
  embedded: { a: 2.8, b: 1.20, c: 2.5, d: 0.32 },
};

export const calculateEffort = (kloc: number, mode: CocomoMode, eaf: number = 1.0): number => {
  const { a, b } = COCOMO_COEFFICIENTS[mode];
  return a * Math.pow(kloc, b) * eaf;
};

export const calculateDuration = (effort: number, mode: CocomoMode): number => {
  const { c, d } = COCOMO_COEFFICIENTS[mode];
  return c * Math.pow(effort, d);
};

export const calculateStaffing = (effort: number, duration: number): number => {
  return duration > 0 ? effort / duration : 0;
};
