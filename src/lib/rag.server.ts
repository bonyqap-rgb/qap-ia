import { API_BASE_URL } from "@/services/api-client";
import { fixMojibake } from "@/lib/text-encoding";
import { AI_DEFAULT_MODEL, AI_SYSTEM_PROMPT } from "@/lib/ai-config";
import {
  chunkInScope,
  detectDocumentScope,
  formatDocumentKey,
  type DetectedScope,
} from "@/lib/rag-scope";

export type RagSource = {
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

export type RagChatPayload = {
  answer: string;
  conversationId?: string;
  model?: string;
  confidence?: number;
  latencyMs?: number;
  sources: RagSource[];
  resultsCount: number;
  scopedTo?: string[];
  metadata?: { searchTime?: string; generationTime?: string; totalTime?: string };
};

export type HistoryMessage = { role: "user" | "assistant"; content: string };

/** Documentos indexados (GET /documents), com id e nome real. */
export async function fetchDocumentList(): Promise<Array<{ id?: string; name?: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];
    const raw = (await response.json()) as unknown;
    const list = Array.isArray(raw)
      ? raw
      : ((raw as { documents?: unknown[]; data?: unknown[] })?.documents ??
        (raw as { data?: unknown[] })?.data ??
        []);
    return (list as Array<Record<string, unknown>>).map((item) => {
      const name = item?.title ?? item?.filename ?? item?.name;
      return {
        id: typeof item?.id === "string" ? item.id : undefined,
        name: typeof name === "string" ? fixMojibake(name) : undefined,
      };
    });
  } catch {
    return [];
  }
}

/** Nomes reais dos documentos indexados, por id. */
export async function fetchDocumentNames(): Promise<Map<string, string>> {
  const names = new Map<string, string>();
  for (const doc of await fetchDocumentList()) {
    if (doc.id && doc.name) names.set(doc.id, doc.name);
  }
  return names;
}

export function normalizeSources(
  rawSources: RagSource[],
  names: Map<string, string>,
): RagSource[] {
  return rawSources.map((s) => {
    const name =
      s.documentName ?? s.title ?? s.filename ?? (s.documentId ? names.get(s.documentId) : undefined);
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
  });
}

/**
 * POST /search — recuperação vetorial crua.
 *
 * Quando há documento citado, os ids vão no corpo (documentId/documentIds/
 * filter) para que o backend possa restringir a busca vetorial na origem.
 * Campos extras são ignorados por backends que ainda não os suportam, e o
 * escopo continua garantido pela filtragem aplicada aqui.
 */
