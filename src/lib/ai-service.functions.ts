import { createServerFn } from "@tanstack/react-start";

import { AI_DEFAULT_MODEL, AI_SYSTEM_PROMPT } from "@/lib/ai-config";

/**
 * AI Service
 *
 * Ponto único de integração com o provedor de IA (Google Gemini).
 * A chave vive apenas no servidor (secret `GEMINI_API_KEY`).
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
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return { reply: "⚠️ Gemini ainda não configurado." };
    }

    const model = process.env.GEMINI_MODEL ?? AI_DEFAULT_MODEL;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              role: "system",
              parts: [{ text: AI_SYSTEM_PROMPT }],
            },
            contents: [{ role: "user", parts: [{ text: data.message }] }],
          }),
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(
          `[QAP IA] Gemini request failed [${response.status}]: ${errorBody}`,
        );
        return {
          reply: `❌ Gemini [${response.status}]: ${errorBody}`,
        };
      }

      const json = (await response.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
        }>;
      };

      const reply =
        json?.candidates?.[0]?.content?.parts
          ?.map((p) => p.text ?? "")
          .join("")
          .trim() ?? "";

      if (!reply) {
        return {
          reply:
            "❌ O Gemini não retornou uma resposta. Tente reformular sua pergunta.",
        };
      }

      return { reply };
    } catch (error) {
      console.error("[QAP IA] Gemini request error:", error);
      return {
        reply:
          "❌ Erro de conexão com o Gemini. Verifique sua rede e tente novamente.",
      };
    }
  });
