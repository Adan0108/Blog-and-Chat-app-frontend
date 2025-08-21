import axios from "axios";
import { loadTokens, saveTokens, clearTokens } from "./authTokens";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

// Main client (has interceptors)
export const axiosInstance = axios.create({ baseURL: BASE });

// Naked client for /auth/refresh (no interceptors -> no loops / no stale Authorization)
const axiosBare = axios.create({ baseURL: BASE });

// Allow the store to register a handler we call when auth is invalid (refresh fails)
let onAuthInvalid = null;
export function setAuthInvalidHandler(fn) {
  onAuthInvalid = fn;
}

// ---- Request interceptor: add headers if present
axiosInstance.interceptors.request.use((config) => {
  const t = loadTokens();
  if (t?.accessToken) config.headers["authorization"] = `Bearer ${t.accessToken}`;
  if (t?.userId != null) config.headers["x-client-id"] = t.userId;
  return config;
});

// ---- Refresh logic (deduped)
let refreshing = null;

async function refreshTokens() {
  if (!refreshing) {
    const t = loadTokens();
    if (!t?.refreshToken || t?.userId == null) throw new Error("No refresh token");

    refreshing = axiosBare
      .post("/auth/refresh", null, {
        headers: {
          "x-client-id": t.userId,
          "x-rtoken-id": t.refreshToken,
        },
      })
      .then((res) => {
        const tokens = res.data?.tokens;
        const userId = res.data?.userId ?? t.userId;
        if (!tokens?.accessToken || !tokens?.refreshToken) throw new Error("Bad refresh response");
        saveTokens({ userId, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
        return tokens.accessToken;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

// ---- Response interceptor: on 401 try refresh once, else hard-logout
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const path = original?.url ?? "";
    const isAuthRoute =
      path.includes("/auth/login") ||
      path.includes("/auth/refresh") ||
      path.includes("/auth/signup");

    if (error?.response?.status === 401 && !original?._retry && !isAuthRoute) {
      try {
        original._retry = true;
        await refreshTokens();

        // Re-attach fresh headers for the retry
        const t = loadTokens();
        original.headers = { ...(original.headers || {}) };
        if (t?.accessToken) original.headers["authorization"] = `Bearer ${t.accessToken}`;
        if (t?.userId != null) original.headers["x-client-id"] = t.userId;

        return axiosInstance(original);
      } catch {
        // Refresh failed -> tokens invalid/expired -> force logout
        clearTokens();
        if (onAuthInvalid) onAuthInvalid(); // let the store null authUser immediately
      }
    }
    return Promise.reject(error);
  }
);
