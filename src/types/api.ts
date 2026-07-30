// Modelos de dados da API QAP RAG (backend Express + Supabase pgvector).
// Os campos opcionais existem porque o backend pode evoluir o payload;
// o frontend nunca quebra quando um campo não vem.

export type DocumentStatus =
  | "aguardando"
  | "indexando"
  | "concluído"
  | "erro";

export type ApiDocument = {
  id: string;
  name: string;
  category?: string;
  size?: string;
  sizeBytes?: number;
  pages?: number;
  chunks?: number;
  status: DocumentStatus;
  uploadedAt?: string;
  updatedAt?: string;
  uploadedBy?: string;
  error?: string | null;
};

export type DocumentStatistics = {
  totalDocuments: number;
  indexedDocuments: number;
  pendingDocuments: number;
  failedDocuments?: number;
  totalChunks: number;
  totalPages?: number;
  lastIndexedAt?: string | null;
  averageIndexingSeconds?: number;
};

export type HealthStatus = "online" | "degraded" | "offline";

export type HealthResponse = {
  status: HealthStatus;
  uptimeSeconds?: number;
  version?: string;
  services?: Record<string, { status: HealthStatus; detail?: string; latencyMs?: number }>;
};

export type ReadyResponse = {
  ready: boolean;
  checks?: Record<string, { ok: boolean; detail?: string }>;
};

export type MetricsResponse = {
  requestsTotal?: number;
  requestsLast24h?: number;
  averageLatencyMs?: number;
  p95LatencyMs?: number;
  errorRate?: number;
  tokensUsed?: number;
  embeddingsGenerated?: number;
  recentErrors?: Array<{ at: string; message: string; scope?: string }>;
};

export type IndexingHistoryItem = {
  id: string;
  documentId?: string;
  documentName: string;
  startedAt: string;
  finishedAt?: string | null;
  durationSeconds?: number;
  status: DocumentStatus;
  chunks?: number;
  error?: string | null;
};

export type Citation = {
  id?: string;
  documentId?: string;
  documentName: string;
  page?: number;
  chunkId?: string;
  score?: number;
  snippet?: string;
};

export type ChatRequest = {
  question: string;
  conversationId?: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
};

export type ChatResponse = {
  answer: string;
  conversationId?: string;
  model?: string;
  confidence?: number;
  latencyMs?: number;
  citations?: Citation[];
  usedDocuments?: Array<{ id?: string; name: string }>;
};

export type SearchRequest = {
  query: string;
  limit?: number;
};

export type SearchResult = {
  chunkId?: string;
  documentId?: string;
  documentName: string;
  page?: number;
  score: number;
  snippet: string;
};

export type UploadResult = {
  id: string;
  name: string;
  status: DocumentStatus;
};
