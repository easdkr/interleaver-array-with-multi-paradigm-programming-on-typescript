import { Interleaver, isEqualArray } from "./libs/util";

function test(
  cases: Array<{
    description: string;
    arrays: number[][];
    pattern: number[];
    expected: number[];
  }>
): void {
  cases.forEach((c, idx) => {
    const result = Interleaver.of(c.pattern, c.arrays).interleave();
    console.log(
      `${c.description} : ${isEqualArray(result, c.expected) ? "PASS" : "FAIL"}`
    );
  });
}

test([
  {
    description: "Test case 1 (Normal)",
    arrays: [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15],
      [16, 17, 18, 19],
      [20, 21, 22],
    ],
    pattern: [2, 2, 2, 1],
    expected: [
      1, 2, 11, 12, 16, 17, 20, 3, 4, 13, 14, 18, 19, 21, 5, 6, 15, 22, 7, 8, 9,
      10,
    ],
  },
  {
    description: "Test case 2 (Normal)",
    arrays: [
      [1, 2, 6, 7],
      [3, 8],
      [4, 5, 9, 10],
    ],
    pattern: [2, 1, 2],
    expected: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    description: "Test case 3 (Empty array)",
    arrays: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [], []],
    pattern: [2, 2, 2],
    expected: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    description: "Test case 5 (All Empty array)",
    arrays: [[], [], []],
    pattern: [1, 2, 3],
    expected: [],
  },
  {
    description: "Test case 6 (Single element)",
    arrays: [[1], [2], [3], [4]],
    pattern: [1, 1, 1, 1],
    expected: [1, 2, 3, 4],
  },
  {
    description: "Test case 7 (Single element with empty array)",
    arrays: [[1], [], [3], [4]],
    pattern: [1, 1, 1, 1],
    expected: [1, 3, 4],
  },
  {
    description: "Test case 8 (Remove duplicates)",
    arrays: [
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5],
    ],
    pattern: [1, 1, 1],
    expected: [1, 2, 3, 4, 5],
  },
]);

// const interleave = Interleaver.of(
//   [2, 2],
//   [
//     ["Hello", "나는"],
//     ["world", "개발자"],
//   ]
// )[Symbol.iterator]();

// console.log(interleave.next());
// console.log(interleave.next());
// console.log(interleave.next());
// console.log(interleave.next());
// console.log(interleave.next());
