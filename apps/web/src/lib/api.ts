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

  // Handle potential double slashes and ensure proper path construction
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}/api${path}`;
  
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
  get: <T = any>(endpoint: string) => fetchWithAuth(endpoint, { method: "GET" }) as Promise<T>,
  post: <T = any>(endpoint: string, body?: unknown, useAuth = true) =>
    (useAuth ? fetchWithAuth : fetch)(endpoint, { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }) as Promise<T>,
  patch: <T = any>(endpoint: string, body?: unknown) =>
    fetchWithAuth(endpoint, { method: "PATCH", body: JSON.stringify(body) }) as Promise<T>,
  put: <T = any>(endpoint: string, body?: unknown) =>
    fetchWithAuth(endpoint, { method: "PUT", body: JSON.stringify(body) }) as Promise<T>,
  delete: <T = any>(endpoint: string) => fetchWithAuth(endpoint, { method: "DELETE" }) as Promise<T>,
};
