import { API_BASE_URL } from "@/services/api-client";
import { fixMojibake } from "@/lib/text-encoding";
import { AI_SYSTEM_PROMPT } from "@/lib/ai-config";
import { generateWithSelectedProvider, inspectLlmProviders } from "@/lib/llm-provider.server";
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

/** Catálogo de apoio com os principais documentos da Base Legal. */
const FALLBACK_DOCUMENTS: Array<{ id: string; name: string }> = [
  { id: "cpm", name: "Código Penal Militar - CPM (Decreto-Lei nº 1.001/1969)" },
  { id: "cppm", name: "Código de Processo Penal Militar - CPPM (Decreto-Lei nº 1.002/1969)" },
  { id: "cf88", name: "Constituição da República Federativa do Brasil de 1988" },
  {
    id: "rdpm",
    name: "Regulamento Disciplinar da Polícia Militar - RDPM (Decreto nº 43.648/1998)",
  },
  { id: "risg", name: "Regulamento Interno e dos Serviços Gerais - RISG" },
  { id: "i2pm", name: "Instrução I-2-PM - Procedimentos Operacionais Padrão" },
  { id: "m1pm", name: "Manual M-1-PM" },
  { id: "ctb", name: "Código de Trânsito Brasileiro - CTB (Lei nº 9.503/1997)" },
];

/** Fetch resiliente com retries e timeout configurável. */
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 2,
  timeoutMs = 12_000,
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (response.ok) return response;
      if ([500, 502, 503, 504, 408, 429].includes(response.status) && attempt < retries) {
        await new Promise((r) => setTimeout(r, 300 * 2 ** attempt));
        continue;
      }
      return response;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 300 * 2 ** attempt));
        continue;
      }
    }
  }
  throw lastError ?? new Error("Falha de conexão com a API RAG.");
}

/** Documentos indexados (GET /documents), com id e nome real. Fallback para catálogo oficial em falhas. */
export async function fetchDocumentList(): Promise<Array<{ id?: string; name?: string }>> {
  try {
    const response = await fetchWithRetry(
      `${API_BASE_URL}/documents`,
      {
        headers: { Accept: "application/json" },
      },
      1,
      8000,
    );

    if (!response.ok) return FALLBACK_DOCUMENTS;

    const raw = (await response.json()) as unknown;
    const list = Array.isArray(raw)
      ? raw
      : ((raw as { documents?: unknown[]; data?: unknown[] })?.documents ??
        (raw as { data?: unknown[] })?.data ??
        []);

    const fetched = (list as Array<Record<string, unknown>>)
      .map((item) => {
        const name = item?.title ?? item?.filename ?? item?.name;
        return {
          id: typeof item?.id === "string" ? item.id : undefined,
          name: typeof name === "string" ? fixMojibake(name) : undefined,
        };
      })
      .filter((d) => Boolean(d.name));

    return fetched.length ? fetched : FALLBACK_DOCUMENTS;
  } catch {
    return FALLBACK_DOCUMENTS;
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

export function normalizeSources(rawSources: RagSource[], names: Map<string, string>): RagSource[] {
  return rawSources.map((s) => {
    const name =
      s.documentName ??
      s.title ??
      s.filename ??
      (s.documentId ? names.get(s.documentId) : undefined);
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
 * POST /search — recuperação vetorial.
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

  const response = await fetchWithRetry(
    `${API_BASE_URL}/search`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    },
    2,
    10_000,
  );

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
}): Promise<Partial<RagChatPayload> & { response?: string; citations?: RagSource[] }> {
  const body: Record<string, unknown> = { question: input.question };
  if (input.conversationId) body.conversationId = input.conversationId;
  if (input.history.length) body.history = input.history;

  const response = await fetchWithRetry(
    `${API_BASE_URL}/chat`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    },
    2,
    12_000,
  );

  const text = await response.text();
  if (!response.ok) throw new Error(`RAG /chat [${response.status}]: ${text.slice(0, 300)}`);

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Resposta inválida da API RAG.");
  }
}

/** Erro com detalhe técnico real da geração restrita. */
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

/** Padrões de pedido de transcrição/texto literal de dispositivo. */
const LITERAL_INTENT =
  /\b(?:transcreva|transcri(?:ção|cao)|texto\s+(?:integral|literal|d[oa]\s+art)|conte[uú]do\s+d[oa]\s+art|o\s+que\s+diz|qual\s+(?:(?:é|e)\s+)?o\s+(?:texto|conte[uú]do)|reproduz|cite\s+o\s+artigo|copie)/i;

/** Padrões que indicam pedido analítico. */
const ANALYTICAL_INTENT =
  /\b(expli|resum|interpret|compar|analis|diferen|exempl|apliq|aplica(?:ção|cao|r)|significa|entenda)\b/i;

/** Referência a artigo/dispositivo legal numerado. */
const ARTICLE_REF =
  /\bart(?:igo)?s?\.?\s*(?:n[ºo°]?\.?\s*)?\d+|\bartigos?\b|\binciso\b|\bpar[aá]grafo\b/i;

