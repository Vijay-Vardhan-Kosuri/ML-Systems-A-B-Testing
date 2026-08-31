
/**
 * Experiment domain helpers 009
 */
import type { Experiment, Variant, ExperimentStatus, Assignment } from "../types";

export function isActive009(exp: Experiment): boolean {
  return exp.status === "running";
}

export function isEditable009(exp: Experiment): boolean {
  return exp.status === "draft" || exp.status === "paused";
}

export function canStart009(exp: Experiment, variants: Variant[]): boolean {
  if (exp.status !== "draft" && exp.status !== "paused") return false;
  if (variants.length < 2) return false;
  const hasControl = variants.some((v) => v.isControl || v.type === "control");
  const weightSum = variants.reduce((s, v) => s + v.trafficWeight, 0);
  return hasControl && Math.abs(weightSum - 100) < 0.5;
}

export function canStop009(exp: Experiment): boolean {
  return exp.status === "running";
}

export function filterByStatus009(exps: Experiment[], status: ExperimentStatus): Experiment[] {
  return exps.filter((e) => e.status === status);
}

export function searchExperiments009(exps: Experiment[], q: string): Experiment[] {
  const query = q.toLowerCase().trim();
  if (!query) return exps;
  return exps.filter(
    (e) =>
      e.name.toLowerCase().includes(query) ||
      e.description.toLowerCase().includes(query) ||
      e.hypothesis.toLowerCase().includes(query) ||
      e.tags.some((t) => t.toLowerCase().includes(query)),
  );
}

export function sortByCreatedDesc009(exps: Experiment[]): Experiment[] {
  return [...exps].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function sortByName009(exps: Experiment[]): Experiment[] {
  return [...exps].sort((a, b) => a.name.localeCompare(b.name));
}

export function groupByStatus009(exps: Experiment[]): Record<string, Experiment[]> {
  const groups: Record<string, Experiment[]> = {};
  for (const e of exps) {
    (groups[e.status] ??= []).push(e);
  }
  return groups;
}

export function countByStatus009(exps: Experiment[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const e of exps) counts[e.status] = (counts[e.status] || 0) + 1;
  return counts;
}

export function validateExperiment009(exp: Partial<Experiment>): string[] {
  const errors: string[] = [];
  if (!exp.name || exp.name.trim().length < 3) errors.push("name_too_short");
  if (!exp.hypothesis || exp.hypothesis.trim().length < 10) errors.push("hypothesis_required");
  if (exp.trafficPercent != null && (exp.trafficPercent < 0 || exp.trafficPercent > 100)) {
    errors.push("traffic_percent_invalid");
  }
  if (exp.minimumDetectableEffect != null && exp.minimumDetectableEffect <= 0) {
    errors.push("mde_must_be_positive");
  }
  if (exp.sampleSizeTarget != null && exp.sampleSizeTarget < 100) {
    errors.push("sample_size_too_small");
  }
  return errors;
}

export function validateVariants009(variants: Variant[]): string[] {
  const errors: string[] = [];
  if (variants.length < 2) errors.push("need_at_least_two_variants");
  const controls = variants.filter((v) => v.isControl || v.type === "control");
  if (controls.length !== 1) errors.push("need_exactly_one_control");
  const sum = variants.reduce((s, v) => s + v.trafficWeight, 0);
  if (Math.abs(sum - 100) > 0.5) errors.push("weights_must_sum_to_100");
  if (variants.some((v) => v.trafficWeight < 0)) errors.push("negative_weight");
  return errors;
}

export function estimateDurationDays009(
  sampleSizeTarget: number,
  dailyTraffic: number,
  trafficPercent: number,
): number {
  if (dailyTraffic <= 0 || trafficPercent <= 0) return Infinity;
  const dailyEligible = dailyTraffic * (trafficPercent / 100);
  return Math.ceil(sampleSizeTarget / dailyEligible);
}

export function assignmentCountByVariant009(assignments: Assignment[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const a of assignments) counts[a.variantId] = (counts[a.variantId] || 0) + 1;
  return counts;
}

export function displayStatus009(status: ExperimentStatus): string {
  const map: Record<ExperimentStatus, string> = {
    draft: "Draft",
    running: "Running",
    paused: "Paused",
    completed: "Completed",
    archived: "Archived",
  };
  return map[status] ?? status;
}

export function statusColor009(status: ExperimentStatus): "default" | "success" | "warning" | "danger" | "info" {
  switch (status) {
    case "running": return "success";
    case "paused": return "warning";
    case "completed": return "info";
    case "archived": return "default";
    default: return "default";
  }
}

export function paginate009<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function mergeExperiment009(base: Experiment, patch: Partial<Experiment>): Experiment {
  return {
    ...base,
    ...patch,
    tags: patch.tags ?? base.tags,
    metadata: { ...base.metadata, ...(patch.metadata ?? {}) },
    updatedAt: new Date().toISOString(),
  };
}
