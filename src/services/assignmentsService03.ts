
import type { PaginatedResponse, ListQueryParams } from "@/shared/types";
import { apiGet, apiPost } from "./apiClient";

export interface AssignmentsItem03 {
  id: string;
  name: string;
  status: string;
  experimentId?: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
  [key: string]: unknown;
}

const USE_MOCK = true;
const store: AssignmentsItem03[] = [];

function ensure(): void {
  if (store.length) return;
  for (let i = 1; i <= 25; i++) {
    store.push({
      id: "assignments-03-" + String(i).padStart(4, "0"),
      name: "Assignments item " + i,
      status: i % 4 === 0 ? "draft" : "active",
      experimentId: "exp-00" + ((i % 5) + 1),
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {},
    });
  }
}

export async function fetchAssignmentsList03(params?: ListQueryParams): Promise<PaginatedResponse<AssignmentsItem03>> {
  if (USE_MOCK) {
    ensure();
    let data = [...store];
    if (params?.search) {
      const q = params.search.toLowerCase();
      data = data.filter((x) => x.name.toLowerCase().includes(q));
    }
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const start = (page - 1) * pageSize;
    return {
      data: data.slice(start, start + pageSize),
      page, pageSize, totalItems: data.length,
      totalPages: Math.ceil(data.length / pageSize) || 1,
      hasNext: start + pageSize < data.length, hasPrev: page > 1,
    };
  }
  return apiGet(`/assignments`, params as any);
}

export async function createAssignments03(input: Partial<AssignmentsItem03>): Promise<AssignmentsItem03> {
  if (USE_MOCK) {
    ensure();
    const item: AssignmentsItem03 = {
      id: "assignments-03-" + crypto.randomUUID().slice(0, 8),
      name: input.name || "New item",
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {},
      ...input,
    };
    store.unshift(item);
    return item;
  }
  return apiPost(`/assignments`, input);
}
