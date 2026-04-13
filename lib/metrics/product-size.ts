/**
 * Katydids - Product Size Metrics Core Functions
 */

import { FpaInputs, FpaComplexity } from "./types";

/**
 * Basic Metrics
 */
export const calculateCommentDensity = (cloc: number, loc: number): number => loc > 0 ? cloc / loc : 0;
export const calculateNcloc = (cloc: number, loc: number): number => Math.max(0, loc - cloc);
export const calculateLgf = (locLang1: number, locLang2: number): number => locLang2 > 0 ? locLang1 / locLang2 : 0;

/**
 * Halstead Metrics
 */
export const calculateHalsteadVocabulary = (n1: number, n2: number) => n1 + n2;
export const calculateHalsteadLength = (N1: number, N2: number) => N1 + N2;
export const calculateHalsteadVolume = (n1: number, n2: number, N1: number, N2: number): number => {
  const n = n1 + n2;
  const N = N1 + N2;
  return n > 0 ? N * Math.log2(n) : 0;
};
export const calculateHalsteadDifficulty = (n1: number, n2: number, N2: number): number => {
  return n2 > 0 ? (n1 / 2) * (N2 / n2) : 0;
};
export const calculateHalsteadEffort = (n1: number, n2: number, N1: number, N2: number): number => {
  return calculateHalsteadDifficulty(n1, n2, N2) * calculateHalsteadVolume(n1, n2, N1, N2);
};

/**
 * Function Point Analysis (FPA)
 */
const FPA_WEIGHTS: Record<keyof FpaInputs, Record<FpaComplexity, number>> = {
  ilf: { low: 7, avg: 10, high: 15 },
  elf: { low: 5, avg: 7, high: 10 },
  ei: { low: 3, avg: 4, high: 6 },
  eo: { low: 4, avg: 5, high: 7 },
  eq: { low: 3, avg: 4, high: 6 }
};

export const calculateUfp = (inputs: FpaInputs): number => {
  return (Object.keys(inputs) as Array<keyof FpaInputs>).reduce((sum, key) => {
    const item = inputs[key];
    return sum + (item.count * FPA_WEIGHTS[key][item.comp]);
  }, 0);
};

export const calculateVaf = (tdi: number): number => (tdi * 0.01) + 0.65;
export const calculateAfp = (ufp: number, vaf: number): number => ufp * vaf;

/**
 * Cyclomatic Complexity
 */
export const calculateCcEdges = (e: number, n: number, p: number = 1): number => e - n + (2 * p);
export const calculateCcDecision = (d: number, p: number = 1): number => d + p;
export const calculateCcDensity = (cc: number, loc: number): number => loc > 0 ? Math.max(0, cc / loc) : 0;
