import { calculateMetrics } from "./calculate-metrics";

describe("calculate metrics", () => {
  it("should get max right", () => {
    expect(calculateMetrics([10, 20, 30, 15, 20, 8]).max).toEqual(30);
  });

  it("should get min right", () => {
    expect(calculateMetrics([10, 20, 30, 56, 34, 12]).min).toEqual(10);
  });

  it("should get median right", () => {
    expect(calculateMetrics([10, 20, 30, 14, 24]).median).toEqual(20);
  });

  it("should get mean right", () => {
    expect(calculateMetrics([10, 20, 30, 20, 15, 25]).mean).toEqual(20);
  });
});
