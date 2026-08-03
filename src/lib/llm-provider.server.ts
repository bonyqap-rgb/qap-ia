import { AI_DEFAULT_MODEL } from "@/lib/ai-config";

/**
 * Seleção do provedor de LLM usado na geração de respostas.
 *
 * O backend RAG (`/health` → `"groq":"connected"`) gera com Groq, mas a geração
 * restrita a documento acontece aqui, no servidor da aplicação. Antes ela era
 * fixa no Gemini, o que causava HTTP 401 quando a chave configurada não era uma
 * API Key do Google AI Studio.
 *
 * Agora há seleção explícita, na ordem:
 *   1. Groq          — GROQ_API_KEY (+ GROQ_CHAT_MODEL), alinhado ao backend.
 *   2. Gemini        — GEMINI_API_KEY em formato do AI Studio (prefixo `AIza`).
 *   3. Lovable AI    — LOVABLE_API_KEY, sempre disponível no projeto.
 *
 * Chaves nunca saem do servidor e nunca são logadas.
 */

export type LlmProviderName = "groq" | "gemini" | "lovable";

export type LlmMessage = { role: "user" | "assistant"; content: string };

export type LlmSelection = {
  provider: LlmProviderName;
  model: string;
  /** Motivo da escolha, para diagnóstico nos logs (sem segredos). */
  reason: string;
};

export type LlmDiagnostics = {
  selected: LlmSelection | null;
  candidates: Array<{ provider: LlmProviderName; available: boolean; note: string }>;
};

const GROQ_DEFAULT_MODEL = "llama-3.3-70b-versatile";
const LOVABLE_DEFAULT_MODEL = "google/gemini-3.6-flash";

/** Uma API Key do Google AI Studio começa com `AIza`; OAuth/outras chaves não. */
function isAiStudioKey(key: string | undefined): boolean {
  return typeof key === "string" && key.startsWith("AIza");
}

/** Provedores disponíveis e qual foi escolhido, sem expor segredos. */
export function inspectLlmProviders(): LlmDiagnostics {
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const lovableKey = process.env.LOVABLE_API_KEY;

  const candidates: LlmDiagnostics["candidates"] = [
    {
      provider: "groq",
      available: Boolean(groqKey),
      note: groqKey
        ? `GROQ_API_KEY presente; modelo ${process.env.GROQ_CHAT_MODEL ?? GROQ_DEFAULT_MODEL}`
        : "GROQ_API_KEY ausente",
    },
    {
      provider: "gemini",
      available: isAiStudioKey(geminiKey),
      note: !geminiKey
        ? "GEMINI_API_KEY ausente"
        : isAiStudioKey(geminiKey)
          ? `GEMINI_API_KEY em formato AI Studio; modelo ${process.env.GEMINI_MODEL ?? AI_DEFAULT_MODEL}`
          : "GEMINI_API_KEY presente mas fora do formato do AI Studio (não começa com AIza) — Google responde 401 UNAUTHENTICATED",
    },
    {
      provider: "lovable",
      available: Boolean(lovableKey),
      note: lovableKey
        ? `LOVABLE_API_KEY presente; modelo ${LOVABLE_DEFAULT_MODEL}`
        : "LOVABLE_API_KEY ausente",
    },
  ];

  const selected: LlmSelection | null = groqKey
    ? {
        provider: "groq",
        model: process.env.GROQ_CHAT_MODEL ?? GROQ_DEFAULT_MODEL,
        reason: "GROQ_API_KEY configurada (mesmo provedor do backend RAG)",
      }
    : isAiStudioKey(geminiKey)
      ? {
          provider: "gemini",
          model: process.env.GEMINI_MODEL ?? AI_DEFAULT_MODEL,
          reason: "GEMINI_API_KEY válida do Google AI Studio",
        }
      : lovableKey
        ? {
            provider: "lovable",
            model: LOVABLE_DEFAULT_MODEL,
            reason: geminiKey
              ? "GEMINI_API_KEY inválida para o AI Studio; usando Lovable AI"
              : "nenhuma chave de provedor externo; usando Lovable AI",
          }
        : null;

  return { selected, candidates };
}

export type LlmResult = {
  answer: string;
  provider: LlmProviderName;
  model: string;
  status: number;
  rawBody: string;
  finishReason?: string;
  usage?: unknown;
  durationMs: number;
  requestUrl: string;
  payloadBytes: number;
};

export type LlmFailure = {
  stage: "config" | "fetch" | "http" | "parse" | "empty";
  message: string;
  detail: Record<string, unknown>;
  cause?: unknown;
};

/**
 * Chama o provedor selecionado. Nunca engole a exceção: em falha devolve
 * `{ ok: false, failure }` com status, corpo do provedor e stage reais.
 */
