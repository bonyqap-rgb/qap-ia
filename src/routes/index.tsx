import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QAP IA — Assistente Inteligente" },
      {
        name: "description",
        content:
          "Assistente inteligente para pesquisa jurídica e administrativa voltado para policiais militares.",
      },
      {
        property: "og:title",
        content: "QAP IA — Assistente Inteligente",
      },
      {
        property: "og:description",
        content:
          "Assistente inteligente para pesquisa jurídica e administrativa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [question, setQuestion] = useState("");

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Decorative top accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-navy via-gold to-navy" />

      {/* Header */}
      <header className="flex items-center justify-center px-6 py-8 sm:py-10">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-navy shadow-gold">
            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
              QAP IA
            </span>
            <span className="text-xs font-medium text-muted-foreground sm:text-sm">
              Assistente Inteligente para Pesquisa Jurídica e Administrativa
            </span>
          </div>
        </div>
      </header>

      {/* Main chat area */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-12 sm:px-6">
        <div className="w-full max-w-2xl">
          <h1 className="mb-8 text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Como posso ajudá-lo hoje?
          </h1>

          {/* Chat input card */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-gold transition-shadow focus-within:shadow-gold">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />

            <div className="p-4 sm:p-6">
              <label htmlFor="question" className="sr-only">
                Digite sua pergunta
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Exemplo: Qual é o procedimento para registro de ocorrência administrativa?"
                className="min-h-[120px] w-full resize-none bg-transparent text-base leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-lg"
              />

              <div className="mt-4 flex items-center justify-end">
                <button
                  type="button"
                  disabled={!question.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-gold transition-all hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>Enviar</span>
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground sm:text-sm">
            As respostas possuem caráter informativo e devem ser conferidas na
            legislação oficial.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} QAP IA. Todos os direitos reservados.
      </footer>
    </div>
  );
}
