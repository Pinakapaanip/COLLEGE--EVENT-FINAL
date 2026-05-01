import { fallbackEvents, fallbackOptions, fallbackParticipants, fallbackResults } from "./fallbackData";

export const BASE_URL = String(import.meta.env.VITE_API_URL || "http://127.0.0.1:10000").replace(/\/+$/, "");

const fallbackByResource = {
  events: fallbackEvents,
  participants: fallbackParticipants,
  results: fallbackResults,
  options: fallbackOptions
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseResource(path) {
  return String(path || "")
    .replace(/^\/+/, "")
    .replace(/^api\//, "")
    .split("/")[0];
}

async function parseJson(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, error: `Server returned invalid JSON (${response.status})` };
  }
}

function fallbackResponse(path, options, error) {
  const resource = parseResource(path);
  const data = fallbackByResource[resource];
  const method = options.method || "GET";

  if (method === "DELETE") {
    return {
      success: true,
      data: { id: Number(String(path).split("/").pop()) },
      offline: true,
      source: "mock",
      error: `API unavailable: ${error?.message || "request failed"}`
    };
  }

  if (method === "POST" || method === "PUT") {
    const payload = options.body ? JSON.parse(options.body) : {};
    return {
      success: true,
      data: { id: method === "POST" ? Date.now() : Number(String(path).split("/").pop()), ...payload },
      offline: true,
      source: "mock",
      error: `API unavailable: ${error?.message || "request failed"}`
    };
  }

  return {
    success: true,
    data: typeof data === "function" ? data() : data || [],
    offline: true,
    source: "mock",
    error: `API unavailable: ${error?.message || "request failed"}`
  };
}

export async function apiRequest(path, options = {}) {
  const method = options.method || "GET";
  const attempts = method === "GET" ? 3 : 1;
  const endpoint = String(path).startsWith("/api/") ? path : `/api/${String(path).replace(/^\/+/, "")}`;
  let lastError = null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        method,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        }
      });
      const payload = await parseJson(response);

      if (!response.ok || payload.success === false) {
        return {
          success: false,
          data: payload.data ?? null,
          offline: false,
          source: payload.source || "server",
          error: payload.error || payload.message || `Request failed with status ${response.status}`
        };
      }

      return {
        success: payload.success ?? true,
        data: payload.data ?? payload,
        offline: false,
        source: payload.source || "server",
        error: payload.error || ""
      };
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) await sleep(500 * (attempt + 1));
    }
  }

  return fallbackResponse(endpoint, { ...options, method }, lastError);
}
