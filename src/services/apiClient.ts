const BASE = import.meta.env.VITE_API_URL || "/api";

export class ApiClientError extends Error {
  constructor(public code: string, message: string, public status: number) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ code: "UNKNOWN", message: res.statusText }));
    throw new ApiClientError(err.code || "UNKNOWN", err.message || res.statusText, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function apiGet<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(BASE + path, window.location.origin);
  if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) url.searchParams.set(k, String(v)); });
  return handle(await fetch(url.toString(), { credentials: "include" }));
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return handle(await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  }));
}
