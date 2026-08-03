import { createServerFn } from "@tanstack/react-start";

import { AI_SYSTEM_PROMPT } from "@/lib/ai-config";
import { generateWithSelectedProvider, inspectLlmProviders } from "@/lib/llm-provider.server";

/**
 * AI Service
 *
 * Ponto único de integração com o provedor de IA. A seleção do provedor
 * (Groq → Gemini AI Studio → Lovable AI) vive em `llm-provider.server.ts`;
 * as chaves permanecem apenas no servidor.
 */
export const sendChatMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    if (
      typeof input !== "object" ||
      input === null ||
      typeof (input as { message?: unknown }).message !== "string"
    ) {
      throw new Error("Mensagem inválida.");
    }
    const { message } = input as { message: string };
    const trimmed = message.trim();
    if (!trimmed) throw new Error("Mensagem vazia.");
    return { message: trimmed };
  })
  .handler(async ({ data }) => {
    const providers = inspectLlmProviders();
    console.info("[QAP IA][chat] provedor selecionado", {
      selectedProvider: providers.selected?.provider,
      selectedModel: providers.selected?.model,
      selectionReason: providers.selected?.reason,
      providerCandidates: providers.candidates,
    });

    if (!providers.selected) {
      return {
        reply: "⚠️ Nenhum provedor de IA configurado (defina GROQ_API_KEY ou GEMINI_API_KEY).",
      };
    }

    const outcome = await generateWithSelectedProvider({
      systemPrompt: AI_SYSTEM_PROMPT,
      question: data.message,
      history: [],
    });

    if (!outcome.ok) {
      console.error(
        `[QAP IA][chat] falha na geração (${outcome.failure.stage})`,
        outcome.failure.detail,
        outcome.failure.cause ?? new Error(outcome.failure.message).stack,
      );
      return { reply: `❌ ${outcome.failure.message}` };
    }

    console.info("[QAP IA][chat] resposta do provedor", {
      provider: outcome.result.provider,
      model: outcome.result.model,
      status: outcome.result.status,
      durationMs: outcome.result.durationMs,
      answerChars: outcome.result.answer.length,
      finishReason: outcome.result.finishReason,
      usage: outcome.result.usage,
    });

    return { reply: outcome.result.answer };
  });
