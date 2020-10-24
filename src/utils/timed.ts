export function timed(fn: () => unknown): number {
  const before = process.hrtime.bigint();
  fn();
  const after = process.hrtime.bigint();
  return Number(after - before);
}
