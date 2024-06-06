export class PositionPointer {
  #positions: number[] = [];

  private constructor(
    private readonly targetLengths: number[],
    private readonly windowSize: number[]
  ) {
    this.validatePattern();
    this.initializePositions();
  }

  private validatePattern = () => {
    if (this.windowSize.length !== this.targetLengths.length) {
      throw new Error("패턴과 배열의 길이가 일치하지 않습니다.");
    }
    if (this.windowSize.some((p) => p < 1)) {
      throw new Error("패턴은 1 이상의 값을 가져야 합니다.");
    }
  };

  private initializePositions = () =>
    (this.#positions = this.targetLengths.map(() => 0));

  public static of = (lengths: number[], pattern: number[]): PositionPointer =>
    new PositionPointer(lengths, pattern);

  /**
   * {index} 위치의 윈도우 시작 위치를 반환합니다.
   */
  public getLeft = (index: number) => this.#positions[index];

  /**
   * {index} 위치의 윈도우 끝 위치를 반환합니다.
   */
  public getRight = (index: number) =>
    Math.min(
      this.#positions[index] + this.windowSize[index],
      this.targetLengths[index]
    );

  /**
   * {index} 위치의 윈도우 크기를 반환합니다.
   */
  public getWindowSize = (index: number) => this.windowSize[index];

  /**
   * {index} 위치 포인터가 배열의 끝에 도달했는지 여부를 반환합니다.
   */
  public isEnd = (index: number) =>
    this.#positions[index] >= this.targetLengths[index];

  /**
   * pattern에 따라 위치 포인터를 다음 위치로 이동합니다.
   * 배열의 끝에 도달하면 마지막 위치로 설정합니다.
   */
  public next = () =>
    (this.#positions = this.#positions.map((pos, idx) =>
      this.isEnd(idx) ? this.targetLengths[idx] : (pos += this.windowSize[idx])
    ));
}
