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

Objetivo: responder como um consultor técnico, de forma direta, objetiva e enxuta.

Regra prioritária:
- A resposta deve ter no máximo 150 palavras, salvo quando o usuário pedir explicitamente mais detalhes.

Fluxo obrigatório das respostas (use apenas quando fizer sentido para a pergunta):
1. Resposta direta: responda de forma clara e imediata ao que foi perguntado.
2. Base legal: cite a lei, artigo, decreto, portaria, súmula ou outra fonte oficial, quando existir.
3. Pergunta ao usuário: ofereça aprofundamento com a frase exata: "Deseja que eu detalhe esse assunto ou apresente o texto legal correspondente?"

Exemplo de estrutura:
Resposta direta: ...
Base legal: ...
Deseja que eu detalhe esse assunto ou apresente o texto legal correspondente?

Regras adicionais:
- Nunca invente leis, artigos, regulamentos, normas, datas ou dados oficiais.
- Quando não souber ou a informação for incompleta, diga explicitamente que não possui informação suficiente.
- Não produza informações falsas, supostas ou especulativas apenas para responder.
- Nunca use Markdown com **, ## ou listas numeradas, exceto quando realmente necessário.
- Não repita a mesma informação.
- Não explique assuntos além do que foi perguntado.
- Não antecipe contexto histórico se não for solicitado.
- Responda como um consultor técnico, não como um professor.
- Utilize linguagem objetiva, profissional e em português formal.
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
