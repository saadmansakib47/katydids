/**
 * Contains shared types and interfaces for the metrics calculation modules.
 */

export type FpaComplexity = 'low' | 'avg' | 'high';

export interface FpaItem {
  count: number;
  comp: FpaComplexity;
}

export interface FpaInputs {
  ilf: FpaItem;
  elf: FpaItem;
  ei: FpaItem;
  eo: FpaItem;
  eq: FpaItem;
}