export async function generateWithSelectedProvider(input: {
  systemPrompt: string;
  question: string;
  history: LlmMessage[];
}): Promise<{ ok: true; result: LlmResult } | { ok: false; failure: LlmFailure }> {
  const diagnostics = inspectLlmProviders();
  const selected = diagnostics.selected;

  if (!selected) {
    return {
      ok: false,
      failure: {
        stage: "config",
        message:
          "Nenhum provedor de LLM configurado. Defina GROQ_API_KEY (recomendado, igual ao backend RAG) ou uma GEMINI_API_KEY do Google AI Studio.",
        detail: { candidates: diagnostics.candidates },
      },
    };
  }

  const history = input.history.slice(-6);
  const requestUrl =
    selected.provider === "groq"
      ? "https://api.groq.com/openai/v1/chat/completions"
      : selected.provider === "lovable"
        ? "https://ai.gateway.lovable.dev/v1/chat/completions"
        : `https://generativelanguage.googleapis.com/v1beta/models/${selected.model}:generateContent`;

  const payload =
    selected.provider === "gemini"
      ? {
          systemInstruction: { role: "system", parts: [{ text: input.systemPrompt }] },
          contents: [
            ...history.map((m) => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            })),
            { role: "user", parts: [{ text: input.question }] },
          ],
        }
      : {
          model: selected.model,
          messages: [
            { role: "system", content: input.systemPrompt },
            ...history,
            { role: "user", content: input.question },
          ],
        };

  const serialized = JSON.stringify(payload);

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  let url = requestUrl;
  if (selected.provider === "groq") {
    headers.Authorization = `Bearer ${process.env.GROQ_API_KEY}`;
  } else if (selected.provider === "lovable") {
    headers["Lovable-API-Key"] = String(process.env.LOVABLE_API_KEY);
  } else {
    url = `${requestUrl}?key=${process.env.GEMINI_API_KEY}`;
  }

  const baseDetail = {
    provider: selected.provider,
    model: selected.model,
    selectionReason: selected.reason,
    requestUrl,
    payloadBytes: serialized.length,
    historyMessages: history.length,
    candidates: diagnostics.candidates,
  };

  const startedAt = Date.now();
  let response: Response;
  try {
    response = await fetch(url, { method: "POST", headers, body: serialized });
  } catch (cause) {
    return {
      ok: false,
      failure: {
        stage: "fetch",
        message: `Falha de rede ao chamar ${selected.provider}/${selected.model}: ${
          cause instanceof Error ? cause.message : String(cause)
        }`,
        detail: baseDetail,
        cause,
      },
    };
  }

  const rawBody = await response.text();
  const durationMs = Date.now() - startedAt;

  if (!response.ok) {
    return {
      ok: false,
      failure: {
        stage: "http",
        message: `${selected.provider}/${selected.model} respondeu HTTP ${response.status}: ${rawBody.slice(0, 800)}`,
        detail: {
          ...baseDetail,
          status: response.status,
          statusText: response.statusText,
          durationMs,
          providerBody: rawBody.slice(0, 4000),
        },
      },
    };
  }

  let json: Record<string, unknown>;
  try {
    json = JSON.parse(rawBody) as Record<string, unknown>;
  } catch (cause) {
    return {
      ok: false,
      failure: {
        stage: "parse",
        message: `Resposta não-JSON de ${selected.provider}/${selected.model}: ${rawBody.slice(0, 800)}`,
        detail: { ...baseDetail, durationMs, providerBody: rawBody.slice(0, 4000) },
        cause,
      },
    };
  }

  let answer = "";
  let finishReason: string | undefined;
  if (selected.provider === "gemini") {
    const candidate = (
      json as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
          finishReason?: string;
        }>;
      }
    ).candidates?.[0];
    answer = (candidate?.content?.parts ?? [])
      .map((p) => p.text ?? "")
      .join("")
      .trim();
    finishReason = candidate?.finishReason;
  } else {
    const choice = (
      json as { choices?: Array<{ message?: { content?: string }; finish_reason?: string }> }
    ).choices?.[0];
    answer = (choice?.message?.content ?? "").trim();
    finishReason = choice?.finish_reason;
  }

  if (!answer) {
    return {
      ok: false,
      failure: {
        stage: "empty",
        message: `${selected.provider}/${selected.model} retornou resposta vazia (finishReason=${finishReason ?? "desconhecido"}).`,
        detail: { ...baseDetail, durationMs, finishReason, providerBody: rawBody.slice(0, 4000) },
      },
    };
  }

  return {
    ok: true,
    result: {
      answer,
      provider: selected.provider,
      model: selected.model,
      status: response.status,
      rawBody,
      finishReason,
      usage:
        (json as { usage?: unknown; usageMetadata?: unknown }).usage ??
        (json as { usageMetadata?: unknown }).usageMetadata,
      durationMs,
      requestUrl,
      payloadBytes: serialized.length,
    },
  };
}
