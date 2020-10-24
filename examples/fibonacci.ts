import { Benchmark } from "../src/benchmark";

const iterFib = (i: number) => {
  const arr = [0, 1];
  for (let j = 2; j <= i; j++) {
    arr[j] = arr[j - 1] + arr[j - 2];
  }
  return arr[i];
};

const recurFib = (i: number) => {
  if (i < 2) return i;
  return recurFib(i - 1) + recurFib(i - 2);
};

const bench = new Benchmark<number>();
bench
  .addInput("small", 8)
  .addInput("medium", 34)
  .addOption("iterative", (i) => {
    return iterFib(i);
  })
  .addOption("recursive", (i) => {
    return recurFib(i);
  });

const res = bench.run({
  iterations: 4,
  countPerIteration: 20,
  warmup: 1,
});

res.print();
