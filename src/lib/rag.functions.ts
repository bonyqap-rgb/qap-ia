import { createServerFn } from "@tanstack/react-start";

import { API_BASE_URL } from "@/services/api-client";
import { fixMojibake } from "@/lib/text-encoding";

type RagSource = {
  documentId?: string;
  filename?: string;
  documentName?: string;
  title?: string;
  chunkId?: string;
  chunkIndex?: number;
  page?: number;
  score?: number;
  text?: string;
  snippet?: string;
};

type RagChatPayload = {
  answer: string;
  conversationId?: string;
  model?: string;
  confidence?: number;
  latencyMs?: number;
  sources: RagSource[];
  resultsCount: number;
  metadata?: { searchTime?: string; generationTime?: string; totalTime?: string };
};

/** Nomes reais dos documentos indexados, por id (GET /documents). */
async function fetchDocumentNames(): Promise<Map<string, string>> {
  const names = new Map<string, string>();
  try {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return names;
    const raw = (await response.json()) as unknown;
    const list = Array.isArray(raw)
      ? raw
      : ((raw as { documents?: unknown[]; data?: unknown[] })?.documents ??
        (raw as { data?: unknown[] })?.data ??
        []);
    for (const item of list as Array<Record<string, unknown>>) {
      const id = item?.id;
      const name = item?.title ?? item?.filename ?? item?.name;
      if (typeof id === "string" && typeof name === "string") {
        names.set(id, fixMojibake(name));
      }
    }
  } catch {
    // Sem a lista, os nomes ficam com o que o próprio /chat devolver.
  }
  return names;
}

/**
 * Proxy server-side para o endpoint /chat da API QAP RAG.
 *
 * O backend só libera CORS para a origem de produção, o que fazia o chat
 * falhar (e cair no fallback sem contexto) em outras origens. Chamando do
 * servidor, a consulta RAG sempre alcança o backend e as fontes dos
 * documentos indexados chegam à UI.
 *
 * Contrato conferido contra a API real: POST /chat aceita apenas
 * `{ question, conversationId?, history? }` — não existem parâmetros de
 * documentId, knowledgeBaseId, tenantId ou organizationId; a recuperação é
 * feita sobre toda a base indexada.
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
  .handler(async ({ data }): Promise<RagChatPayload> => {
    // Somente os campos aceitos pelo contrato do backend.
    const body: Record<string, unknown> = { question: data.question };
    if (data.conversationId) body.conversationId = data.conversationId;
    if (data.history.length) body.history = data.history;

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(`RAG /chat [${response.status}]: ${text.slice(0, 300)}`);
    }

    let parsed: Partial<RagChatPayload> & { response?: string; citations?: RagSource[] };
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("Resposta inválida da API RAG.");
    }

    const rawSources = parsed.sources ?? parsed.citations ?? [];
    const names = rawSources.some((s) => !s.filename && !s.documentName && !s.title)
      ? await fetchDocumentNames()
      : new Map<string, string>();

    return {
      answer: parsed.answer ?? parsed.response ?? "",
      conversationId: parsed.conversationId,
      model: parsed.model,
      confidence: parsed.confidence,
      latencyMs: parsed.latencyMs,
      resultsCount: rawSources.length,
      sources: rawSources.map((s) => {
        const name = s.documentName ?? s.title ?? s.filename ?? (s.documentId ? names.get(s.documentId) : undefined);
        return {
          documentId: s.documentId,
          filename: s.filename ? fixMojibake(s.filename) : undefined,
          documentName: name ? fixMojibake(name) : undefined,
          chunkId: s.chunkId,
          chunkIndex: s.chunkIndex,
          page: s.page,
          score: s.score,
          snippet: s.snippet ?? s.text,
        };
      }),
      metadata: parsed.metadata
        ? {
            searchTime: parsed.metadata.searchTime,
            generationTime: parsed.metadata.generationTime,
            totalTime: parsed.metadata.totalTime,
          }
        : undefined,
    };
  });

/**
 * Proxy server-side para POST /search.
 *
 * O backend devolve `{ query, results: [{ documentId, chunkIndex, score, text }] }`
 * sem o nome do documento — resolvido aqui via GET /documents.
 */
export const ragSearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const value = input as { query?: unknown; limit?: unknown };
    const query = typeof value?.query === "string" ? value.query.trim() : "";
    if (!query) throw new Error("Consulta vazia.");
    return {
      query,
      limit: typeof value?.limit === "number" && Number.isFinite(value.limit) ? value.limit : undefined,
    };
  })
  .handler(async ({ data }) => {
    const body: Record<string, unknown> = { query: data.query };
    if (data.limit) body.limit = data.limit;

    const response = await fetch(`${API_BASE_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(`RAG /search [${response.status}]: ${text.slice(0, 300)}`);
    }

    let parsed: { results?: RagSource[] } | RagSource[];
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("Resposta inválida da API RAG.");
    }

    const results = Array.isArray(parsed) ? parsed : (parsed?.results ?? []);
    const names = results.some((r) => !r.filename && !r.documentName && !r.title)
      ? await fetchDocumentNames()
      : new Map<string, string>();

    return results.map((r) => {
      const name = r.documentName ?? r.title ?? r.filename ?? (r.documentId ? names.get(r.documentId) : undefined);
      return {
        documentId: r.documentId,
        documentName: name ? fixMojibake(name) : undefined,
        chunkId: r.chunkId,
        chunkIndex: r.chunkIndex,
        page: r.page,
        score: r.score,
        snippet: r.snippet ?? r.text,
      };
    });
  });
