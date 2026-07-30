import { api } from "./api-client";
import type { ChatRequest, ChatResponse } from "@/types/api";

/** Serviço de chat RAG. Chama POST /chat do backend existente. */
export const chatService = {
  ask: (payload: ChatRequest, signal?: AbortSignal) =>
    api.post<ChatResponse>("/chat", payload, { signal, timeoutMs: 60_000 }),
};
