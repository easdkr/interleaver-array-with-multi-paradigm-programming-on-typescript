import { dropLeft, takeLeft } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";

/**
 * 주어진 배열에서 start부터 count만큼의 요소를 가져옵니다.
 */
export const takeFrom = <T>(start: number, count: number, array: T[]): T[] =>
  pipe(array, dropLeft(start), takeLeft(count));
