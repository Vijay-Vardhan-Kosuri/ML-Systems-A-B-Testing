import type { Variant } from "@/shared/types";

export const mockVariants: Variant[] = [
  { id: "var-001a", experimentId: "exp-001", name: "Control (Blue)", type: "control", description: "Current blue CTA", trafficWeight: 50, config: { color: "blue" }, isControl: true, createdAt: "2026-07-20T10:00:00Z" },
  { id: "var-001b", experimentId: "exp-001", name: "Treatment (Green)", type: "treatment", description: "Green CTA", trafficWeight: 50, config: { color: "green" }, isControl: false, createdAt: "2026-07-20T10:00:00Z" },
  { id: "var-002a", experimentId: "exp-002", name: "Control (Long)", type: "control", description: "Full 5-step onboarding", trafficWeight: 50, config: { steps: 5 }, isControl: true, createdAt: "2026-08-01T09:00:00Z" },
  { id: "var-002b", experimentId: "exp-002", name: "Treatment (Short)", type: "treatment", description: "3-step onboarding", trafficWeight: 50, config: { steps: 3 }, isControl: false, createdAt: "2026-08-01T09:00:00Z" },
  { id: "var-003a", experimentId: "exp-003", name: "Control (List)", type: "control", description: "List layout", trafficWeight: 50, config: { layout: "list" }, isControl: true, createdAt: "2026-05-20T10:00:00Z" },
  { id: "var-003b", experimentId: "exp-003", name: "Treatment (Columns)", type: "treatment", description: "3-column cards", trafficWeight: 50, config: { layout: "columns" }, isControl: false, createdAt: "2026-05-20T10:00:00Z" },
];
