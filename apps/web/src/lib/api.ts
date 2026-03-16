import { supabase } from "./supabase";

const API_BASE = import.meta.env.VITE_API_URL;


type FetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

async function fetchWithAuth(endpoint: string, options: FetchOptions = {}) {
  // Get session
  const { data: { session } } = await supabase.auth.getSession();

  // Build headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add authorization header if session exists
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  // Handle potential double slashes and ensure proper path construction
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}/api${path}`;
  
  const fetchOptions: RequestInit = {
    method: options.method || "GET",
    headers,
    credentials: "include", // Important: send cookies with request
    body: options.body,
  };

  const response = await fetch(url, fetchOptions);

  // Handle 401 - let React Query / ProtectedRoute handle the redirect.
  // Do NOT call signOut() or window.location here — a transient 401 during
  // token refresh would wipe the session and force a login loop.
  if (response.status === 401) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Unauthorized");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  get: <T = any>(endpoint: string) => fetchWithAuth(endpoint, { method: "GET" }) as Promise<T>,
  post: <T = any>(endpoint: string, body?: unknown, useAuth = true) =>
    (useAuth ? fetchWithAuth : fetch)(endpoint, { method: "POST", body: JSON.stringify(body) }) as Promise<T>,
  patch: <T = any>(endpoint: string, body?: unknown) =>
    fetchWithAuth(endpoint, { method: "PATCH", body: JSON.stringify(body) }) as Promise<T>,
  put: <T = any>(endpoint: string, body?: unknown) =>
    fetchWithAuth(endpoint, { method: "PUT", body: JSON.stringify(body) }) as Promise<T>,
  delete: <T = any>(endpoint: string) => fetchWithAuth(endpoint, { method: "DELETE" }) as Promise<T>,
};
