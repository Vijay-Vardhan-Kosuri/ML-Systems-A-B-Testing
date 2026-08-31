
import type { PaginatedResponse, ListQueryParams } from "@/shared/types";
import { apiGet, apiPost } from "./apiClient";

export interface FlagsItem01 {
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
const store: FlagsItem01[] = [];

function ensure(): void {
  if (store.length) return;
  for (let i = 1; i <= 25; i++) {
    store.push({
      id: "flags-01-" + String(i).padStart(4, "0"),
      name: "Flags item " + i,
      status: i % 4 === 0 ? "draft" : "active",
      experimentId: "exp-00" + ((i % 5) + 1),
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {},
    });
  }
}

export async function fetchFlagsList01(params?: ListQueryParams): Promise<PaginatedResponse<FlagsItem01>> {
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
  return apiGet(`/flags`, params as any);
}

export async function createFlags01(input: Partial<FlagsItem01>): Promise<FlagsItem01> {
  if (USE_MOCK) {
    ensure();
    const item: FlagsItem01 = {
      id: "flags-01-" + crypto.randomUUID().slice(0, 8),
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
  return apiPost(`/flags`, input);
}
