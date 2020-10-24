import { Benchmark } from "../src/benchmark";

const longArray = [];

for (let i = 0; i < 10000; i++) {
  longArray.push(Math.random() * 100_000);
}

const longIntArray = longArray.map((i) => Math.floor(i));

const reduce = (i) => i.reduce((a, b) => a + b, 0);
const loop = (i) => {
  let sum = 0;
  for (let j = 0; j < i.length; j++) {
    sum += i[j];
  }
  return sum;
};
const forEach = (i) => {
  let sum = 0;
  i.forEach((n) => (sum += n));
  return sum;
};

const bench = new Benchmark<number[]>();
bench
  .addInput("short array", [1, 2, 3, 4, 5])
  .addInput("long int array", longIntArray)
  .addInput("long array", longArray)
  .addOption("reduce", reduce)
  .addOption("loop", loop)
  .addOption("forEach", forEach);

const res = bench.run({
  iterations: 10,
  countPerIteration: 1_000,
  warmup: 2,
});

res.print();
