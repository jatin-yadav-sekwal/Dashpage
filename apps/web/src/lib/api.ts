import { supabase } from "./supabase";

const API_BASE = import.meta.env.VITE_API_URL;

type FetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

async function fetchWithAuth(endpoint: string, options: FetchOptions = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  // Handle potential double slashes
  const url = `${API_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint, { method: "GET" }),
  post: (endpoint: string, body?: unknown) =>
    fetchWithAuth(endpoint, { method: "POST", body: JSON.stringify(body) }),
  patch: (endpoint: string, body?: unknown) =>
    fetchWithAuth(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  put: (endpoint: string, body?: unknown) =>
    fetchWithAuth(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint: string) => fetchWithAuth(endpoint, { method: "DELETE" }),
};
