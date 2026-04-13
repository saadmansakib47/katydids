/**
 * Katydids - Coupling Metrics Core Functions
 */

/**
 * Class Cohesion
 * Tight Class Cohesion (TCC) and Loose Class Cohesion (LCC)
 */
export const calculateTcc = (direct: number, maxPossible: number): number => {
  return maxPossible > 0 ? direct / maxPossible : 0;
};

export const calculateLcc = (direct: number, indirect: number, maxPossible: number): number => {
  return maxPossible > 0 ? (direct + indirect) / maxPossible : 0;
};

/**
 * Data Cohesion (RCI)
 * @param methodsPerVar Array where each item is number of methods using a given variable
 */
export const calculateTotalRci = (methodsPerVar: number[]): number => {
  return methodsPerVar.reduce((sum, n) => sum + ((n * (n - 1)) / 2), 0);
};

/**
 * OO Reuse from Client perspective
 */
export const calculateClientReuse = (directServerClasses: number, indirectServerClasses: number): number => {
  return directServerClasses + indirectServerClasses;
};
