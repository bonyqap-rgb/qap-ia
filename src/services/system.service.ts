import { api } from "./api-client";
import type { HealthResponse, MetricsResponse, ReadyResponse } from "@/types/api";

/** Serviço de observabilidade: health, ready e métricas do backend. */
export const systemService = {
  health: (signal?: AbortSignal) =>
    api.get<HealthResponse>("/health", { signal, timeoutMs: 8_000 }),
  ready: (signal?: AbortSignal) =>
    api.get<ReadyResponse>("/ready", { signal, timeoutMs: 8_000 }),
  metrics: (signal?: AbortSignal) => api.get<MetricsResponse>("/metrics", { signal }),
};
