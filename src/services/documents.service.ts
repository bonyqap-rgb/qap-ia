import { api } from "./api-client";
import type {
  ApiDocument,
  DocumentStatistics,
  IndexingHistoryItem,
  SearchRequest,
  SearchResult,
  UploadResult,
} from "@/types/api";

/** Serviço de documentos — consome os endpoints REST já existentes no backend. */
export const documentsService = {
  list: (signal?: AbortSignal) => api.get<ApiDocument[]>("/documents", { signal }),
  detail: (id: string, signal?: AbortSignal) =>
    api.get<ApiDocument>(`/documents/${encodeURIComponent(id)}`, { signal }),
  remove: (id: string) => api.del<void>(`/documents/${encodeURIComponent(id)}`),
  reindex: (id: string) =>
    api.post<{ status: string }>(`/documents/${encodeURIComponent(id)}/reindex`),
  statistics: (signal?: AbortSignal) =>
    api.get<DocumentStatistics>("/documents/statistics", { signal }),
  indexingHistory: (signal?: AbortSignal) =>
    api.get<IndexingHistoryItem[]>("/indexing/history", { signal }),
  upload: (file: File, category?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (category) formData.append("category", category);
    return api.upload<UploadResult>("/upload", formData, { timeoutMs: 120_000 });
  },
  search: (payload: SearchRequest) => api.post<SearchResult[]>("/search", payload),
};
