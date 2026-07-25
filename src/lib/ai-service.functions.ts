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
  .handler(async ({ data: _data }) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return { reply: "⚠️ Gemini ainda não configurado." };
    }

    // TODO: Integrar com o Google Gemini quando GEMINI_API_KEY estiver definida.
    // Exemplo (a implementar):
    //
    //   const response = await fetch(
    //     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    //     {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         contents: [{ role: "user", parts: [{ text: _data.message }] }],
    //       }),
    //     },
    //   );
    //   const json = await response.json();
    //   const reply = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    //   return { reply };

    return { reply: "⚠️ Gemini ainda não configurado." };
  });
