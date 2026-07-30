import { useQuery } from "@tanstack/react-query";

import { systemService } from "@/services/system.service";
import { ApiError } from "@/services/api-client";
import type { HealthResponse, MetricsResponse, ReadyResponse } from "@/types/api";
import type { ApiData } from "@/hooks/use-documents";

export const systemKeys = {
  health: ["system", "health"] as const,
  ready: ["system", "ready"] as const,
  metrics: ["system", "metrics"] as const,
};

function toApiError(error: unknown): ApiError | null {
  if (error instanceof ApiError) return error;
  if (error instanceof Error) return new ApiError(error.message, 0, "");
  return null;
}

export function useHealth(): ApiData<HealthResponse> {
  const query = useQuery({
    queryKey: systemKeys.health,
    queryFn: ({ signal }) => systemService.health(signal),
    retry: false,
    refetchInterval: 20_000,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isUnavailable: query.isError,
    error: toApiError(query.error),
    refetch: () => void query.refetch(),
  };
}

export function useReady(): ApiData<ReadyResponse> {
  const query = useQuery({
    queryKey: systemKeys.ready,
    queryFn: ({ signal }) => systemService.ready(signal),
    retry: false,
    refetchInterval: 30_000,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isUnavailable: query.isError,
    error: toApiError(query.error),
    refetch: () => void query.refetch(),
  };
}

export function useMetrics(): ApiData<MetricsResponse> {
  const query = useQuery({
    queryKey: systemKeys.metrics,
    queryFn: ({ signal }) => systemService.metrics(signal),
    retry: false,
    refetchInterval: 30_000,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isUnavailable: query.isError,
    error: toApiError(query.error),
    refetch: () => void query.refetch(),
  };
}
