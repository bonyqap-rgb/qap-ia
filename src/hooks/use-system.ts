import { useQuery } from "@tanstack/react-query";

import { systemService } from "@/services/system.service";
import { ApiError } from "@/services/api-client";
import { fallbackHealth, fallbackMetrics } from "@/lib/api-fallback";
import type { HealthResponse, MetricsResponse, ReadyResponse } from "@/types/api";

export const systemKeys = {
  health: ["system", "health"] as const,
  ready: ["system", "ready"] as const,
  metrics: ["system", "metrics"] as const,
};

export function useHealth() {
  const query = useQuery({
    queryKey: systemKeys.health,
    queryFn: ({ signal }) => systemService.health(signal),
    retry: false,
    refetchInterval: 20_000,
  });

  const data: HealthResponse = query.data ?? fallbackHealth;
  return {
    data,
    isLoading: query.isLoading,
    isDemo: !query.data,
    error: query.error instanceof ApiError ? query.error : null,
    refetch: () => void query.refetch(),
  };
}

export function useReady() {
  const query = useQuery({
    queryKey: systemKeys.ready,
    queryFn: ({ signal }) => systemService.ready(signal),
    retry: false,
    refetchInterval: 30_000,
  });

  const data: ReadyResponse = query.data ?? { ready: false };
  return { data, isLoading: query.isLoading, isDemo: !query.data };
}

export function useMetrics() {
  const query = useQuery({
    queryKey: systemKeys.metrics,
    queryFn: ({ signal }) => systemService.metrics(signal),
    retry: false,
    refetchInterval: 30_000,
  });

  const data: MetricsResponse = query.data ?? fallbackMetrics;
  return { data, isLoading: query.isLoading, isDemo: !query.data };
}
