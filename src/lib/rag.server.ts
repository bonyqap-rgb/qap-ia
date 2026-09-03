import { API_BASE_URL } from "@/services/api-client";
import { fixMojibake } from "@/lib/text-encoding";
import { AI_SYSTEM_PROMPT } from "@/lib/ai-config";
import { generateWithSelectedProvider, inspectLlmProviders } from "@/lib/llm-provider.server";
import {
  chunkInScope,
  detectDocumentScope,
  explicitArticles,
  formatDocumentKey,
  inferPriorityArticles,
  prioritizeByArticles,
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
}): Promise<Partial<RagChatPayload> & { response?: string; citations?: RagSource[] }> {
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

/** Padrões que indicam pedido de transcrição/texto literal de dispositivo. */
const LITERAL_INTENT =
  /\b(?:transcreva|transcri(?:ção|cao)|texto\s+(?:integral|literal|d[oa]\s+art)|conte[uú]do\s+d[oa]\s+art|o\s+que\s+diz|qual\s+(?:(?:é|e)\s+)?o\s+(?:texto|conte[uú]do)|reproduz|cite\s+o\s+artigo|copie)/i;

/** Padrões que indicam pedido analítico (explicação/resumo/comparação). */
const ANALYTICAL_INTENT =
  /\b(expli|resum|interpret|compar|analis|diferen|exempl|apliq|aplica(?:ção|cao|r)|significa|entenda)\b/i;

/** Referência a artigo/dispositivo legal numerado. */
const ARTICLE_REF = /\bart(?:igo)?s?\.?\s*(?:n[ºo°]?\.?\s*)?\d+|\bartigos?\b|\binciso\b|\bpar[aá]grafo\b/i;

/**
 * Detecta pedidos de transcrição literal de dispositivo legal
 * (ex.: "Qual é o conteúdo do artigo 13 do RDPM?").
 *
 * Esses pedidos NÃO passam pela geração própria (answerFromChunks): o backend
 * qap-rag já possui bypass de transcrição literal no ChatService, então eles
 * são encaminhados diretamente ao POST /chat para evitar paráfrases.
 * Pedidos analíticos (explicar/resumir/interpretar/comparar) seguem o fluxo
 * normal de escopo documental.
 */
export function isLiteralArticleRequest(question: string): boolean {
  const q = question.trim();
  if (!q) return false;
  if (ANALYTICAL_INTENT.test(q)) return false;
  return ARTICLE_REF.test(q) && LITERAL_INTENT.test(q);
}

/**
 * Pedido de conteúdo de dispositivo legal, ainda que acompanhado de pedido
 * analítico (ex.: "explique o conteúdo do art. 9º"). Nesses casos o texto legal
 * deve ser preservado com fidelidade, sem paráfrase apresentada como
 * transcrição.
 */
export function wantsLiteralText(question: string): boolean {
  const q = question.trim();
  if (!q) return false;
  return ARTICLE_REF.test(q) && LITERAL_INTENT.test(q);
}

/**
 * Encaminha a pergunta diretamente ao POST /chat do QAP RAG (sem escopo
 * documental nem geração própria), preservando question, conversationId e
 * history. Usado para pedidos de transcrição literal, cujo bypass de
 * transcrição já existe no ChatService do backend.
 */
export async function runDirectBackendChat(input: {
  question: string;
  conversationId?: string;
  history: HistoryMessage[];
}): Promise<RagChatPayload> {
  console.info("[QAP IA][literal] bypass de transcrição literal → POST /chat", {
    question: input.question,
    historyMessages: input.history.length,
    hasConversationId: Boolean(input.conversationId),
  });

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
}

/**
 * Geração restrita ao contexto informado (documento citado pelo usuário).
 * Usada apenas quando há escopo detectado; caso contrário o /chat responde.
 *
 * O provedor não é mais fixo no Gemini: `llm-provider.server.ts` escolhe entre
 * Groq (igual ao backend RAG), Gemini do AI Studio e Lovable AI, conforme as
 * chaves realmente presentes no servidor.
 *
 * Toda falha é logada com stack trace e detalhe do provedor, e propagada
 * como ScopedGenerationError — nunca convertida em `null` silencioso.
 */
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
      return `[${i + 1}] ${name}${page}\n${(c.snippet ?? c.text ?? "").slice(0, 2500)}`;
    })
    .join("\n\n");

  const articles = [...explicitArticles(input.question), ...inferPriorityArticles(input.question)];
  const articleInstruction = articles.length
    ? `\n- Dispositivo(s) central(is) da pergunta: Art. ${articles.join(", Art. ")}. Fundamente a resposta neles e NÃO cite outros artigos que não sejam necessários para responder.`
    : "";

  const literalInstruction = wantsLiteralText(input.question)
    ? `\n\nFidelidade textual (obrigatória):
- A pergunta pede o conteúdo do dispositivo legal: reproduza o texto legal exatamente como consta nos trechos, preservando redação, numeração, incisos, alíneas e pontuação.
- Não parafraseie, não resuma e não reescreva o texto legal apresentado como transcrição.
- Comentários seus, se houver, vêm depois da transcrição e claramente separados.`
    : "";

  const scopeInstruction = `Restrição de escopo documental (prioridade máxima):
- O usuário citou explicitamente: ${scope}.
- Responda EXCLUSIVAMENTE com base nos trechos fornecidos abaixo, que pertencem a esse(s) documento(s).
- Nunca utilize artigos, dispositivos ou numerações de outros documentos.
- Se existirem artigos com o mesmo número em outros documentos, ignore-os.
- Se os trechos fornecidos não contiverem a informação, diga explicitamente que o documento citado não traz essa informação nos trechos recuperados, sem substituir por outro documento.
- Ao citar, indique sempre o nome do documento de origem.${articleInstruction}${literalInstruction}

Trechos recuperados:
${context}`;


  const providers = inspectLlmProviders();

  // Diagnóstico do que efetivamente vai ao provedor (sem a chave).
  console.info("[QAP IA][scoped] provedor e payload", {
    selectedProvider: providers.selected?.provider,
    selectedModel: providers.selected?.model,
    selectionReason: providers.selected?.reason,
    providerCandidates: providers.candidates,
    scope,
    chunksUsed: input.chunks.length,
    chunkIds: input.chunks.map((c) => c.chunkId ?? c.chunkIndex),
    contextChars: context.length,
    systemChars: AI_SYSTEM_PROMPT.length + scopeInstruction.length,
    historyMessages: Math.min(input.history.length, 6),
    question: input.question,
    contextPreview: context.slice(0, 4000),
  });

  const outcome = await generateWithSelectedProvider({
    systemPrompt: `${AI_SYSTEM_PROMPT}\n\n${scopeInstruction}`,
    question: input.question,
    history: input.history,
  });

  if (!outcome.ok) {
    const error = new ScopedGenerationError(outcome.failure.message, {
      ...outcome.failure.detail,
      stage: outcome.failure.stage,
      scope,
      chunksUsed: input.chunks.length,
      contextChars: context.length,
    });
    console.error(
      `[QAP IA][scoped] falha na geração (${outcome.failure.stage})`,
      error.detail,
      outcome.failure.cause ?? error.stack,
    );
    throw error;
  }

  console.info("[QAP IA][scoped] resposta do provedor", {
    provider: outcome.result.provider,
    model: outcome.result.model,
    status: outcome.result.status,
    durationMs: outcome.result.durationMs,
    answerChars: outcome.result.answer.length,
    finishReason: outcome.result.finishReason,
    usage: outcome.result.usage,
  });

  return {
    answer: outcome.result.answer,
    model: outcome.result.model,
    provider: outcome.result.provider,
  };
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
  const scopeNames = scope.documents.map((d) => d.name).filter((n): n is string => Boolean(n));

  const requested = scope.keys.map(formatDocumentKey).join(", ");

  if (scope.keys.length) {
    const scopeIds = scope.documents.map((d) => d.id).filter((id): id is string => Boolean(id));

    // Escopo inferido pelo tema (ex.: crime militar → CPM) sem documento
    // correspondente na base: falha fechada, jamais busca global.
    if (scope.inferred && !scopeIds.length) {
      return {
        answer: `Não há documento indexado correspondente ao ${requested} para responder com base exclusiva nele. Indexe o Código Penal Militar ou cite outro documento explicitamente.`,
        sources: [],
        resultsCount: 0,
        scopedTo: scope.keys.map(formatDocumentKey),
      };
    }

    // Documento citado, mas não resolvido no catálogo: não execute uma busca
    // global, pois ela poderia trazer conteúdo de outro documento.
    // Em vez de retornar erro local, faz fallback para o backendChat.
    if (!scopeIds.length) {
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
        scopedTo: scope.keys.map(formatDocumentKey),
        metadata: parsed.metadata
          ? {
              searchTime: parsed.metadata.searchTime,
              generationTime: parsed.metadata.generationTime,
              totalTime: parsed.metadata.totalTime,
            }
          : undefined,
      };
    }

    // Busca vetorial restrita ao documento citado — sem fallback para outros.
    const raw = await searchChunks(input.question, 30, scopeIds);
    const names = await fetchDocumentNames();
    const inScope = normalizeSources(raw, names).filter((c) => chunkInScope(c, scope));

    // Relevância jurídica: prioriza o(s) dispositivo(s) que efetivamente
    // respondem à pergunta (ex.: Art. 9º para crime militar em tempo de paz) e
    // remove duplicados e trechos cujo único artigo é irrelevante (ex.: Art. 10).
    const priorityArticles = [
      ...explicitArticles(input.question),
      ...inferPriorityArticles(input.question),
    ];
    const scoped = prioritizeByArticles(inScope, priorityArticles);

    console.info("[QAP IA][scoped] recuperação", {
      question: input.question,
      requested,
      scopeIds,
      scopeNames,
      priorityArticles,
      rawChunks: raw.length,
      inScopeChunks: inScope.length,
      scopedChunks: scoped.length,
      scopedContextChars: scoped.reduce((sum, c) => sum + (c.snippet?.length ?? 0), 0),
      topScores: scoped.slice(0, 5).map((c) => c.score),
    });


    // Escopo inferido: nunca complementa com a base global. Havendo ao menos um
    // trecho do CPM, gera com ele; sem trechos, responde de forma fechada.
    if (scope.inferred && !scoped.length) {
      return {
        answer: `Os trechos recuperados de ${scopeNames.length ? scopeNames.join(", ") : requested} não trazem essa informação. Reformule a pergunta ou cite outro documento explicitamente.`,
        sources: [],
        resultsCount: 0,
        scopedTo: scopeNames.length ? scopeNames : scope.keys.map(formatDocumentKey),
      };
    }

    if (!scope.inferred && scoped.length < MIN_SCOPED_CHUNKS) {
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
        scopedTo: scopeNames.length ? scopeNames : scope.keys.map(formatDocumentKey),
        metadata: parsed.metadata
          ? {
              searchTime: parsed.metadata.searchTime,
              generationTime: parsed.metadata.generationTime,
              totalTime: parsed.metadata.totalTime,
            }
          : undefined,
      };
    }

    // Sem catch genérico: erros reais do provedor sobem com stack e detalhe.
    const generated = await answerFromChunks({
      question: input.question,
      chunks: scoped.slice(0, 12),
      scopeNames: scopeNames.length ? scopeNames : scope.keys.map(formatDocumentKey),
      history: input.history,
    });

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
