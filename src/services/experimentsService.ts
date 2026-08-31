import type { Experiment, PaginatedResponse, ListQueryParams } from "@/shared/types";
import { mockExperiments } from "@/mocks/experiments";

export async function fetchExperiments(params?: ListQueryParams): Promise<PaginatedResponse<Experiment>> {
  let data = [...mockExperiments];
  if (params?.search) {
    const q = params.search.toLowerCase();
    data = data.filter((e) => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
  }
  if (params?.status) data = data.filter((e) => e.status === params.status);
  data.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const start = (page - 1) * pageSize;
  const slice = data.slice(start, start + pageSize);
  return {
    data: slice, page, pageSize, totalItems: data.length,
    totalPages: Math.ceil(data.length / pageSize) || 1,
    hasNext: start + pageSize < data.length, hasPrev: page > 1,
  };
}

export async function fetchExperiment(id: string): Promise<Experiment> {
  const exp = mockExperiments.find((e) => e.id === id);
  if (!exp) throw new Error("Experiment not found");
  return exp;
}
