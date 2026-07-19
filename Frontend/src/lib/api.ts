const LOCAL_API_URL = "http://localhost:5000/api";
const MAX_RETRIES = 6;
const REQUEST_TIMEOUT_MS = 12_000;
const RETRYABLE_STATUS_CODES = new Set([502, 503, 504]);

type ApiFetchInit = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export class ApiRequestError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

function normalizeApiBase(value: string) {
  return value.trim().replace(/\/+$/, "");
}

export function getApiBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
  if (configuredUrl?.trim()) return normalizeApiBase(configuredUrl);

  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_API_URL is required in production.");
  }

  return LOCAL_API_URL;
}

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

function isRetryableError(error: unknown) {
  if (error instanceof ApiRequestError) {
    return error.status ? RETRYABLE_STATUS_CODES.has(error.status) : true;
  }

  if (error instanceof DOMException && error.name === "AbortError") return true;
  return error instanceof TypeError;
}

function retryDelay(attempt: number) {
  const baseDelay = 500 * 2 ** attempt;
  const jitter = Math.floor(Math.random() * 250);
  return Math.min(baseDelay + jitter, 8_000);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiFetch(path: string, init: ApiFetchInit = {}) {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(apiUrl(path), {
        ...init,
        signal: controller.signal
      });

      if (response.ok) return response;

      const error = new ApiRequestError(`API request failed with ${response.status}`, response.status);
      if (!RETRYABLE_STATUS_CODES.has(response.status) || attempt === MAX_RETRIES) {
        throw error;
      }
      lastError = error;
    } catch (error) {
      if (!isRetryableError(error) || attempt === MAX_RETRIES) {
        throw error;
      }
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }

    await sleep(retryDelay(attempt));
  }

  throw lastError instanceof Error ? lastError : new Error("API request failed.");
}
