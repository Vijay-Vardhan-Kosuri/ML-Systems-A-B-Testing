/**
 * homepage experiment planner for ML A/B testing platform.
 * Production logic for bounce optimization experiments.
 */
import type { Experiment, Variant, ExperimentResult } from "@/shared/types";

export type HomepagePlannerConfig = {
  minSampleSize: number;
  maxDurationDays: number;
  primaryMetric: string;
  significanceLevel: number;
  trafficCapPercent: number;
};

export const defaultHomepagePlannerConfig: HomepagePlannerConfig = {
  minSampleSize: 5000,
  maxDurationDays: 28,
  primaryMetric: "bounce",
  significanceLevel: 0.05,
  trafficCapPercent: 50,
};

export function validateHomepageExperiment(
  exp: Partial<Experiment>,
  variants: Variant[],
  config = defaultHomepagePlannerConfig,
): string[] {
  const errors: string[] = [];
  if (!exp.name || exp.name.trim().length < 3) errors.push("name_required");
  if (!exp.hypothesis || exp.hypothesis.trim().length < 10) errors.push("hypothesis_required");
  if ((exp.trafficPercent ?? 0) > config.trafficCapPercent) errors.push("traffic_above_cap");
  if ((exp.sampleSizeTarget ?? 0) < config.minSampleSize) errors.push("sample_size_below_min");
  if (variants.length < 2) errors.push("need_two_variants");
  const controls = variants.filter((v) => v.isControl || v.type === "control");
  if (controls.length !== 1) errors.push("need_one_control");
  const weightSum = variants.reduce((s, v) => s + v.trafficWeight, 0);
  if (Math.abs(weightSum - 100) > 0.5) errors.push("weights_must_sum_100");
  return errors;
}

export function estimateHomepageDurationDays(
  sampleSizeTarget: number,
  dailyTraffic: number,
  trafficPercent: number,
): number {
  if (dailyTraffic <= 0 || trafficPercent <= 0) return Infinity;
  const eligible = dailyTraffic * (trafficPercent / 100);
  return Math.ceil(sampleSizeTarget / eligible);
}

export function scoreHomepageResults(results: ExperimentResult[]): {
  winnerId: string | null;
  avgUplift: number;
  significant: number;
} {
  let best: ExperimentResult | null = null;
  let sum = 0;
  let count = 0;
  let significant = 0;
  for (const r of results) {
    if (r.significant) significant++;
    if (r.uplift != null && Number.isFinite(r.uplift)) {
      sum += r.uplift;
      count++;
    }
    if (!best || (r.uplift ?? -Infinity) > (best.uplift ?? -Infinity)) best = r;
  }
  return {
    winnerId: best?.variantId ?? null,
    avgUplift: count ? sum / count : 0,
    significant,
  };
}

export function buildHomepageSummary(
  exp: Experiment,
  results: ExperimentResult[],
): Record<string, unknown> {
  const scored = scoreHomepageResults(results);
  return {
    experimentId: exp.id,
    domain: "homepage",
    metric: "bounce",
    status: exp.status,
    trafficPercent: exp.trafficPercent,
    ...scored,
    updatedAt: new Date().toISOString(),
  };
}

export function isHomepageReadyToShip(
  exp: Experiment,
  results: ExperimentResult[],
  minSignificance = 0.05,
): boolean {
  if (exp.status !== "running" && exp.status !== "completed") return false;
  const scored = scoreHomepageResults(results);
  return scored.significant > 0 && scored.avgUplift > 0;
}

export function recommendHomepageTraffic(
  currentDaily: number,
  targetSample: number,
  maxDays: number,
): number {
  if (currentDaily <= 0 || maxDays <= 0) return 0;
  const neededPerDay = targetSample / maxDays;
  const percent = (neededPerDay / currentDaily) * 100;
  return Math.min(100, Math.max(1, Math.ceil(percent)));
}

export function filterHomepageByTag(
  experiments: Experiment[],
  tag: string,
): Experiment[] {
  const t = tag.toLowerCase();
  return experiments.filter(
    (e) => e.tags.some((x) => x.toLowerCase() === t) || e.name.toLowerCase().includes(t),
  );
}
