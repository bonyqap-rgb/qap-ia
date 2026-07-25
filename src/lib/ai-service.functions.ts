import { createServerFn } from "@tanstack/react-start";

/**
 * AI Service
 *
 * Ponto único de integração com o provedor de IA (Google Gemini).
 *
 * Para ativar o Gemini futuramente:
 * 1. Adicionar a secret `GEMINI_API_KEY` no projeto.
 * 2. Substituir o bloco marcado abaixo pela chamada à API do Gemini
 *    (ex.: `@google/generative-ai` ou fetch para
 *    `https://generativelanguage.googleapis.com/v1beta/models/...`).
 * 3. Nenhuma outra parte do app precisa ser alterada — o chat já consome
 *    este serviço.
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

    const model = process.env.GEMINI_MODEL ?? "gemini-flash-latest";
    const systemInstruction =
      "Você é o QAP IA, um assistente inteligente para pesquisa jurídica e administrativa voltado a policiais militares no Brasil. Responda de forma clara, objetiva e profissional, em português. Lembre que as respostas têm caráter informativo e devem ser conferidas na legislação oficial.";

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              role: "system",
              parts: [{ text: systemInstruction }],
            },
            contents: [
              { role: "user", parts: [{ text: data.message }] },
            ],
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
