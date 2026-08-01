import { createServerFn } from "@tanstack/react-start";

import {
  runScopedRagChat,
  runScopedRagSearch,
  type RagChatPayload,
  type RagSource,
} from "@/lib/rag.server";

/**
 * Proxy server-side para a API QAP RAG.
 *
 * Além de evitar o bloqueio de CORS do backend, a recuperação agora respeita
 * o documento citado na pergunta (ex.: "Artigo 31 do I-2-PM"), evitando
 * respostas que misturam artigos de documentos diferentes. Ver `rag.server.ts`.
 */
export const ragChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const value = input as { question?: unknown; history?: unknown; conversationId?: unknown };
    const question = typeof value?.question === "string" ? value.question.trim() : "";
    if (!question) throw new Error("Pergunta vazia.");
    const history = Array.isArray(value?.history)
      ? (value.history as Array<{ role?: unknown; content?: unknown }>)
          .filter(
            (m) =>
              (m?.role === "user" || m?.role === "assistant") &&
              typeof m?.content === "string" &&
              m.content.trim().length > 0 &&
              !/^\s*[⚠️❌]/u.test(m.content),
          )
          .slice(-8)
          .map((m) => ({ role: m.role as "user" | "assistant", content: String(m.content) }))
      : [];
    return {
      question,
      conversationId: typeof value?.conversationId === "string" ? value.conversationId : undefined,
      history,
    };
  })
  .handler(async ({ data }): Promise<RagChatPayload> => runScopedRagChat(data));

/** Proxy server-side para POST /search, priorizando o documento citado. */
export const ragSearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const value = input as { query?: unknown; limit?: unknown };
    const query = typeof value?.query === "string" ? value.query.trim() : "";
    if (!query) throw new Error("Consulta vazia.");
    return {
      query,
      limit:
        typeof value?.limit === "number" && Number.isFinite(value.limit) ? value.limit : undefined,
    };
  })
  .handler(async ({ data }): Promise<RagSource[]> => runScopedRagSearch(data));
