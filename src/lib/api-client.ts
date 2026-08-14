import { ApiEnvelope } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

const ACCESS_KEY = "helpdesk_access_token";
const REFRESH_KEY = "helpdesk_refresh_token";

export const tokenStore = {
  getAccess: () => (typeof window === "undefined" ? null : localStorage.getItem(ACCESS_KEY)),
  getRefresh: () => (typeof window === "undefined" ? null : localStorage.getItem(REFRESH_KEY)),
  set: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export class ApiError extends Error {
  status: number;
  details?: unknown;
code?: string;
  constructor(message: string, status: number, details?: unknown, code?: string) {
    super(message);
    this.status = status;
    this.details = details;
    this.code = code;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return null;

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) {
    tokenStore.clear();
    return null;
  }
  const json: ApiEnvelope<{ accessToken: string; refreshToken: string }> = await res.json();
  tokenStore.set(json.data.accessToken, json.data.refreshToken);
  return json.data.accessToken;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  skipAuth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}, isRetry = false): Promise<T> {
  const url = new URL(`${API_URL}${path}`);
  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (!options.skipAuth) {
    const token = tokenStore.getAccess();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401 && !options.skipAuth && !isRetry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request<T>(path, options, true);
    }
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(json.message || "Request failed", res.status, json.details, json.code);
  }

  return json as T;
}

export const apiClient = {
  get: <T>(path: string, query?: RequestOptions["query"]) =>
    request<ApiEnvelope<T>>(path, { method: "GET", query }),
  post: <T>(path: string, body?: unknown, skipAuth = false) =>
    request<ApiEnvelope<T>>(path, { method: "POST", body, skipAuth }),
  patch: <T>(path: string, body?: unknown) => request<ApiEnvelope<T>>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<ApiEnvelope<T>>(path, { method: "DELETE" }),
};
