import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { documentsService } from "@/services/documents.service";
import { ApiError } from "@/services/api-client";
import type { ApiDocument, DocumentStatistics, IndexingHistoryItem } from "@/types/api";

export const documentKeys = {
  all: ["documents"] as const,
  list: () => [...documentKeys.all, "list"] as const,
  statistics: () => [...documentKeys.all, "statistics"] as const,
  history: () => ["indexing", "history"] as const,
};

/**
 * Resultado padrão dos hooks de dados.
 *
 * `data` é sempre o retorno real da API. Quando a requisição falha, `data`
 * fica `undefined` — nenhum dado é inventado — e a tela deve renderizar o
 * estado de erro correspondente.
 */
export type ApiData<T> = {
  data: T | undefined;
  isLoading: boolean;
  /** true quando a API respondeu com erro ou está inacessível. */
  isUnavailable: boolean;
  error: ApiError | null;
  refetch: () => void;
};

function toApiError(error: unknown): ApiError | null {
  if (error instanceof ApiError) return error;
  if (error instanceof Error) return new ApiError(error.message, 0, "");
  return null;
}

export function useDocuments(): ApiData<ApiDocument[]> {
  const query = useQuery({
    queryKey: documentKeys.list(),
    queryFn: ({ signal }) => documentsService.list(signal),
    retry: false,
    staleTime: 15_000,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isUnavailable: query.isError,
    error: toApiError(query.error),
    refetch: () => void query.refetch(),
  };
}

export function useDocumentStatistics(): ApiData<DocumentStatistics> {
  const query = useQuery({
    queryKey: documentKeys.statistics(),
    queryFn: ({ signal }) => documentsService.statistics(signal),
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

export function useIndexingHistory(): ApiData<IndexingHistoryItem[]> {
  const query = useQuery({
    queryKey: documentKeys.history(),
    queryFn: ({ signal }) => documentsService.indexingHistory(signal),
    retry: false,
    staleTime: 30_000,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isUnavailable: query.isError,
    error: toApiError(query.error),
    refetch: () => void query.refetch(),
  };
}

export function useDocumentMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: documentKeys.all });
    void queryClient.invalidateQueries({ queryKey: documentKeys.history() });
  };

  const remove = useMutation({
    mutationFn: (id: string) => documentsService.remove(id),
    onSuccess: () => {
      toast.success("Documento removido da base.");
      invalidate();
    },
    onError: (error: unknown) =>
      toast.error(
        error instanceof ApiError ? error.message : "Não foi possível remover o documento.",
      ),
  });

  const reindex = useMutation({
    mutationFn: (id: string) => documentsService.reindex(id),
    onSuccess: () => {
      toast.success("Reindexação solicitada.");
      invalidate();
    },
    onError: (error: unknown) =>
      toast.error(
        error instanceof ApiError ? error.message : "Não foi possível reindexar o documento.",
      ),
  });

  const upload = useMutation({
    mutationFn: ({ file, category }: { file: File; category?: string }) =>
      documentsService.upload(file, category),
    onSuccess: (_data, variables) => {
      toast.success(`"${variables.file.name}" enviado para indexação.`);
      invalidate();
    },
    onError: (error: unknown) =>
      toast.error(error instanceof ApiError ? error.message : "Falha ao enviar o documento."),
  });

  return { remove, reindex, upload };
}