export function isLiteralArticleRequest(question: string): boolean {
  const q = question.trim();
  if (!q) return false;
  if (ANALYTICAL_INTENT.test(q)) return false;
  return ARTICLE_REF.test(q) && LITERAL_INTENT.test(q);
}

export async function runDirectBackendChat(input: {
  question: string;
  conversationId?: string;
  history: HistoryMessage[];
}): Promise<RagChatPayload> {
  try {
    const parsed = await backendChat(input);
    const rawSources = parsed.sources ?? parsed.citations ?? [];
    const names = rawSources.some((s) => !s.filename && !s.documentName && !s.title)
      ? await fetchDocumentNames()
      : new Map<string, string>();
    const sources = normalizeSources(rawSources, names);

    return {
      answer: parsed.answer ?? parsed.response ?? "",
      conversationId: parsed.conversationId,
      model: parsed.model,
      confidence: parsed.confidence,
      latencyMs: parsed.latencyMs,
      resultsCount: rawSources.length,
      sources,
      metadata: parsed.metadata
        ? {
            searchTime: parsed.metadata.searchTime,
            generationTime: parsed.metadata.generationTime,
            totalTime: parsed.metadata.totalTime,
          }
        : undefined,
    };
  } catch (err) {
    console.warn("[QAP IA][direct] backendChat falhou, ativando fallback Gemini", err);
    const generated = await generateWithSelectedProvider({
      systemPrompt: AI_SYSTEM_PROMPT,
      question: input.question,
      history: input.history,
    });
    return {
      answer: generated.ok
        ? generated.result.answer
        : "Não foi possível obter resposta no momento.",
      model: generated.ok ? generated.result.model : undefined,
      sources: [],
      resultsCount: 0,
    };
  }
}

/**
 * Agrupa e expande chunks do mesmo documento para garantir suficiência de contexto (Regra 8).
 * Ordena por chunkIndex / página e busca consultas direcionadas adicionais se necessário.
 */
