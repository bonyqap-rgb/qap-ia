import { api } from "./api-client";
import type {
  ApiDocument,
  DocumentStatistics,
  DocumentStatus,
  IndexingHistoryItem,
  SearchRequest,
  SearchResult,
  UploadResult,
} from "@/types/api";
import { chatService } from "./chat.service";

/**
 * Contrato real do backend QAP RAG para documentos:
 * { id, title, filename, category, language, fileSize, totalPages,
 *   processingStatus: "pending" | "processing" | "completed" | "failed",
 *   totalChunks?, createdAt, updatedAt }
 *
 * A normalização abaixo apenas traduz esses campos para o modelo usado nas
 * telas — nenhum dado é inventado.
 */

type BackendDocument = {
  id?: string;
  title?: string;
  filename?: string;
  file_name?: string;
  name?: string;
  category?: string;
  language?: string;
  fileSize?: number;
  file_size?: number;
  totalPages?: number;
  pages?: number;
  totalChunks?: number;
  chunks?: number;
  processingStatus?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  uploadedBy?: string;
  error?: string | null;
};

const STATUS_MAP: Record<string, DocumentStatus> = {
  completed: "concluído",
  complete: "concluído",
  indexed: "concluído",
  success: "concluído",
  processing: "indexando",
  indexing: "indexando",
  pending: "aguardando",
  queued: "aguardando",
  waiting: "aguardando",
  failed: "erro",
  error: "erro",
};

function toStatus(value: unknown): DocumentStatus {
  const key = String(value ?? "").trim().toLowerCase();
  return STATUS_MAP[key] ?? (key === "" ? "aguardando" : (key as DocumentStatus));
}

function formatSize(bytes: number | undefined): string | undefined {
  if (!bytes || !Number.isFinite(bytes)) return undefined;
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value < 10 && unit > 0 ? 1 : 0)} ${units[unit]}`;
}

function normalizeDocument(raw: BackendDocument, index: number): ApiDocument {
  const sizeBytes = raw.fileSize ?? raw.file_size;
  return {
    id: String(raw.id ?? `doc-${index}`),
    name: String(raw.title ?? raw.filename ?? raw.file_name ?? raw.name ?? "Documento sem nome"),
    category: raw.category,
    size: formatSize(sizeBytes),
    sizeBytes,
    pages: raw.totalPages ?? raw.pages,
    chunks: raw.totalChunks ?? raw.chunks,
    status: toStatus(raw.processingStatus ?? raw.status),
    uploadedAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    uploadedBy: raw.uploadedBy,
    error: raw.error ?? null,
  };
}

type BackendDocumentList = BackendDocument[] | { documents?: BackendDocument[]; data?: BackendDocument[] };

function normalizeList(raw: BackendDocumentList): ApiDocument[] {
  const list = Array.isArray(raw) ? raw : (raw?.documents ?? raw?.data ?? []);
  return list.map((item, index) => normalizeDocument(item ?? {}, index));
}

type BackendStatistics = {
  totalDocuments?: number;
  indexedDocuments?: number;
  pendingDocuments?: number;
  failedDocuments?: number;
  totalChunks?: number;
  totalPages?: number;
  totalSize?: number;
  lastIndexedAt?: string | null;
};

function normalizeStatistics(raw: BackendStatistics): DocumentStatistics {
  const total = raw.totalDocuments ?? 0;
  const indexed = raw.indexedDocuments ?? 0;
  return {
    totalDocuments: total,
    indexedDocuments: indexed,
    pendingDocuments: raw.pendingDocuments ?? Math.max(total - indexed, 0),
    failedDocuments: raw.failedDocuments,
    totalChunks: raw.totalChunks ?? 0,
    totalPages: raw.totalPages,
    lastIndexedAt: raw.lastIndexedAt ?? null,
  };
}

/** Serviço de documentos — consome os endpoints REST já existentes no backend. */
export const documentsService = {
  list: async (signal?: AbortSignal) =>
    normalizeList(await api.get<BackendDocumentList>("/documents", { signal })),
  detail: async (id: string, signal?: AbortSignal) =>
    normalizeDocument(
      await api.get<BackendDocument>(`/documents/${encodeURIComponent(id)}`, { signal }),
      0,
    ),
  remove: (id: string) => api.del<void>(`/documents/${encodeURIComponent(id)}`),
  reindex: (id: string) =>
    api.post<{ status: string }>(`/documents/${encodeURIComponent(id)}/reindex`),
  statistics: async (signal?: AbortSignal) =>
    normalizeStatistics(await api.get<BackendStatistics>("/documents/statistics", { signal })),
  indexingHistory: (signal?: AbortSignal) =>
    api.get<IndexingHistoryItem[]>("/indexing/history", { signal }),
  upload: (file: File, category?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (category) formData.append("category", category);
    return api.upload<UploadResult>("/upload", formData, { timeoutMs: 120_000 });
  },
  search: (payload: SearchRequest): Promise<SearchResult[]> => chatService.search(payload),
};
