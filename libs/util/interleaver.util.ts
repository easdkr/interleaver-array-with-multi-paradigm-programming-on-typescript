import { identity, pipe } from "fp-ts/function";
import { flatten, mapWithIndex, filterMap } from "fp-ts/Array";
import { none, some, type None, type Some } from "fp-ts/Option";
import { takeFrom } from "../functional";
import { PositionPointer } from "./position";

export class Interleaver<T> {
  /**
   * 각 배열의 현재 위치를 저장합니다.
   */
  private positions!: PositionPointer;

  private constructor(pattern: number[], private readonly arrays: T[][]) {
    this.positions = PositionPointer.of(
      arrays.map((a) => a.length),
      pattern
    );
  }

  public static of<T>(pattern: number[], arrays: T[][]): Interleaver<any> {
    return new Interleaver(pattern, arrays);
  }

  /**
   * 주어진 패턴에 따라 배열을 교차하여 하나의 배열로 만듭니다.
   */
  public interleave(options?: { allowDuplicates: boolean }): T[] {
    return pipe(
      this.interleaveRecursive(),
      Array.from,
      options?.allowDuplicates ? identity : (arr) => Array.from(new Set(arr))
    ) as T[]; // Add type assertion to specify the return type as T[]
  }

  /**
   * 재귀적으로 인터리빙된 배열을 방출하는 제너레이터입니다.
   * 각 반복마다 현재 위치에 따라 교차된 요소를 방출하고, 위치를 업데이트합니다.
   */
  private *interleaveRecursive(): Generator<T, void, undefined> {
    const nextElements = this.getNextElements();
    // 다음 요소가 없으면 종료
    if (nextElements.length === 0) {
      return;
    }

    this.positions.update(this.arrays);

    // 이번 반복에서 만든 요소를 방출
    yield* nextElements;

    // 재귀적으로 다음 요소들을 방출
    yield* this.interleaveRecursive();
  }

  /**
   * 현재 위치에 따라 다음 요소들을 가져옵니다.
   */
  private getNextElements = (): T[] =>
    pipe(
      this.arrays,
      mapWithIndex(this.getNextElement),
      filterMap(identity),
      flatten
    );

  /**
   * 현재 위치에 따라 idx번째 배열에서 다음 요소들을 해당 배열의 pattern 크기만큼 가져옵니다.
   */
  private getNextElement = (idx: number): None | Some<T[]> =>
    this.positions.isEnd(idx)
      ? none
      : some(
          takeFrom(
            this.positions.getPosition(idx),
            this.positions.getPattern(idx),
            this.arrays[idx]
          )
        );
}
