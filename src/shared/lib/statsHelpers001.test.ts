import { describe, it, expect } from "vitest";
import { uplift001, isSignificant001, relativeUpliftPercent001, trafficSplitValid001 } from "./statsHelpers001";

describe("statsHelpers001", () => {
  it("computes uplift", () => {
    expect(uplift001(0.1, 0.12)).toBeCloseTo(0.2);
  });
  it("relative uplift percent", () => {
    expect(relativeUpliftPercent001(0.1, 0.12)).toBeCloseTo(20);
  });
  it("significance", () => {
    expect(isSignificant001(0.01, 0.05)).toBe(true);
    expect(isSignificant001(0.1, 0.05)).toBe(false);
  });
  it("traffic split", () => {
    expect(trafficSplitValid001([50, 50])).toBe(true);
    expect(trafficSplitValid001([60, 50])).toBe(false);
  });
});
