import { describe, it, expect } from "vitest";
import { fetchExperiments, fetchExperiment } from "./experimentsService";

describe("experimentsService", () => {
  it("fetches experiments", async () => {
    const res = await fetchExperiments({ pageSize: 10 });
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.page).toBe(1);
  });
  it("fetches single experiment", async () => {
    const exp = await fetchExperiment("exp-001");
    expect(exp.id).toBe("exp-001");
  });
});
