/**
 * API client with automatic token refresh.
 * All dashboard pages should use apiFetch() instead of raw fetch() with manual auth headers.
 * 
 * - Automatically adds Authorization header from localStorage
 * - On 401, tries to refresh the token using boba-refresh-token
 * - If refresh also fails, clears tokens and redirects to /auth
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

let refreshPromise: Promise<{ access_token: string; refresh_token: string } | null> | null = null;

async function refreshTokens(): Promise<{ access_token: string; refresh_token: string } | null> {
  const refreshToken = localStorage.getItem("boba-refresh-token");
  if (!refreshToken) return null;

  // Deduplicate concurrent refresh attempts
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!res.ok) {
        // Refresh token is also expired — force re-login
        localStorage.removeItem("boba-token");
        localStorage.removeItem("boba-refresh-token");
        localStorage.removeItem("boba-user");
        window.dispatchEvent(new Event("boba-auth-change"));
        if (typeof window !== "undefined") {
          window.location.href = "/auth?reason=session_expired";
        }
        return null;
      }
      const data = await res.json();
      localStorage.setItem("boba-token", data.access_token);
      localStorage.setItem("boba-refresh-token", data.refresh_token);
      return data;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Drop-in replacement for fetch() that:
 * 1. Auto-adds Authorization header from localStorage
 * 2. On 401, tries to refresh the token and retries once
 * 3. If refresh fails, clears tokens and redirects to /auth
 */
export async function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  const token = localStorage.getItem("boba-token");
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && init?.method && init.method !== "GET" && init.method !== "HEAD") {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...init, headers });

  if (res.status === 401) {
    const newTokens = await refreshTokens();
    if (newTokens) {
      headers.set("Authorization", `Bearer ${newTokens.access_token}`);
      return fetch(url, { ...init, headers });
    }
    // refreshTokens already handles redirect
    return res;
  }

  return res;
}

export { API_BASE };