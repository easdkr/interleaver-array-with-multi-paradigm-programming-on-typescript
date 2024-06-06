import { identity, pipe } from "fp-ts/function";
import { flatten, mapWithIndex, filterMap } from "fp-ts/Array";
import { none, some, type Option } from "fp-ts/Option";
import { takeFrom } from "../functional";
import { PositionPointer } from "./position";

export class Interleaver<T> {
  /**
   * 각 배열의 현재 위치를 저장합니다.
   */
  private pointer!: PositionPointer;

  private constructor(pattern: number[], private readonly arrays: T[][]) {
    this.pointer = PositionPointer.of(
      arrays.map((a) => a.length),
      pattern
    );
  }

  public static of = <T>(pattern: number[], arrays: T[][]): Interleaver<T> =>
    new Interleaver(pattern, arrays);

  /**
   * 주어진 패턴에 따라 배열을 교차하여 하나의 배열로 만듭니다.
   */
  public interleave = (options?: { allowDuplicates: boolean }): T[] =>
    pipe(
      this,
      Array.from<T>,
      options?.allowDuplicates ? identity : (arr) => Array.from(new Set(arr))
    );

  /**
   * `Iterable` 인터페이스 구현.
   * 인터리빙된 요소들을 반환하는 제너레이터를 제공합니다.
   */
  public *[Symbol.iterator](): Iterator<T> {
    while (true) {
      const nextElements = this.getNextElements();
      // 다음 요소가 없으면 종료
      if (nextElements.length === 0) {
        break;
      }

      // 이번 반복에서 만든 요소를 방출
      yield* nextElements;

      // 모든 배열의 방출이 끝나면 다음 위치로 이동
      this.pointer.next();
    }
  }

  /**
   * 현재 위치에 따라 다음 요소들을 배열로 수집합니다.
   */
  private getNextElements = () =>
    pipe(
      this.arrays,
      mapWithIndex(this.getNextElement),
      filterMap(identity),
      flatten
    );

  /**
   * 현재 위치에 따라 idx번째 배열에서 다음 요소들을 해당 배열의 pattern 크기만큼 가져옵니다.
   */
  private getNextElement = (idx: number, item: T[]): Option<T[]> =>
    this.pointer.isEnd(idx)
      ? none
      : some(
          takeFrom(
            this.pointer.getPosition(idx),
            this.pointer.getPattern(idx),
            item
          )
        );
}
