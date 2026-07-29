import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  ShieldCheck,
  User,
  Bot,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Scale,
  FileText,
  Gavel,
} from "lucide-react";
import { sendChatMessage } from "@/lib/ai-service.functions";
import { Markdown } from "@/components/chat/markdown";
import { BrandLogo } from "@/components/brand-logo";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QAP IA — Assistente Inteligente" },
      {
        name: "description",
        content:
          "Assistente inteligente para pesquisa jurídica e administrativa voltado para policiais militares.",
      },
      { property: "og:title", content: "QAP IA — Assistente Inteligente" },
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
  createdAt: number;
};

const suggestions = [
  {
    icon: Scale,
    title: "Uso progressivo da força",
    prompt: "Explique os níveis do uso progressivo da força pela polícia militar.",
  },
  {
    icon: Gavel,
    title: "Processo administrativo disciplinar",
    prompt: "Quais os prazos e fases do processo administrativo disciplinar militar?",
  },
  {
    icon: FileText,
    title: "Registro de ocorrência",
    prompt: "Qual o procedimento para registro de ocorrência administrativa?",
  },
  {
    icon: Sparkles,
    title: "Direitos do preso",
    prompt: "Quais são os direitos constitucionais do preso durante a abordagem?",
  },
];

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, [input]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const { reply } = await sendChatMessage({ data: { message: trimmed } });
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: reply,
            createdAt: Date.now(),
          },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              error instanceof Error
                ? `Erro ao processar sua pergunta: ${error.message}`
                : "Erro ao processar sua pergunta.",
            createdAt: Date.now(),
          },
        ]);
      } finally {
        setIsLoading(false);
        textareaRef.current?.focus();
      }
    },
    [isLoading],
  );

  const handleSubmit = () => send(input);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = async (msg: Message) => {
    await navigator.clipboard.writeText(msg.content);
    setCopiedId(msg.id);
    toast.success("Resposta copiada");
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleRegenerate = async () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    // remove last assistant if exists
    setMessages((prev) => {
      const idx = [...prev].reverse().findIndex((m) => m.role === "assistant");
      if (idx === -1) return prev;
      const realIdx = prev.length - 1 - idx;
      return prev.slice(0, realIdx);
    });
    await send(lastUser.content);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="relative flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-azure to-transparent" />

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8">
        <div className={cn("mx-auto w-full max-w-3xl", isEmpty && "flex h-full items-center")}>
          {isEmpty ? (
            <div className="flex w-full flex-col items-center justify-center py-4 animate-in fade-in duration-500">

              <BrandLogo size={54} className="mb-4 rounded-2xl shadow-azure" />
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-azure/25 bg-azure/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-azure-dark">
                <ShieldCheck className="h-3 w-3" />
                Assistente jurídico
              </span>
              <h1 className="text-balance text-center font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Como posso ajudá-lo hoje?
              </h1>
              <p className="mt-2 max-w-md text-center text-[13px] leading-relaxed text-muted-foreground">
                Pesquisa jurídica e administrativa com base na legislação
                vigente.
              </p>

              <div className="mt-7 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
                {suggestions.map((s) => (
                  <button
                    key={s.title}
                    onClick={() => send(s.prompt)}
                    className="interactive-card group flex items-center gap-3 rounded-xl border border-border/70 bg-card px-3.5 py-3 text-left shadow-soft focus-visible:border-azure"
                  >
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-azure/10 text-azure transition-colors group-hover:bg-gradient-azure group-hover:text-primary-foreground">
                      <s.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-semibold text-foreground">
                        {s.title}
                      </div>
                      <div className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-muted-foreground">
                        {s.prompt}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>


          ) : (
            <div className="space-y-6 pb-4">
              {messages.map((message, i) => {
                const isUser = message.role === "user";
                const isLast = i === messages.length - 1;
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-start gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                      isUser && "flex-row-reverse",
                    )}
                  >
                    {isUser ? (
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground ring-1 ring-border">
                        <User className="h-4 w-4" />
                      </div>
                    ) : (
                      <BrandLogo size={36} className="rounded-full" />
                    )}
                    <div
                      className={cn(
                        "group relative min-w-0 rounded-2xl px-4 py-3 transition-shadow",
                        isUser
                          ? "max-w-[85%] bg-primary text-primary-foreground shadow-azure sm:max-w-[75%]"
                          : "w-full max-w-full border border-border/70 bg-card text-foreground shadow-soft sm:px-5 sm:py-4",
                      )}
                    >

                      {isUser ? (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed sm:text-[15px]">
                          {message.content}
                        </p>
                      ) : (
                        <Markdown content={message.content} />
                      )}
                      <div
                        className={cn(
                          "mt-2 flex items-center gap-2 text-[10px] font-medium",
                          isUser
                            ? "text-primary-foreground/70 justify-end"
                            : "text-muted-foreground",
                        )}
                      >

                        <span>{formatTime(message.createdAt)}</span>
                        {!isUser && (
                          <div className="ml-auto flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                            <button
                              onClick={() => handleCopy(message)}
                              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                              title="Copiar"
                            >
                              {copiedId === message.id ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                            {isLast && (
                              <button
                                onClick={handleRegenerate}
                                className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                title="Regenerar resposta"
                              >
                                <RefreshCw className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-3 sm:gap-4 animate-in fade-in duration-200">
                  <BrandLogo size={36} className="rounded-full" />
                  <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-soft">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-medium text-muted-foreground">
                        Analisando
                      </span>
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-azure [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-azure [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-azure" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-border/60 bg-card/70 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-200 focus-within:border-azure/70 focus-within:shadow-azure">

            <div className="p-2 sm:p-3">
              <label htmlFor="question" className="sr-only">
                Digite sua pergunta
              </label>
              <textarea
                ref={textareaRef}
                id="question"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Faça uma pergunta jurídica ou administrativa..."
                disabled={isLoading}
                rows={1}
                className="max-h-[240px] min-h-[44px] w-full resize-none overflow-y-auto bg-transparent px-2 py-2 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
              />

              <div className="mt-1 flex items-center justify-between gap-2 px-2">
                <div className="hidden text-[11px] text-muted-foreground sm:block">
                  <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                    Enter
                  </kbd>{" "}
                  enviar ·{" "}
                  <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                    Shift + Enter
                  </kbd>{" "}
                  quebra de linha
                </div>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="ml-auto gap-1.5 rounded-full bg-gradient-azure px-4 text-primary-foreground shadow-azure transition-all hover:brightness-110 disabled:opacity-50 disabled:shadow-none"
                >
                  {isLoading ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Enviar</span>
                      <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>


          <p className="mt-2.5 text-center text-[11px] leading-relaxed text-muted-foreground">
            As respostas possuem caráter informativo e devem ser conferidas na
            legislação oficial.
          </p>
        </div>
      </div>
    </div>
  );
}