export async function expandAndSortChunks(
  question: string,
  chunks: RagSource[],
  scopeIds: string[],
): Promise<RagSource[]> {
  const artMatch = question.match(/\bart(?:igo)?\.?\s*(?:n[ºo°]?\.?\s*)?(\d+)/i);
  let additionalChunks: RagSource[] = [];

  if (artMatch && scopeIds.length) {
    const artNum = artMatch[1];
    try {
      const targeted = await searchChunks(`Artigo ${artNum}`, 10, scopeIds);
      additionalChunks = targeted;
    } catch {
      // Ignora erro da busca suplementar
    }
  }

  const all = [...chunks, ...additionalChunks];

  const uniqueMap = new Map<string, RagSource>();
  for (const c of all) {
    const key =
      c.chunkId ??
      `${c.documentId ?? "doc"}-${c.chunkIndex ?? Math.random()}-${(c.snippet ?? c.text ?? "").slice(0, 50)}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, c);
    }
  }

  const result = Array.from(uniqueMap.values());

  result.sort((a, b) => {
    if (a.documentId === b.documentId && a.chunkIndex != null && b.chunkIndex != null) {
      return a.chunkIndex - b.chunkIndex;
    }
    if (a.page != null && b.page != null) {
      return a.page - b.page;
    }
    return (b.score ?? 0) - (a.score ?? 0);
  });

  return result;
}

export async function answerFromChunks(input: {
  question: string;
  chunks: RagSource[];
  scopeNames: string[];
  history: HistoryMessage[];
}): Promise<{ answer: string; model?: string; provider?: string }> {
  const scope = input.scopeNames.join(", ");

  const context = input.chunks
    .map((c, i) => {
      const name = c.documentName ?? c.filename ?? "Documento indexado";
      const page = c.page != null ? ` (p. ${c.page})` : "";
      return `[${i + 1}] ${name}${page}\n${(c.snippet ?? c.text ?? "").slice(0, 3500)}`;
    })
    .join("\n\n");

  const scopeInstruction = `Restrição de escopo documental (prioridade máxima):
- O usuário citou explicitamente: ${scope}.
- Responda EXCLUSIVAMENTE com base nos trechos fornecidos abaixo, que pertencem a esse(s) documento(s).
- Preserve artigo, parágrafo, inciso e alínea EXATAMENTE como aparecem nos trechos recuperados.
- NÃO resuma nem declare 'Transcrição parcial' se o texto integral do dispositivo estiver nos trechos.
- Se os trechos fornecidos não contiverem a informação completa, informe o que consta e o que falta sem inventar trechos ausentes.
- Ao citar, indique sempre o nome do documento de origem.

Trechos recuperados:
${context}`;

  const outcome = await generateWithSelectedProvider({
    systemPrompt: `${AI_SYSTEM_PROMPT}\n\n${scopeInstruction}`,
    question: input.question,
    history: input.history,
  });

  if (!outcome.ok) {
    throw new ScopedGenerationError(outcome.failure.message, {
      ...outcome.failure.detail,
      stage: outcome.failure.stage,
      scope,
    });
  }

  return {
    answer: outcome.result.answer,
    model: outcome.result.model,
    provider: outcome.result.provider,
  };
}

const MIN_SCOPED_CHUNKS = 1;

export async function runScopedRagChat(input: {
  question: string;
  conversationId?: string;
  history: HistoryMessage[];
}): Promise<RagChatPayload> {
  const documents = await fetchDocumentList();
  const scope: DetectedScope = detectDocumentScope(input.question, documents);
  const scopeNames = scope.documents.map((d) => d.name).filter((n): n is string => Boolean(n));

  if (scope.keys.length || scope.documents.length) {
    const scopeIds = scope.documents.map((d) => d.id).filter((id): id is string => Boolean(id));

    let scoped: RagSource[] = [];
    try {
      const raw = await searchChunks(input.question, 30, scopeIds);
      const names = await fetchDocumentNames();
      const normalized = normalizeSources(raw, names);
      scoped = normalized.filter((c) => chunkInScope(c, scope));
    } catch (err) {
      console.warn("[QAP IA][scoped] busca RAG falhou, tentando fallback", err);
    }

    if (scoped.length > 0) {
      scoped = await expandAndSortChunks(input.question, scoped, scopeIds);
    }

    if (scoped.length >= MIN_SCOPED_CHUNKS) {
      try {
        const generated = await answerFromChunks({
          question: input.question,
          chunks: scoped.slice(0, 15),
          scopeNames: scopeNames.length ? scopeNames : scope.keys.map(formatDocumentKey),
          history: input.history,
        });

        return {
          answer: generated.answer,
          model: generated.model,
          sources: scoped.slice(0, 15),
          resultsCount: scoped.length,
          scopedTo: scopeNames.length ? scopeNames : scope.keys.map(formatDocumentKey),
        };
      } catch (genErr) {
        console.error("[QAP IA][scoped] erro na geração a partir de chunks:", genErr);
      }
    }

    try {
      const parsed = await backendChat(input);
      const rawSources = parsed.sources ?? parsed.citations ?? [];
      const names = rawSources.some((s) => !s.filename && !s.documentName && !s.title)
        ? await fetchDocumentNames()
        : new Map<string, string>();
      const sources = normalizeSources(rawSources, names).filter((s) => chunkInScope(s, scope));

      return {
        answer: parsed.answer ?? parsed.response ?? "",
        conversationId: parsed.conversationId,
        model: parsed.model,
        confidence: parsed.confidence,
        latencyMs: parsed.latencyMs,
        resultsCount: sources.length,
        sources,
        scopedTo: scopeNames.length ? scopeNames : scope.keys.map(formatDocumentKey),
      };
    } catch {
      const fallbackGen = await generateWithSelectedProvider({
        systemPrompt: AI_SYSTEM_PROMPT,
        question: input.question,
        history: input.history,
      });

      return {
        answer: fallbackGen.ok
          ? fallbackGen.result.answer
          : "Não foi possível obter resposta no momento. Por favor, tente novamente.",
        model: fallbackGen.ok ? fallbackGen.result.model : undefined,
        sources: [],
        resultsCount: 0,
        scopedTo: scopeNames.length ? scopeNames : scope.keys.map(formatDocumentKey),
      };
    }
  }

  try {
    const parsed = await backendChat(input);
    const rawSources = parsed.sources ?? parsed.citations ?? [];
    const names = rawSources.some((s) => !s.filename && !s.documentName && !s.title)
      ? await fetchDocumentNames()
      : new Map<string, string>();
    const sources = normalizeSources(rawSources, names);

    return {
      answer: parsed.answer ?? parsed.response ?? "",
      conversationId: parsed.conversationId,
      model: parsed.model,
      confidence: parsed.confidence,
      latencyMs: parsed.latencyMs,
      resultsCount: rawSources.length,
      sources,
    };
  } catch {
    const fallbackGen = await generateWithSelectedProvider({
      systemPrompt: AI_SYSTEM_PROMPT,
      question: input.question,
      history: input.history,
    });

    return {
      answer: fallbackGen.ok
        ? fallbackGen.result.answer
        : "Não foi possível conectar à base RAG no momento. Tente novamente em instantes.",
      model: fallbackGen.ok ? fallbackGen.result.model : undefined,
      sources: [],
      resultsCount: 0,
    };
  }
}

export async function runScopedRagSearch(input: {
  query: string;
  limit?: number;
}): Promise<RagSource[]> {
  try {
    const documents = await fetchDocumentList();
    const scope = detectDocumentScope(input.query, documents);
    const scopeIds = scope.documents.map((d) => d.id).filter((id): id is string => Boolean(id));
    const scoped = scope.keys.length > 0 || scope.documents.length > 0;

    const results = await searchChunks(
      input.query,
      scoped ? Math.max(input.limit ?? 10, 30) : (input.limit ?? 10),
      scoped ? scopeIds : [],
    );
    const needsNames = results.some((r) => !r.filename && !r.documentName && !r.title);
    const names = needsNames ? await fetchDocumentNames() : new Map<string, string>();
    const normalized = normalizeSources(results, names);

    if (!scoped) return normalized;

    return normalized.filter((r) => chunkInScope(r, scope)).slice(0, input.limit ?? 10);
  } catch {
    return [];
  }
}
