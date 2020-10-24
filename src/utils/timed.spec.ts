import { timed } from "./timed";

describe("timed", () => {
  it("should time function call duration", () => {
    const time = timed(() => {
      let n = 0;
      for (let i = 0; i < 100; i++) {
        n += i;
      }
      return n;
    });

    expect(time).toBeGreaterThan(10);
  });
});
