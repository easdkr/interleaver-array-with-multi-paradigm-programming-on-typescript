# Interleaver with number pattern (with multi paradigm programming on typescript)

> [블로그](https://velog.io/@easdkr/%EB%B3%B5%EC%9E%A1%ED%95%9C-%EC%A0%95%EB%A0%AC-grouping%EA%B3%BC-interleaving-with-%EB%A9%80%ED%8B%B0%ED%8C%A8%EB%9F%AC%EB%8B%A4%EC%9E%84-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D#%EB%93%A4%EC%96%B4%EA%B0%80%EB%A9%B0) 예제 프로젝트 입니다.

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

const result = Interleaver.of(arrays, pattern).interleave();

console.log(result); // [1,2,3,4,5,6,7,8,9,10]
```
