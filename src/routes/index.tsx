import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, ShieldCheck, User, Bot } from "lucide-react";
import { sendChatMessage } from "@/lib/ai-service.functions";


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
          "Assistente inteligente para pesquisa jurídica e administrativa voltado para policiais militares.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`;
  }, [input]);

  const handleSubmit = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { reply } = await sendChatMessage({ data: { message: text } });
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          error instanceof Error
            ? `Erro ao processar sua pergunta: ${error.message}`
            : "Erro ao processar sua pergunta.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };


  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      {/* Decorative top accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-navy via-gold to-navy" />

      {/* Header */}
      <header className="flex shrink-0 items-center justify-center border-b border-border/50 bg-card/50 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy shadow-gold">
            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-lg font-bold tracking-tight text-navy sm:text-xl">
              QAP IA
            </span>
            <span className="truncate text-xs font-medium text-muted-foreground">
              Assistente Inteligente para Pesquisa Jurídica e Administrativa
            </span>
          </div>
        </div>
      </header>

      {/* Messages area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Como posso ajudá-lo hoje?
              </h1>
              <p className="mt-3 max-w-md text-center text-sm text-muted-foreground">
                Digite sua dúvida jurídica ou administrativa e receba uma
                resposta orientada.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-4 sm:gap-5 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full sm:h-10 sm:w-10 ${
                      message.role === "user"
                        ? "bg-gold text-gold-dark"
                        : "bg-navy text-primary-foreground"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </div>
                  <div
                    className={`relative max-w-[80%] rounded-2xl px-4 py-3 sm:max-w-[75%] sm:px-5 sm:py-3.5 ${
                      message.role === "user"
                        ? "bg-gold text-gold-dark"
                        : "border border-border bg-card text-foreground"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-gold text-gold-dark ring-2 ring-card shadow-sm">
                        <ShieldCheck className="h-3 w-3" />
                      </div>
                    )}
                    <p className="text-sm leading-relaxed sm:text-base">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-primary-foreground sm:h-10 sm:w-10">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="rounded-2xl border border-border bg-card px-4 py-3 sm:px-5 sm:py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-medium text-muted-foreground">
                        Pensando
                      </span>
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input area */}
      <div className="shrink-0 border-t border-border/50 bg-card/50 px-4 py-4 backdrop-blur-sm sm:px-6 sm:py-5">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-gold transition-shadow focus-within:shadow-gold">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />

            <div className="p-3 sm:p-4">
              <label htmlFor="question" className="sr-only">
                Digite sua pergunta
              </label>
              <textarea
                ref={textareaRef}
                id="question"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Exemplo: Qual é o procedimento para registro de ocorrência administrativa?"
                disabled={isLoading}
                rows={1}
                className="max-h-[240px] min-h-[52px] w-full resize-none overflow-y-auto bg-transparent py-3 text-base leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none sm:min-h-[56px]"
              />

              <div className="mt-3 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!input.trim() || isLoading}
                  className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-gold transition-all hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>Enviar</span>
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
            As respostas possuem caráter informativo e devem ser conferidas na
            legislação oficial.
          </p>
        </div>
      </div>
    </div>
  );
}
