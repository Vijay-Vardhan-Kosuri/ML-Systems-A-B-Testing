import type { Experiment, Variant, ExperimentStatus } from "../types";
export function isActive087(exp: Experiment): boolean { return exp.status==="running"; }
export function isEditable087(exp: Experiment): boolean { return exp.status==="draft"||exp.status==="paused"; }
export function canStart087(exp: Experiment, variants: Variant[]): boolean {
  if (exp.status!=="draft"&&exp.status!=="paused") return false;
  if (variants.length<2) return false;
  const hasControl=variants.some(v=>v.isControl||v.type==="control");
  const sum=variants.reduce((s,v)=>s+v.trafficWeight,0);
  return hasControl&&Math.abs(sum-100)<0.5;
}
export function filterByStatus087(exps: Experiment[], status: ExperimentStatus): Experiment[] {
  return exps.filter(e=>e.status===status);
}
export function searchExperiments087(exps: Experiment[], q: string): Experiment[] {
  const query=q.toLowerCase().trim();
  if (!query) return exps;
  return exps.filter(e=>e.name.toLowerCase().includes(query)||e.description.toLowerCase().includes(query)||e.tags.some(t=>t.toLowerCase().includes(query)));
}
export function sortByCreatedDesc087(exps: Experiment[]): Experiment[] {
  return [...exps].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
}
export function countByStatus087(exps: Experiment[]): Record<string, number> {
  const c: Record<string, number>={};
  for (const e of exps) c[e.status]=(c[e.status]||0)+1;
  return c;
}
export function validateExperiment087(exp: Partial<Experiment>): string[] {
  const errors: string[]=[];
  if (!exp.name||exp.name.trim().length<3) errors.push("name_too_short");
  if (!exp.hypothesis||exp.hypothesis.trim().length<10) errors.push("hypothesis_required");
  if (exp.trafficPercent!=null&&(exp.trafficPercent<0||exp.trafficPercent>100)) errors.push("traffic_invalid");
  return errors;
}
export function validateVariants087(variants: Variant[]): string[] {
  const errors: string[]=[];
  if (variants.length<2) errors.push("need_two_variants");
  const controls=variants.filter(v=>v.isControl||v.type==="control");
  if (controls.length!==1) errors.push("need_one_control");
  const sum=variants.reduce((s,v)=>s+v.trafficWeight,0);
  if (Math.abs(sum-100)>0.5) errors.push("weights_sum");
  return errors;
}
export function paginate087<T>(items: T[], page: number, size: number): T[] {
  return items.slice((page-1)*size, page*size);
}
