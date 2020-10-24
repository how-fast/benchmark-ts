export interface Metrics {
  total: number;
  min: number;
  max: number;
  median: number;
  mean: number;
  sd: number;
  p99: number;
  p95: number;
  p90: number;
  p50: number;
  p25: number;
}

export function calculateMetrics(values: number[]): Metrics {
  const sorted = values.sort((a, b) => a - b);
  const max = sorted[sorted.length - 1];
  const min = sorted[0];
  const median = sorted[Math.floor(sorted.length / 2)];
  const total = sorted.reduce((prev, sum) => prev + sum, 0);
  const mean = total / sorted.length;

  const sd = standardDeviation(sorted, mean);

  return {
    total,
    min,
    max,
    median,
    mean,
    sd,
    p99: p(99, sorted),
    p95: p(95, sorted),
    p90: p(90, sorted),
    p50: p(50, sorted),
    p25: p(25, sorted),
  };
}

function standardDeviation(sorted: number[], mean: number): number {
  const diffs = sorted.map((n) => n - mean);
  const squareDiffs = diffs.map((n) => n * n);
  const totalSquareDiff = squareDiffs.reduce((prev, sum) => prev + sum, 0);
  const avgSquareDiff = totalSquareDiff / squareDiffs.length;
  const sd = Math.sqrt(avgSquareDiff);
  return sd;
}

function p(p: number, sorted: number[]): number {
  if (p < 0 || p > 100) {
    throw Error("p needs to be between 0 and 100");
  }
  const index = Math.floor((p / 100) * sorted.length);
  return sorted[index];
}
