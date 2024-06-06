export const isEqualArray = (arr1: any[], arr2: any[]): boolean =>
  arr1.length === arr2.length && arr1.every((val, idx) => val === arr2[idx]);
