import { api } from "./api-client";
import { ragChat } from "@/lib/rag.functions";
import type { Citation, ChatRequest, ChatResponse, SearchRequest, SearchResult } from "@/types/api";

/**
 * Contrato real do backend QAP RAG.
 *
 * POST /chat  → { answer, sources: [{ documentId, filename, chunkIndex, score, text? }], metadata }
 * POST /search → { query, results: [{ documentId, filename?, chunkIndex, score, text }] }
 *
 * O frontend trabalha com `citations` / `SearchResult[]`, então a normalização
 * acontece aqui — sem inventar dados, apenas renomeando os campos existentes.
 */

type BackendSource = {
  documentId?: string;
  documentName?: string;
  filename?: string;
  title?: string;
  chunkId?: string;
  chunkIndex?: number;
  page?: number;
  pageNumber?: number;
  score?: number;
  text?: string;
  snippet?: string;
  content?: string;
};

type BackendChatResponse = {
  answer?: string;
  response?: string;
  conversationId?: string;
  model?: string;
  confidence?: number;
  latencyMs?: number;
  sources?: BackendSource[];
  citations?: BackendSource[];
  metadata?: { searchTime?: string; generationTime?: string; totalTime?: string };
};

type BackendSearchResponse = { query?: string; results?: BackendSource[] } | BackendSource[];

function parseMs(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number.parseFloat(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? Math.round(n) : undefined;
}

function toCitation(source: BackendSource): Citation {
  const documentName =
    source.documentName ?? source.filename ?? source.title ?? "Documento indexado";
  return {
    id: source.chunkId ?? `${source.documentId ?? "doc"}-${source.chunkIndex ?? 0}`,
    documentId: source.documentId,
    documentName,
    page: source.page ?? source.pageNumber,
    chunkId: source.chunkId ?? (source.chunkIndex != null ? String(source.chunkIndex) : undefined),
    score: source.score,
    snippet: source.snippet ?? source.text ?? source.content,
  };
}

function normalizeChat(raw: BackendChatResponse): ChatResponse {
  const sources = raw.sources ?? raw.citations ?? [];
  const citations = sources.map(toCitation);
  const usedDocuments = Array.from(
    new Map(
      citations.map((c) => [c.documentId ?? c.documentName, { id: c.documentId, name: c.documentName }]),
    ).values(),
  );

  return {
    answer: raw.answer ?? raw.response ?? "",
    conversationId: raw.conversationId,
    model: raw.model,
    confidence: raw.confidence,
    latencyMs: raw.latencyMs ?? parseMs(raw.metadata?.totalTime),
    citations,
    usedDocuments,
  };
}

function normalizeSearch(raw: BackendSearchResponse): SearchResult[] {
  const results = Array.isArray(raw) ? raw : (raw?.results ?? []);
  return results.map((item) => ({
    chunkId: item.chunkId ?? (item.chunkIndex != null ? String(item.chunkIndex) : undefined),
    documentId: item.documentId,
    documentName: item.documentName ?? item.filename ?? item.title ?? "Documento indexado",
    page: item.page ?? item.pageNumber,
    score: item.score ?? 0,
    snippet: item.snippet ?? item.text ?? item.content ?? "",
  }));
}

/** Serviço de chat RAG e busca semântica. */
export const chatService = {
  ask: async (payload: ChatRequest): Promise<ChatResponse> => {
    // Proxy server-side: evita o bloqueio de CORS do backend, que fazia a
    // consulta RAG falhar e a UI responder sem contexto documental.
    const raw = await ragChat({
      data: {
        question: payload.question,
        conversationId: payload.conversationId,
        history: payload.history,
      },
    });
    return normalizeChat(raw as BackendChatResponse);
  },

  search: async (payload: SearchRequest, signal?: AbortSignal): Promise<SearchResult[]> => {
    const raw = await api.post<BackendSearchResponse>("/search", payload, {
      signal,
      timeoutMs: 30_000,
    });
    return normalizeSearch(raw ?? []);
  },
};
