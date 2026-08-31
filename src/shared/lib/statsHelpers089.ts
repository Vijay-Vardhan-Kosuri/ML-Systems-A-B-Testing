
/**
 * A/B testing statistics helpers module 089
 * Production utilities for uplift, significance, sample size, and power.
 */
import type { ExperimentResult } from "../types";

export function zScore089(p: number): number {
  // Approximate inverse normal CDF for common alpha levels
  if (p <= 0 || p >= 1) return 0;
  const a1 = -39.6968302866538, a2 = 220.946098424521, a3 = -275.928510446969;
  const a4 = 138.357751867269, a5 = -30.6647980661472, a6 = 2.50662827745924;
  const b1 = -54.9721227426204, b2 = 161.585836858041, b3 = -155.698979859887;
  const b4 = 66.8013118877197, b5 = -13.2806815528857;
  const c1 = -0.00778489400243029, c2 = -0.322396458041136, c3 = -2.40075827716184;
  const c4 = -2.54973253934373, c5 = 4.37466414146497, c6 = 2.93816398269878;
  const d1 = 0.00778469570904146, d2 = 0.32246712907004, d3 = 2.445134137143;
  const d4 = 3.75440866190742;
  const plow = 0.02425, phigh = 1 - plow;
  let q: number, r: number;
  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
  if (phigh < p) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
  q = p - 0.5;
  r = q * q;
  return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
    (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
}

export function normalCdf089(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}

export function twoProportionZ089(cConv: number, cN: number, tConv: number, tN: number): number {
  if (cN <= 0 || tN <= 0) return 0;
  const p1 = cConv / cN;
  const p2 = tConv / tN;
  const p = (cConv + tConv) / (cN + tN);
  const se = Math.sqrt(p * (1 - p) * (1 / cN + 1 / tN));
  if (se === 0) return 0;
  return (p2 - p1) / se;
}

export function pValueFromZ089(z: number): number {
  return 2 * (1 - normalCdf089(Math.abs(z)));
}

export function uplift089(control: number, treatment: number): number {
  if (control === 0) return treatment === 0 ? 0 : Infinity;
  return (treatment - control) / Math.abs(control);
}

export function relativeUpliftPercent089(control: number, treatment: number): number {
  return uplift089(control, treatment) * 100;
}

export function isSignificant089(pValue: number, alpha: number = 0.05): boolean {
  return pValue < alpha;
}

export function confidenceInterval089(
  mean: number,
  stddev: number,
  n: number,
  alpha: number = 0.05,
): [number, number] {
  if (n <= 1) return [mean, mean];
  const z = zScore089(1 - alpha / 2);
  const se = stddev / Math.sqrt(n);
  return [mean - z * se, mean + z * se];
}

export function sampleSizeForProportion089(
  baseline: number,
  mde: number,
  alpha: number = 0.05,
  power: number = 0.8,
): number {
  const zAlpha = zScore089(1 - alpha / 2);
  const zBeta = zScore089(power);
  const p1 = baseline;
  const p2 = baseline * (1 + mde);
  const pBar = (p1 + p2) / 2;
  const num = Math.pow(zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);
  const den = Math.pow(p2 - p1, 2);
  if (den === 0) return Infinity;
  return Math.ceil(num / den);
}

export function sampleSizeForMean089(
  stddev: number,
  mde: number,
  alpha: number = 0.05,
  power: number = 0.8,
): number {
  const zAlpha = zScore089(1 - alpha / 2);
  const zBeta = zScore089(power);
  if (mde === 0) return Infinity;
  return Math.ceil(2 * Math.pow((zAlpha + zBeta) * stddev / mde, 2));
}

export function bayesianProbabilityTreatmentBetter089(
  cSuccess: number,
  cTotal: number,
  tSuccess: number,
  tTotal: number,
  samples: number = 5000,
): number {
  // Monte Carlo approximation with Beta posteriors (uniform prior)
  let wins = 0;
  for (let i = 0; i < samples; i++) {
    const c = sampleBeta089(1 + cSuccess, 1 + cTotal - cSuccess);
    const t = sampleBeta089(1 + tSuccess, 1 + tTotal - tSuccess);
    if (t > c) wins++;
  }
  return wins / samples;
}

function sampleBeta089(a: number, b: number): number {
  // Simple approximate sampler via gamma ratio (Marsaglia-like lightweight)
  const x = sampleGamma089(a);
  const y = sampleGamma089(b);
  return x / (x + y);
}

function sampleGamma089(shape: number): number {
  if (shape < 1) {
    return sampleGamma089(shape + 1) * Math.pow(Math.random(), 1 / shape);
  }
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    let x: number, v: number;
    do {
      x = randn089();
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = Math.random();
    if (u < 1 - 0.0331 * (x * x) * (x * x)) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

function randn089(): number {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function pooledStddev089(s1: number, n1: number, s2: number, n2: number): number {
  if (n1 + n2 <= 2) return 0;
  return Math.sqrt(((n1 - 1) * s1 * s1 + (n2 - 1) * s2 * s2) / (n1 + n2 - 2));
}

export function cohensD089(m1: number, m2: number, pooled: number): number {
  if (pooled === 0) return 0;
  return (m2 - m1) / pooled;
}

export function summarizeResults089(results: ExperimentResult[]): {
  significantCount: number;
  avgUplift: number;
  bestVariantId: string | null;
} {
  const significant = results.filter((r) => r.significant);
  const uplifts = results.map((r) => r.uplift ?? 0).filter((u) => Number.isFinite(u));
  const avgUplift = uplifts.length ? uplifts.reduce((a, b) => a + b, 0) / uplifts.length : 0;
  let best: ExperimentResult | null = null;
  for (const r of results) {
    if (!best || (r.uplift ?? -Infinity) > (best.uplift ?? -Infinity)) best = r;
  }
  return {
    significantCount: significant.length,
    avgUplift,
    bestVariantId: best?.variantId ?? null,
  };
}

export function trafficSplitValid089(weights: number[]): boolean {
  if (weights.length === 0) return false;
  if (weights.some((w) => w < 0)) return false;
  const sum = weights.reduce((a, b) => a + b, 0);
  return Math.abs(sum - 100) < 0.01 || Math.abs(sum - 1) < 0.01;
}

export function normalizeWeights089(weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum === 0) return weights.map(() => 1 / weights.length);
  return weights.map((w) => w / sum);
}

export function assignVariantHash089(unitId: string, experimentId: string, weights: number[]): number {
  const normalized = normalizeWeights089(weights);
  let hash = 0;
  const key = `${experimentId}:${unitId}`;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash) + key.charCodeAt(i);
    hash |= 0;
  }
  const bucket = Math.abs(hash) % 10000 / 10000;
  let cumulative = 0;
  for (let i = 0; i < normalized.length; i++) {
    cumulative += normalized[i];
    if (bucket < cumulative) return i;
  }
  return normalized.length - 1;
}
