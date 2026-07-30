import { api } from "./api-client";
import type { ChatRequest, ChatResponse, SearchRequest, SearchResult } from "@/types/api";

/** Serviço de chat RAG e busca semântica. */
export const chatService = {
  ask: (payload: ChatRequest, signal?: AbortSignal) =>
    api.post<ChatResponse>("/chat", payload, { signal, timeoutMs: 60_000 }),

  search: (payload: SearchRequest, signal?: AbortSignal) =>
    api.post<SearchResult[]>("/search", payload, { signal, timeoutMs: 30_000 }),
};
