import { identity, pipe } from "fp-ts/function";
import { flatten, mapWithIndex, filterMap } from "fp-ts/Array";
import { none, some, type None, type Some } from "fp-ts/Option";
import { takeFrom } from "../functional";

export class Interleaver<T> {
  /**
   * 각 배열의 현재 위치를 저장합니다.
   */
  private positions: number[] = [];

  private constructor(
    private readonly pattern: number[],
    private readonly arrays: T[][]
  ) {
    this.validateInitialization();
    this.initializePositions();
  }

  /**
   * 패턴과 배열의 유효성을 검사합니다.
   */
  private validateInitialization = () => {
    if (this.pattern.length !== this.arrays.length) {
      throw new Error("패턴과 배열의 길이가 일치하지 않습니다.");
    }

    if (this.pattern.some((p) => p < 1)) {
      throw new Error("패턴은 1 이상의 값을 가져야 합니다.");
    }
  };

  /**
   * 각 배열의 현재 위치를 0(첫 번째 요소)으로 초기화합니다.
   */
  private initializePositions = () =>
    (this.positions = this.arrays.map(() => 0));

  public static of<T>(pattern: number[], arrays: T[][]): Interleaver<any> {
    return new Interleaver(pattern, arrays);
  }

  /**
   * 주어진 패턴에 따라 배열을 교차하여 하나의 배열로 만듭니다.
   */
  public interleave(): T[] {
    return [...this.interleaveRecursive()];
  }

  /**
   * 재귀적으로 인터리빙된 배열을 방출하는 제너레이터입니다.
   * 각 반복마다 현재 위치에 따라 교차된 요소를 방출하고, 위치를 업데이트합니다.
   */
  private *interleaveRecursive(): Generator<T, void, undefined> {
    const nextElements = this.getNextElements();
    if (nextElements.length === 0) {
      return;
    }

    this.updatePositions();

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
      this.pattern,
      mapWithIndex(this.getNextElement),
      filterMap(identity),
      flatten
    );

  /**
   * 현재 위치에 따라 idx번째 배열에서 다음 요소들을 해당 배열의 pattern 크기만큼 가져옵니다.
   */
  private getNextElement = (idx: number): None | Some<T[]> =>
    this.positions[idx] >= this.arrays[idx].length
      ? none
      : some(
          takeFrom(this.positions[idx], this.pattern[idx], this.arrays[idx])
        );

  /**
   * 다음 위치를 패턴에 따라 업데이트합니다.
   */
  private updatePositions(): void {
    this.positions = this.positions.map((position, idx) =>
      position + this.pattern[idx] >= this.arrays[idx].length
        ? this.arrays[idx].length
        : position + this.pattern[idx]
    );
  }
}
