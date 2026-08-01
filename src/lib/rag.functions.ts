import { createServerFn } from "@tanstack/react-start";

import { API_BASE_URL } from "@/services/api-client";

/**
 * Proxy server-side para o endpoint /chat da API QAP RAG.
 *
 * O backend só libera CORS para a origem de produção, o que fazia o chat
 * falhar (e cair no fallback sem contexto) em qualquer outra origem.
 * Chamando do servidor, a consulta RAG sempre alcança o backend e as
 * fontes dos documentos indexados chegam à UI.
 */
export const ragChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const value = input as { question?: unknown; history?: unknown; conversationId?: unknown };
    const question = typeof value?.question === "string" ? value.question.trim() : "";
    if (!question) throw new Error("Pergunta vazia.");
    return {
      question,
      conversationId: typeof value?.conversationId === "string" ? value.conversationId : undefined,
      history: Array.isArray(value?.history)
        ? (value.history as Array<{ role: "user" | "assistant"; content: string }>).slice(-10)
        : undefined,
    };
  })
  .handler(async ({ data }) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        question: data.question,
        message: data.question,
        conversationId: data.conversationId,
        history: data.history,
      }),
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(`RAG /chat [${response.status}]: ${text.slice(0, 300)}`);
    }

    try {
      return JSON.parse(text) as unknown;
    } catch {
      throw new Error("Resposta inválida da API RAG.");
    }
  });
