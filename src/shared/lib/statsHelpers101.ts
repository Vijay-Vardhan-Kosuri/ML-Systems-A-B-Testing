import type { ExperimentResult } from "../types";
export function zScore101(p: number): number {
  if (p <= 0 || p >= 1) return 0;
  const t = Math.sqrt(-2 * Math.log(p < 0.5 ? p : 1 - p));
  const c0=2.515517,c1=0.802853,c2=0.010328,d1=1.432788,d2=0.189269,d3=0.001308;
  const x = t - (c0+c1*t+c2*t*t)/(1+d1*t+d2*t*t+d3*t*t*t);
  return p < 0.5 ? -x : x;
}
export function normalCdf101(x: number): number {
  return 0.5 * (1 + Math.tanh(Math.sqrt(2/Math.PI)*(x+0.044715*x*x*x)));
}
export function twoProportionZ101(cConv: number, cN: number, tConv: number, tN: number): number {
  if (cN<=0||tN<=0) return 0;
  const p1=cConv/cN, p2=tConv/tN, p=(cConv+tConv)/(cN+tN);
  const se=Math.sqrt(p*(1-p)*(1/cN+1/tN));
  return se===0?0:(p2-p1)/se;
}
export function pValueFromZ101(z: number): number { return 2*(1-normalCdf101(Math.abs(z))); }
export function uplift101(control: number, treatment: number): number {
  if (control===0) return treatment===0?0:Infinity;
  return (treatment-control)/Math.abs(control);
}
export function isSignificant101(pValue: number, alpha=0.05): boolean { return pValue < alpha; }
export function confidenceInterval101(mean: number, stddev: number, n: number, alpha=0.05): [number, number] {
  if (n<=1) return [mean, mean];
  const z=zScore101(1-alpha/2); const se=stddev/Math.sqrt(n);
  return [mean-z*se, mean+z*se];
}
export function sampleSizeForProportion101(baseline: number, mde: number, alpha=0.05, power=0.8): number {
  const zA=zScore101(1-alpha/2), zB=zScore101(power);
  const p1=baseline, p2=baseline*(1+mde), pBar=(p1+p2)/2;
  const num=Math.pow(zA*Math.sqrt(2*pBar*(1-pBar))+zB*Math.sqrt(p1*(1-p1)+p2*(1-p2)),2);
  const den=Math.pow(p2-p1,2);
  return den===0?Infinity:Math.ceil(num/den);
}
export function trafficSplitValid101(weights: number[]): boolean {
  if (!weights.length||weights.some(w=>w<0)) return false;
  const sum=weights.reduce((a,b)=>a+b,0);
  return Math.abs(sum-100)<0.01||Math.abs(sum-1)<0.01;
}
export function normalizeWeights101(weights: number[]): number[] {
  const sum=weights.reduce((a,b)=>a+b,0);
  return sum===0?weights.map(()=>1/weights.length):weights.map(w=>w/sum);
}
export function assignVariantHash101(unitId: string, experimentId: string, weights: number[]): number {
  const n=normalizeWeights101(weights);
  let hash=0; const key=experimentId+":"+unitId;
  for (let i=0;i<key.length;i++){ hash=((hash<<5)-hash)+key.charCodeAt(i); hash|=0; }
  const bucket=Math.abs(hash)%10000/10000;
  let c=0;
  for (let i=0;i<n.length;i++){ c+=n[i]; if(bucket<c) return i; }
  return n.length-1;
}
export function summarizeResults101(results: ExperimentResult[]) {
  const sig=results.filter(r=>r.significant);
  const uplifts=results.map(r=>r.uplift??0).filter(Number.isFinite);
  const avg=uplifts.length?uplifts.reduce((a,b)=>a+b,0)/uplifts.length:0;
  let best: ExperimentResult|null=null;
  for (const r of results) if (!best||(r.uplift??-Infinity)>(best.uplift??-Infinity)) best=r;
  return { significantCount: sig.length, avgUplift: avg, bestVariantId: best?.variantId??null };
}
