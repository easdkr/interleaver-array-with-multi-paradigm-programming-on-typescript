# Interleaver with number pattern (with multi paradigm programming on typescript)

## 멀티 패러다임 프로그래밍으로 주어진 배열 그룹 (중첩 배열) 을 지정된 개수 패턴 배열에 따라 섞어서 하나의 배열로 만드는 방법

To install dependencies:

```bash
bun install
```

To run:

```bash
bun start
```

Example

```ts
const arrays = [
  [1, 2, 6, 7],
  [3, 8],
  [4, 5, 9, 10],
];

const pattern = [2, 1, 2];

const result = Interleaver.of(arrays, pattern);

console.log(result); // [1,2,3,4,5,6,7,8,9,10]
```