export async function searchChunks(
  query: string,
  limit: number,
  documentIds: string[] = [],
): Promise<RagSource[]> {
  const body: Record<string, unknown> = { query, limit };
  if (documentIds.length) {
    body.documentId = documentIds[0];
    body.document_id = documentIds[0];
    body.documentIds = documentIds;
    body.document_ids = documentIds;
    body.filter = {
      documentId: documentIds.length === 1 ? documentIds[0] : documentIds,
      document_id: documentIds.length === 1 ? documentIds[0] : documentIds,
    };
  }
  const response = await fetch(`${API_BASE_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`RAG /search [${response.status}]: ${text.slice(0, 300)}`);
  let parsed: { results?: RagSource[] } | RagSource[];
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Resposta inválida da API RAG.");
  }
  return Array.isArray(parsed) ? parsed : (parsed?.results ?? []);
}

/** POST /chat — recuperação + geração do backend, sobre toda a base. */
export async function backendChat(input: {
  question: string;
  conversationId?: string;
  history: HistoryMessage[];
}): Promise<
  Partial<RagChatPayload> & { response?: string; citations?: RagSource[] }
> {
  const body: Record<string, unknown> = { question: input.question };
  if (input.conversationId) body.conversationId = input.conversationId;
  if (input.history.length) body.history = input.history;

  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`RAG /chat [${response.status}]: ${text.slice(0, 300)}`);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Resposta inválida da API RAG.");
  }
}

/** Erro com detalhe técnico real da geração restrita (nunca genérico). */
export class ScopedGenerationError extends Error {
  constructor(
    message: string,
    readonly detail: Record<string, unknown>,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "ScopedGenerationError";
  }
}

/**
 * Geração restrita ao contexto informado (documento citado pelo usuário).
 * Usada apenas quando há escopo detectado; caso contrário o /chat responde.
 *
 * Toda falha é logada com stack trace e detalhe do provedor, e propagada
 * como ScopedGenerationError — nunca convertida em `null` silencioso.
 */
export async function answerFromChunks(input: {
  question: string;
  chunks: RagSource[];
  scopeNames: string[];
  history: HistoryMessage[];
}): Promise<{ answer: string; model?: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? AI_DEFAULT_MODEL;
  const scope = input.scopeNames.join(", ");

  if (!apiKey) {
    const error = new ScopedGenerationError("GEMINI_API_KEY ausente no servidor.", {
      stage: "config",
      model,
      scope,
    });
    console.error("[QAP IA][scoped] GEMINI_API_KEY ausente", error.detail, error.stack);
    throw error;
  }

  const context = input.chunks
    .map((c, i) => {
      const name = c.documentName ?? c.filename ?? "Documento indexado";
      const page = c.page != null ? ` (p. ${c.page})` : "";
      return `[${i + 1}] ${name}${page}\n${(c.snippet ?? c.text ?? "").slice(0, 2500)}`;
    })
    .join("\n\n");

  const scopeInstruction = `Restrição de escopo documental (prioridade máxima):
- O usuário citou explicitamente: ${scope}.
- Responda EXCLUSIVAMENTE com base nos trechos fornecidos abaixo, que pertencem a esse(s) documento(s).
- Nunca utilize artigos, dispositivos ou numerações de outros documentos.
- Se existirem artigos com o mesmo número em outros documentos, ignore-os.
- Se os trechos fornecidos não contiverem a informação, diga explicitamente que o documento citado não traz essa informação nos trechos recuperados, sem substituir por outro documento.
- Ao citar, indique sempre o nome do documento de origem.

Trechos recuperados:
${context}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const payload = {
    systemInstruction: {
      role: "system",
      parts: [{ text: `${AI_SYSTEM_PROMPT}\n\n${scopeInstruction}` }],
    },
    contents: [
      ...input.history.slice(-6).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: input.question }] },
    ],
  };
  const serializedPayload = JSON.stringify(payload);

  // Diagnóstico do que efetivamente vai ao provedor (sem a chave).
  console.info("[QAP IA][scoped] payload", {
    model,
    url,
    scope,
    chunksUsed: input.chunks.length,
    chunkIds: input.chunks.map((c) => c.chunkId ?? c.chunkIndex),
    contextChars: context.length,
    systemChars: AI_SYSTEM_PROMPT.length + scopeInstruction.length,
    payloadBytes: serializedPayload.length,
    historyMessages: Math.min(input.history.length, 6),
    question: input.question,
    payloadPreview: serializedPayload.slice(0, 4000),
  });

  let response: Response;
  const startedAt = Date.now();
  try {
    response = await fetch(`${url}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: serializedPayload,
    });
  } catch (cause) {
    const error = new ScopedGenerationError(
      `Falha de rede ao chamar ${model}: ${cause instanceof Error ? cause.message : String(cause)}`,
      { stage: "fetch", model, url, scope, contextChars: context.length },
      { cause },
    );
    console.error("[QAP IA][scoped] erro de rede", error.detail, cause);
    throw error;
  }

  const rawBody = await response.text();

  if (!response.ok) {
    const error = new ScopedGenerationError(
      `Gemini ${model} respondeu HTTP ${response.status}: ${rawBody.slice(0, 800)}`,
      {
        stage: "http",
        model,
        url,
        scope,
        status: response.status,
        statusText: response.statusText,
        durationMs: Date.now() - startedAt,
        contextChars: context.length,
        chunksUsed: input.chunks.length,
        providerBody: rawBody.slice(0, 4000),
      },
    );
    console.error("[QAP IA][scoped] provedor retornou erro", error.detail, error.stack);
    throw error;
  }

  let json: {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
      finishReason?: string;
      safetyRatings?: unknown;
    }>;
    promptFeedback?: unknown;
    usageMetadata?: unknown;
  };
  try {
    json = JSON.parse(rawBody);
  } catch (cause) {
    const error = new ScopedGenerationError(
      `Resposta não-JSON do ${model}: ${rawBody.slice(0, 800)}`,
      { stage: "parse", model, url, scope, providerBody: rawBody.slice(0, 4000) },
      { cause },
    );
    console.error("[QAP IA][scoped] resposta inválida", error.detail, cause);
    throw error;
  }

  const answer =
    json?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("")
      .trim() ?? "";

  console.info("[QAP IA][scoped] resposta do provedor", {
    model,
    scope,
    durationMs: Date.now() - startedAt,
    answerChars: answer.length,
    finishReason: json?.candidates?.[0]?.finishReason,
    usageMetadata: json?.usageMetadata,
    promptFeedback: json?.promptFeedback,
  });

  if (!answer) {
    const error = new ScopedGenerationError(
      `Gemini ${model} retornou resposta vazia (finishReason=${json?.candidates?.[0]?.finishReason ?? "desconhecido"}).`,
      {
        stage: "empty",
        model,
        url,
        scope,
        finishReason: json?.candidates?.[0]?.finishReason,
        safetyRatings: json?.candidates?.[0]?.safetyRatings,
        promptFeedback: json?.promptFeedback,
        providerBody: rawBody.slice(0, 4000),
      },
    );
    console.error("[QAP IA][scoped] resposta vazia", error.detail, error.stack);
    throw error;
  }

  return { answer, model };
}

/** Número mínimo de trechos do documento citado para responder só com ele. */
const MIN_SCOPED_CHUNKS = 2;

/**
 * Orquestra a consulta RAG com escopo documental.
 *
 * 1. Detecta documentos citados na pergunta.
 * 2. Havendo citação, recupera via /search e
 *    mantém apenas os chunks daquele documento; se houver o mínimo, gera a
 *    resposta restrita a eles.
 * 3. Sem citação, segue o fluxo original do /chat. Com citação sem contexto
 *    suficiente, falha de forma fechada e nunca consulta outro documento.
 */
export async function runScopedRagChat(input: {
  question: string;
  conversationId?: string;
  history: HistoryMessage[];
}): Promise<RagChatPayload> {
  const documents = await fetchDocumentList();
  const scope: DetectedScope = detectDocumentScope(input.question, documents);
  const scopeNames = scope.documents
    .map((d) => d.name)
    .filter((n): n is string => Boolean(n));

  const requested = scope.keys.map(formatDocumentKey).join(", ");

  if (scope.keys.length) {
    const scopeIds = scope.documents
      .map((d) => d.id)
      .filter((id): id is string => Boolean(id));

    // Documento citado, mas não resolvido no catálogo: não execute uma busca
    // global, pois ela poderia trazer conteúdo de outro documento.
    if (!scopeIds.length) {
      return {
        answer: `Não foram encontrados trechos suficientes do documento ${requested} para responder com segurança.`,
        sources: [],
        resultsCount: 0,
        scopedTo: scope.keys.map(formatDocumentKey),
      };
    }

    // Busca vetorial restrita ao documento citado — sem fallback para outros.
    const raw = await searchChunks(input.question, 30, scopeIds);
    const names = await fetchDocumentNames();
    const scoped = normalizeSources(raw, names).filter((c) => chunkInScope(c, scope));

    if (scoped.length < MIN_SCOPED_CHUNKS) {
      return {
        answer: `Não foram encontrados trechos suficientes do documento ${requested} para responder com segurança.`,
        sources: scoped,
        resultsCount: scoped.length,
        scopedTo: scopeNames.length ? scopeNames : scope.keys.map(formatDocumentKey),
      };
    }

    const generated = await answerFromChunks({
      question: input.question,
      chunks: scoped.slice(0, 12),
      scopeNames: scopeNames.length ? scopeNames : scope.keys.map(formatDocumentKey),
      history: input.history,
    });

    if (!generated) {
      throw new Error(
        `Não foi possível gerar a resposta restrita a ${requested}. Verifique a configuração do modelo de IA.`,
      );
    }

    return {
      answer: generated.answer,
      model: generated.model,
      sources: scoped.slice(0, 12),
      resultsCount: scoped.length,
      scopedTo: scopeNames.length ? scopeNames : scope.keys.map(formatDocumentKey),
    };
  }

  // Somente sem documento citado: fluxo original do backend sobre toda a base.
  const parsed = await backendChat(input);
  const rawSources = parsed.sources ?? parsed.citations ?? [];
  const names = rawSources.some((s) => !s.filename && !s.documentName && !s.title)
    ? await fetchDocumentNames()
    : new Map<string, string>();
  const sources = normalizeSources(rawSources, names);

  const answer = parsed.answer ?? parsed.response ?? "";

  return {
    answer,
    conversationId: parsed.conversationId,
    model: parsed.model,
    confidence: parsed.confidence,
    latencyMs: parsed.latencyMs,
    resultsCount: rawSources.length,
    sources,
    scopedTo: scopeNames.length ? scopeNames : undefined,
    metadata: parsed.metadata
      ? {
          searchTime: parsed.metadata.searchTime,
          generationTime: parsed.metadata.generationTime,
          totalTime: parsed.metadata.totalTime,
        }
      : undefined,
  };
}

/** Busca semântica restrita ao documento citado na consulta, quando houver. */
export async function runScopedRagSearch(input: {
  query: string;
  limit?: number;
}): Promise<RagSource[]> {
  const documents = await fetchDocumentList();
  const scope = detectDocumentScope(input.query, documents);
  const scopeIds = scope.documents.map((d) => d.id).filter((id): id is string => Boolean(id));
  const scoped = scope.keys.length > 0;

  // Falha fechada: uma referência explícita não resolvida jamais vira busca
  // global. Isso evita recuperar um artigo homônimo de outro documento.
  if (scoped && !scopeIds.length) return [];

  const results = await searchChunks(
    input.query,
    scoped ? Math.max(input.limit ?? 10, 30) : (input.limit ?? 10),
    scoped ? scopeIds : [],
  );
  const needsNames = results.some((r) => !r.filename && !r.documentName && !r.title);
  const names = needsNames ? await fetchDocumentNames() : new Map<string, string>();
  const normalized = normalizeSources(results, names);

  if (!scoped) return normalized;

  // Somente trechos do documento citado — nunca complementa com outros.
  return normalized.filter((r) => chunkInScope(r, scope)).slice(0, input.limit ?? 10);
}
