import type {
  ApiDocument,
  DocumentStatistics,
  HealthResponse,
  IndexingHistoryItem,
  MetricsResponse,
} from "@/types/api";
import { mockDocuments } from "@/lib/mock-data";

/**
 * Dados de demonstração usados apenas quando a API REST não está acessível
 * (ex.: preview sem o backend local em execução). A UI sinaliza esse modo.
 */

export const fallbackDocuments: ApiDocument[] = mockDocuments.map((d) => ({
  id: d.id,
  name: d.name,
  category: d.category,
  size: d.size,
  pages: d.pages,
  chunks: d.chunks,
  status: d.status,
  uploadedAt: d.uploadedAt,
  updatedAt: d.uploadedAt,
  uploadedBy: d.uploadedBy,
}));

export const fallbackStatistics: DocumentStatistics = {
  totalDocuments: fallbackDocuments.length,
  indexedDocuments: fallbackDocuments.filter((d) => d.status === "concluído").length,
  pendingDocuments: fallbackDocuments.filter(
    (d) => d.status === "aguardando" || d.status === "indexando",
  ).length,
  failedDocuments: fallbackDocuments.filter((d) => d.status === "erro").length,
  totalChunks: fallbackDocuments.reduce((acc, d) => acc + (d.chunks ?? 0), 0),
  totalPages: fallbackDocuments.reduce((acc, d) => acc + (d.pages ?? 0), 0),
  lastIndexedAt: "2026-07-28T14:32:00.000Z",
  averageIndexingSeconds: 42,
};

export const fallbackHealth: HealthResponse = {
  status: "offline",
  version: "—",
  services: {
    api: { status: "offline", detail: "Sem conexão com a API" },
    database: { status: "offline", detail: "Aguardando backend" },
    ai: { status: "offline", detail: "Aguardando backend" },
    vector: { status: "offline", detail: "Aguardando backend" },
  },
};

export const fallbackMetrics: MetricsResponse = {
  requestsLast24h: 0,
  averageLatencyMs: 0,
  p95LatencyMs: 0,
  errorRate: 0,
  recentErrors: [],
};

export const fallbackIndexingHistory: IndexingHistoryItem[] = fallbackDocuments
  .slice(0, 5)
  .map((d, i) => ({
    id: `hist-${i + 1}`,
    documentId: d.id,
    documentName: d.name,
    startedAt: `${d.uploadedAt}T09:0${i}:00.000Z`,
    finishedAt: `${d.uploadedAt}T09:0${i + 1}:00.000Z`,
    durationSeconds: 38 + i * 7,
    status: d.status,
    chunks: d.chunks,
  }));
