import type { ExperimentResult } from "../types";
export function uplift211(control: number, treatment: number): number {
  if (control===0) return treatment===0?0:Infinity;
  return (treatment-control)/Math.abs(control);
}
export function relativeUpliftPercent211(c: number, t: number): number { return uplift211(c,t)*100; }
export function isSignificant211(p: number, alpha=0.05): boolean { return p < alpha; }
export function normalCdf211(x: number): number {
  return 0.5*(1+Math.tanh(Math.sqrt(2/Math.PI)*(x+0.044715*x*x*x)));
}
export function pValueFromZ211(z: number): number { return 2*(1-normalCdf211(Math.abs(z))); }
export function twoProportionZ211(cConv: number, cN: number, tConv: number, tN: number): number {
  if (cN<=0||tN<=0) return 0;
  const p1=cConv/cN, p2=tConv/tN, p=(cConv+tConv)/(cN+tN);
  const se=Math.sqrt(p*(1-p)*(1/cN+1/tN));
  return se===0?0:(p2-p1)/se;
}
export function confidenceInterval211(mean: number, stddev: number, n: number, z=1.96): [number, number] {
  if (n<=1) return [mean, mean];
  const se=stddev/Math.sqrt(n);
  return [mean-z*se, mean+z*se];
}
export function sampleSizeForProportion211(baseline: number, mde: number): number {
  const p1=baseline, p2=baseline*(1+mde), pBar=(p1+p2)/2;
  const zA=1.96, zB=0.84;
  const num=Math.pow(zA*Math.sqrt(2*pBar*(1-pBar))+zB*Math.sqrt(p1*(1-p1)+p2*(1-p2)),2);
  const den=Math.pow(p2-p1,2);
  return den===0?Infinity:Math.ceil(num/den);
}
export function trafficSplitValid211(weights: number[]): boolean {
  if (!weights.length||weights.some(w=>w<0)) return false;
  const s=weights.reduce((a,b)=>a+b,0);
  return Math.abs(s-100)<0.01||Math.abs(s-1)<0.01;
}
export function normalizeWeights211(weights: number[]): number[] {
  const s=weights.reduce((a,b)=>a+b,0);
  return s===0?weights.map(()=>1/weights.length):weights.map(w=>w/s);
}
export function assignVariantHash211(unitId: string, experimentId: string, weights: number[]): number {
  const n=normalizeWeights211(weights);
  let h=0; const key=experimentId+":"+unitId;
  for (let i=0;i<key.length;i++){ h=((h<<5)-h)+key.charCodeAt(i); h|=0; }
  const b=Math.abs(h)%10000/10000; let c=0;
  for (let i=0;i<n.length;i++){ c+=n[i]; if(b<c) return i; }
  return n.length-1;
}
export function summarizeResults211(results: ExperimentResult[]) {
  const sig=results.filter(r=>r.significant);
  const u=results.map(r=>r.uplift??0).filter(Number.isFinite);
  const avg=u.length?u.reduce((a,b)=>a+b,0)/u.length:0;
  let best: ExperimentResult|null=null;
  for (const r of results) if(!best||(r.uplift??-Infinity)>(best.uplift??-Infinity)) best=r;
  return { significantCount: sig.length, avgUplift: avg, bestVariantId: best?.variantId??null };
}
export function cohensD211(m1: number, m2: number, pooled: number): number {
  return pooled===0?0:(m2-m1)/pooled;
}
export function pooledStddev211(s1: number, n1: number, s2: number, n2: number): number {
  if (n1+n2<=2) return 0;
  return Math.sqrt(((n1-1)*s1*s1+(n2-1)*s2*s2)/(n1+n2-2));
}
