/**
 * Camada única de comunicação HTTP com a API QAP RAG.
 * URL base configurável via VITE_API_URL (default: https://qap-rag.onrender.com).
 * Recursos: timeout, retry com backoff, erros tipados e parse seguro.
 */

export const API_BASE_URL = (
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3001"
).replace(/\/$/, "");

export class ApiError extends Error {
  readonly status: number;
  readonly path: string;
  readonly details?: unknown;

  constructor(message: string, status: number, path: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.path = path;
    this.details = details;
  }

  /** true quando a API não pôde ser alcançada (offline, CORS, timeout). */
  get isNetwork() {
    return this.status === 0;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** FormData tem prioridade sobre `body`. */
  formData?: FormData;
  signal?: AbortSignal;
  timeoutMs?: number;
  retries?: number;
  headers?: Record<string, string>;
};

const DEFAULT_TIMEOUT = 20_000;
const RETRYABLE_STATUS = new Set([0, 408, 425, 429, 500, 502, 503, 504]);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function parseBody(response: Response): Promise<unknown> {
  const type = response.headers.get("content-type") ?? "";
  try {
    if (type.includes("application/json")) return await response.json();
    const text = await response.text();
    return text.length ? text : null;
  } catch {
    return null;
  }
}

function messageFrom(payload: unknown, fallback: string) {
  if (typeof payload === "string" && payload.trim()) return payload.slice(0, 300);
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of ["message", "error", "detail"]) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) return value;
    }
  }
  return fallback;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = "GET",
    body,
    formData,
    signal,
    timeoutMs = DEFAULT_TIMEOUT,
    retries = method === "GET" ? 2 : 0,
    headers = {},
  } = options;

  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const onAbort = () => controller.abort();
    signal?.addEventListener("abort", onAbort);

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        signal: controller.signal,
        headers: formData
          ? headers
          : { "Content-Type": "application/json", Accept: "application/json", ...headers },
        body: formData ?? (body === undefined ? undefined : JSON.stringify(body)),
      });

      const payload = await parseBody(response);

      if (!response.ok) {
        const error = new ApiError(
          messageFrom(payload, `Falha na requisição (${response.status})`),
          response.status,
          path,
          payload,
        );
        if (RETRYABLE_STATUS.has(response.status) && attempt < retries) {
          lastError = error;
          await sleep(300 * 2 ** attempt);
          continue;
        }
        throw error;
      }

      return payload as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (signal?.aborted) throw error;

      const aborted = error instanceof DOMException && error.name === "AbortError";
      const apiError = new ApiError(
        aborted
          ? "Tempo limite excedido ao contatar a API."
          : "Não foi possível conectar à API do QAP IA.",
        0,
        path,
        error,
      );
      if (attempt < retries) {
        lastError = apiError;
        await sleep(300 * 2 ** attempt);
        continue;
      }
      throw apiError;
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    }
  }

  throw lastError ?? new ApiError("Falha desconhecida na requisição.", 0, path);
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "POST", body }),
  del: <T>(path: string, options?: RequestOptions) => apiRequest<T>(path, { ...options, method: "DELETE" }),
  upload: <T>(path: string, formData: FormData, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "POST", formData }),
};
