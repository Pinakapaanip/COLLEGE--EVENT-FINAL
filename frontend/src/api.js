import { fallbackAnalytics, fallbackEvents, fallbackOptions, fallbackParticipants, fallbackResults } from "./fallbackData";

const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:10000").replace(/\/$/, "");

const fallbackByPath = {
  "/api/events": fallbackEvents,
  "/api/participants": fallbackParticipants,
  "/api/results": fallbackResults,
  "/api/analytics": fallbackAnalytics,
  "/api/options": fallbackOptions
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function apiRequest(path, options = {}) {
  const attempts = options.method && options.method !== "GET" ? 2 : 4;
  let lastError = null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(`${API_URL}${path}`, {
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        ...options
      });
      const json = await response.json().catch(() => ({ success: false, error: "Server returned invalid JSON" }));
      if (!response.ok || json.success === false) {
        return { ...json, offline: false, source: json.source || "server" };
      }
      return { ...json, offline: false };
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) await delay(700 * (attempt + 1));
    }
  }

  const fallback = fallbackByPath[path];
  if (fallback) {
    if (options.method && options.method !== "GET") {
      const payload = options.body ? JSON.parse(options.body) : {};
      return {
        success: true,
        data: { id: Date.now(), ...payload },
        source: "frontend-demo",
        offline: true,
        error: `API unavailable: ${lastError?.message || "Unable to connect"}`
      };
    }
    return {
      success: true,
      data: typeof fallback === "function" ? fallback() : fallback,
      source: "frontend-demo",
      offline: true,
      error: `API unavailable: ${lastError?.message || "Unable to connect"}`
    };
  }

  throw lastError || new Error("Request failed");
}

export { API_URL };
