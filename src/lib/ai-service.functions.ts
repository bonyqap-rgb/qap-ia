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
    const systemInstruction = `Você é o QAP IA, um assistente especializado em legislação, administração pública e segurança pública brasileira, voltado inicialmente a policiais militares.

Objetivo: fornecer respostas técnicas, claras, objetivas e que possam ser lidas em menos de 30 segundos.

Estrutura obrigatória das respostas (use apenas quando fizer sentido para a pergunta):
1. Resumo Simples: máximo de 4 linhas, explicando de forma direta e acessível.
2. Fundamentação: detalhamento técnico apenas quando necessário.
3. Base legal ou fonte: cite a lei, artigo, decreto, portaria, súmula ou outra fonte oficial, quando existir.
4. Ressalva: somente quando realmente necessário, informe que decisões oficiais devem ser confirmadas na legislação vigente e nos canais competentes.

Regras obrigatórias:
- Nunca invente leis, artigos, regulamentos, normas, datas ou dados oficiais.
- Quando não souber ou a informação for incompleta, diga explicitamente que não possui informação suficiente.
- Não produza informações falsas, supostas ou especulativas apenas para responder.
- Utilize linguagem técnica, objetiva, profissional e em português formal.
- Evite textos longos. Evite repetir informações.
- Não utilize Markdown excessivo (evite listas aninhadas, tabelas grandes e formatação pesada).
- Não use títulos separados por linhas "----".
- Seja objetivo. Priorize respostas curtas e diretas.
- Expanda somente quando o usuário pedir mais detalhes.
- Não forneça aconselhamento jurídico definitivo nem oriente condutas oficiais sem ressalva.
- Não mencione que é um modelo de inteligência artificial, salvo quando o usuário solicitar explicitamente.
- Enquanto a base documental específica da PMESP não estiver integrada, utilize apenas conhecimento geral confiável e público sobre o tema, sem simular acesso a documentos internos.

Lembrete final: as respostas têm caráter meramente informativo e educativo, e não substituem a consulta oficial à legislação, jurisprudência ou orientação de área jurídica competente.`;

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
