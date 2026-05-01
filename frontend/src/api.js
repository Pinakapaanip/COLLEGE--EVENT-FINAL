import { fallbackAnalytics, fallbackEvents, fallbackOptions, fallbackParticipants, fallbackResults } from "./fallbackData";

const DEFAULT_API_ORIGIN = "https://college-event-final.onrender.com";

function stripTrailingSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

function normalizeApiBaseUrl(value) {
  const raw = stripTrailingSlash(value || DEFAULT_API_ORIGIN);
  const apiIndex = raw.indexOf("/api");
  if (apiIndex >= 0) return raw.slice(0, apiIndex + 4);
  return raw.endsWith("/api") ? raw : `${raw}/api`;
}

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);
export const API_URL = API_BASE_URL;

const fallbackByEndpoint = {
  "/events": fallbackEvents,
  "/participants": fallbackParticipants,
  "/results": fallbackResults,
  "/analytics": fallbackAnalytics,
  "/options": fallbackOptions
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeEndpoint(path) {
  if (!path) return "/";
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  if (withSlash === "/api") return "";
  return withSlash.startsWith("/api/") ? withSlash.replace(/^\/api/, "") : withSlash;
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      error: `Server returned ${response.status} with invalid JSON`
    };
  }
}

function responseError(payload, response) {
  if (payload?.error) return payload.error;
  if (payload?.message) return payload.message;
  return `Request failed with status ${response.status}`;
}

function parseBody(body) {
  if (!body || typeof body !== "string") return {};
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}

function fallbackResponse(endpoint, lastError, options) {
  const fallback = fallbackByEndpoint[endpoint];
  if (!fallback) {
    return {
      success: false,
      data: null,
      offline: true,
      source: "frontend",
      error: lastError?.message || "Unable to connect to the API"
    };
  }

  if (options.method && options.method !== "GET") {
    const payload = parseBody(options.body);
    return {
      success: true,
      data: { id: Date.now(), ...payload },
      offline: true,
      source: "frontend-demo",
      error: `API unavailable: ${lastError?.message || "Unable to connect"}`
    };
  }

  return {
    success: true,
    data: typeof fallback === "function" ? fallback() : fallback,
    offline: true,
    source: "frontend-demo",
    error: `API unavailable: ${lastError?.message || "Unable to connect"}`
  };
}

export async function apiRequest(path, options = {}) {
  const endpoint = normalizeEndpoint(path);
  const method = options.method || "GET";
  const attempts = method === "GET" ? 3 : 1;
  let lastError = null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        method,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        }
      });
      const payload = await parseResponse(response);

      if (!response.ok || payload?.success === false) {
        return {
          success: false,
          data: payload?.data ?? null,
          offline: false,
          source: payload?.source || "server",
          error: responseError(payload, response)
        };
      }

      return {
        success: payload?.success ?? true,
        data: payload?.data ?? payload,
        offline: false,
        source: payload?.source || "server",
        error: ""
      };
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) await delay(600 * (attempt + 1));
    }
  }

  return fallbackResponse(endpoint, lastError, { ...options, method });
}
