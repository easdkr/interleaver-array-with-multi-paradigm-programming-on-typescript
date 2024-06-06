export class PositionPointer {
  #positions: number[] = [];

  private constructor(
    private readonly lengths: number[],
    private readonly pattern: number[]
  ) {
    this.validatePattern();
    this.initializePositions();
  }

  private validatePattern = () => {
    if (this.pattern.length !== this.lengths.length) {
      throw new Error("패턴과 배열의 길이가 일치하지 않습니다.");
    }
    if (this.pattern.some((p) => p < 1)) {
      throw new Error("패턴은 1 이상의 값을 가져야 합니다.");
    }
  };

  private initializePositions = () =>
    (this.#positions = this.lengths.map(() => 0));

  public static of = (lengths: number[], pattern: number[]): PositionPointer =>
    new PositionPointer(lengths, pattern);

  /**
   * {index} 위치 포인터를 반환합니다.
   */
  public getPosition = (index: number) => this.#positions[index];

  /**
   * {index} 위치의 패턴을 반환합니다.
   */
  public getPattern = (index: number) => this.pattern[index];

  /**
   * {index} 위치 포인터가 배열의 끝에 도달했는지 여부를 반환합니다.
   */
  public isEnd = (index: number) =>
    this.#positions[index] >= this.lengths[index];

  /**
   * pattern에 따라 위치 포인터를 다음 위치로 이동합니다.
   */
  public next = () =>
    (this.#positions = this.#positions.map((pos, idx) =>
      pos + this.pattern[idx] >= this.lengths[idx]
        ? this.lengths[idx]
        : (pos += this.pattern[idx])
    ));
}
