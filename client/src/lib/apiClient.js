// Central fetch wrapper for the AxioGo backend.
//
// All service files should route requests through here rather than calling
// fetch() directly, so the base URL, auth header, and error shape stay
// consistent in one place (per api.md's {success, error} envelope).

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

let accessToken = null;
let refreshToken = null;
let onUnauthorized = null;

export function setTokens(tokens) {
  accessToken = tokens?.access_token ?? null;
  refreshToken = tokens?.refresh_token ?? null;
  if (accessToken) {
    // Session-scoped only (cleared when the tab closes) — a pragmatic
    // middle ground until the backend offers httpOnly-cookie sessions.
    sessionStorage.setItem('axiogo_refresh_token', refreshToken || '');
  } else {
    sessionStorage.removeItem('axiogo_refresh_token');
  }
}

export function getStoredRefreshToken() {
  return sessionStorage.getItem('axiogo_refresh_token');
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  sessionStorage.removeItem('axiogo_refresh_token');
}

export function setOnUnauthorized(handler) {
  onUnauthorized = handler;
}

class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request(path, { method = 'GET', body, auth = true, skipRefreshRetry = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Access token expired mid-session: try one silent refresh, then retry once.
  if (response.status === 401 && auth && !skipRefreshRetry && getStoredRefreshToken()) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request(path, { method, body, auth, skipRefreshRetry: true });
    }
    clearTokens();
    onUnauthorized?.();
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // no body
  }

  if (!response.ok) {
    const message = payload?.error?.message || response.statusText || 'Request failed';
    throw new ApiError(message, response.status, payload?.error?.code, payload?.error?.details);
  }

  return payload;
}

async function tryRefresh() {
  const stored = getStoredRefreshToken();
  if (!stored) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: stored }),
    });
    if (!res.ok) return false;
    const tokens = await res.json();
    setTokens(tokens);
    return true;
  } catch {
    return false;
  }
}

export const apiClient = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};

export { ApiError };
