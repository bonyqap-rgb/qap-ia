import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback, memo } from "react";
import {
  Send,
  ShieldCheck,
  User,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Scale,
  FileText,
  Gavel,
  Paperclip,
  Download,
  PanelRightOpen,
  PanelRightClose,
  Star,
  MessageSquare,
  Plus,
  ThumbsUp,
  ThumbsDown,
  CornerDownLeft,
  AlertTriangle,

} from "lucide-react";
import { sendChatMessage } from "@/lib/ai-service.functions";
import { AnswerMeta, CitationList } from "@/components/chat/answer-meta";
import { chatService } from "@/services/chat.service";
import { ApiError } from "@/services/api-client";
import type { Citation } from "@/types/api";
import { Markdown } from "@/components/chat/markdown";
import { SourceCards, extractSources } from "@/components/chat/source-cards";
import { useTypewriter } from "@/components/chat/use-typewriter";
import { BrandLogo } from "@/components/brand-logo";
import { DataGap } from "@/components/common/page-primitives";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat Jurídico — QAP IA" },
      {
        name: "description",
        content:
          "Assistente inteligente para pesquisa jurídica e administrativa voltado para policiais militares.",
      },
      { property: "og:title", content: "Chat Jurídico — QAP IA" },
      {
        property: "og:description",
        content:
          "Assistente inteligente para pesquisa jurídica e administrativa voltado para policiais militares.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  model?: string;
  latencyMs?: number;
  confidence?: number;
  citations?: Citation[];
  usedDocuments?: Array<{ id?: string; name: string }>;
  error?: boolean;
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

const followUps = [
  "Detalhe esse assunto",
  "Apresente o texto legal correspondente",
  "Existe jurisprudência aplicável?",
  "Resuma em tópicos para o efetivo",
];

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Bolha do assistente com revelação progressiva, metadados e citações. */
const AssistantBubble = memo(function AssistantBubble({
  message,
  animate,
}: {
  message: Message;
  animate: boolean;
}) {
  const { shown, done } = useTypewriter(message.content, animate);
  const citations = message.citations ?? [];
  const sources = done && citations.length === 0 ? extractSources(message.content) : [];

  return (
    <>
      <Markdown content={shown} />
      {!done && <span className="caret-blink text-azure">▍</span>}
      {done && (
        <AnswerMeta
          model={message.model}
          latencyMs={message.latencyMs}
          confidence={message.confidence}
          usedDocuments={message.usedDocuments}
        />
      )}
      {done && citations.length > 0 && <CitationList citations={citations} />}
      <SourceCards sources={sources} />
    </>
  );
});


function ThinkingBubble() {
  return (
    <div className="flex items-start gap-3 sm:gap-4 animate-in fade-in duration-200">
      <BrandLogo size={36} className="rounded-full" />
      <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card px-4 py-3.5 shadow-soft">
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] font-medium text-muted-foreground">
            Analisando a legislação
          </span>
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-azure [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-azure [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-azure" />
        </div>
        <div className="mt-3 space-y-2">
          <div className="shimmer-line h-2.5 w-full rounded-full" />
          <div className="shimmer-line h-2.5 w-[86%] rounded-full" />
          <div className="shimmer-line h-2.5 w-[62%] rounded-full" />
        </div>
      </div>
    </div>
  );
}

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [railOpen, setRailOpen] = useState(false);
  const [rated, setRated] = useState<Record<string, "up" | "down">>({});
  const animatedIdRef = useRef<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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

      const startedAt = performance.now();
      try {
        const id = crypto.randomUUID();
        animatedIdRef.current = id;

        // Caminho principal: chat RAG do backend (POST /chat).
        try {
          const response = await chatService.ask({
            question: trimmed,
            history: messagesRef.current.map((m) => ({ role: m.role, content: m.content })),
          });
          setMessages((prev) => [
            ...prev,
            {
              id,
              role: "assistant",
              content: response.answer,
              createdAt: Date.now(),
              model: response.model,
              confidence: response.confidence,
              latencyMs: response.latencyMs ?? Math.round(performance.now() - startedAt),
              citations: response.citations,
              usedDocuments: response.usedDocuments,
            },
          ]);
        } catch (apiError) {
          // Fallback: serviço de IA direto, quando a API RAG não está acessível.
          // Nesse caminho NÃO há contexto documental — a resposta é sinalizada.
          if (!(apiError instanceof ApiError) || !apiError.isNetwork) throw apiError;
          const { reply } = await sendChatMessage({ data: { message: trimmed } });
          setMessages((prev) => [
            ...prev,
            {
              id,
              role: "assistant",
              content: `⚠️ Base documental inacessível — resposta gerada sem contexto dos documentos indexados.\n\n${reply}`,
              createdAt: Date.now(),
              latencyMs: Math.round(performance.now() - startedAt),
            },
          ]);
        }


      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            error: true,
            content:
              error instanceof Error
                ? `Não foi possível concluir a consulta. ${error.message}`
                : "Não foi possível concluir a consulta. Tente novamente em instantes.",
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
    setMessages((prev) => {
      const idx = [...prev].reverse().findIndex((m) => m.role === "assistant");
      if (idx === -1) return prev;
      const realIdx = prev.length - 1 - idx;
      return prev.slice(0, realIdx);
    });
    await send(lastUser.content);
  };

  const handleExport = () => {
    if (messages.length === 0) return;
    const body = messages
      .map(
        (m) =>
          `### ${m.role === "user" ? "Consulta" : "QAP IA"} — ${formatTime(m.createdAt)}\n\n${m.content}`,
      )
      .join("\n\n---\n\n");
    const doc = `# QAP IA — Conversa exportada\n\n_${new Date().toLocaleString("pt-BR")}_\n\n${body}\n\n---\n\nAs respostas possuem caráter informativo e devem ser conferidas na legislação oficial.\n`;
    const url = URL.createObjectURL(new Blob([doc], { type: "text/markdown" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `qap-ia-conversa-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Conversa exportada");
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setRated({});
    textareaRef.current?.focus();
  };

  const isEmpty = messages.length === 0;
  const lastIsAssistant =
    !isLoading && messages.length > 0 && messages[messages.length - 1].role === "assistant";

  return (
    <TooltipProvider delayDuration={200}>
      <div className="relative flex h-[calc(100dvh-3.5rem)] overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-azure to-transparent" />

          {/* Barra de ações da conversa */}
          <div className="flex shrink-0 items-center gap-2 border-b border-border/60 bg-card/60 px-4 py-2 backdrop-blur-md sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-azure/12 text-azure">
                <MessageSquare className="h-3.5 w-3.5" />
              </span>
              <span className="truncate text-[13px] font-semibold text-foreground">
                {isEmpty ? "Nova consulta" : messages[0].content.slice(0, 48)}
              </span>
              {!isEmpty && (
                <Badge
                  variant="outline"
                  className="hidden shrink-0 border-border/70 text-[10px] font-medium text-muted-foreground sm:inline-flex"
                >
                  {messages.length} mensagens
                </Badge>
              )}
            </div>

            <div className="ml-auto flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNewChat}
                    className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline text-[12px]">Nova</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Iniciar nova conversa</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExport}
                    disabled={isEmpty}
                    className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline text-[12px]">Exportar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Exportar conversa (.md)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setRailOpen((v) => !v)}
                    className="hidden h-8 w-8 text-muted-foreground hover:text-foreground lg:inline-flex"
                  >
                    {railOpen ? (
                      <PanelRightClose className="h-4 w-4" />
                    ) : (
                      <PanelRightOpen className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {railOpen ? "Ocultar histórico" : "Mostrar histórico"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8">
            <div
              className={cn(
                "mx-auto w-full max-w-3xl",
                isEmpty && "flex h-full items-center",
              )}
            >
              {isEmpty ? (
                <div className="flex w-full flex-col items-center justify-center py-4 animate-rise">
                  <BrandLogo size={56} className="mb-4 rounded-2xl shadow-azure" />
                  <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-azure/25 bg-azure/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-azure-dark">
                    <ShieldCheck className="h-3 w-3" />
                    Assistente jurídico
                  </span>
                  <h1 className="text-balance text-center font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Como posso ajudá-lo hoje?
                  </h1>
                  <p className="mt-2 max-w-md text-center text-[13px] leading-relaxed text-muted-foreground">
                    Pesquisa jurídica e administrativa com base na legislação vigente,
                    sempre com a norma correspondente citada.
                  </p>

                  <div className="mt-7 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {suggestions.map((s, i) => (
                      <button
                        key={s.title}
                        onClick={() => send(s.prompt)}
                        style={{ animationDelay: `${i * 60}ms` }}
                        className="interactive-card group flex animate-rise items-center gap-3 rounded-xl border border-border/70 bg-card px-3.5 py-3 text-left shadow-soft focus-visible:border-azure"
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
                        <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className="space-y-7 pb-4"
                  role="log"
                  aria-live="polite"
                  aria-relevant="additions text"
                  aria-busy={isLoading}
                >
                  {messages.map((message, i) => {
                    const isUser = message.role === "user";
                    const isLast = i === messages.length - 1;
                    return (
                      <article
                        key={message.id}
                        aria-label={isUser ? "Sua consulta" : "Resposta do QAP IA"}
                        className={cn(
                          "flex items-start gap-3 animate-rise sm:gap-4",
                          isUser && "flex-row-reverse",
                        )}
                      >
                        {isUser ? (
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground ring-1 ring-border">
                            <User className="h-4 w-4" aria-hidden />
                          </div>
                        ) : (
                          <BrandLogo size={36} className="rounded-full" />
                        )}
                        <div
                          className={cn(
                            "group relative min-w-0 rounded-2xl px-4 py-3 transition-shadow",
                            isUser
                              ? "max-w-[85%] bg-primary text-primary-foreground shadow-azure sm:max-w-[75%]"
                              : "w-full max-w-full border bg-card text-foreground shadow-soft sm:px-5 sm:py-4",
                            !isUser &&
                              (message.error
                                ? "border-destructive/40 bg-destructive/5"
                                : "border-border/70"),
                          )}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap text-sm leading-relaxed sm:text-[15px]">
                              {message.content}
                            </p>
                          ) : message.error ? (
                            <div className="flex items-start gap-2.5">
                              <AlertTriangle
                                className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
                                aria-hidden
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground">
                                  {message.content}
                                </p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="mt-2.5 gap-1.5"
                                  onClick={handleRegenerate}
                                >
                                  <RefreshCw className="h-3.5 w-3.5" />
                                  Tentar novamente
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <AssistantBubble
                              message={message}
                              animate={animatedIdRef.current === message.id}
                            />
                          )}

                          <div
                            className={cn(
                              "mt-2 flex items-center gap-2 text-[10px] font-medium",
                              isUser
                                ? "justify-end text-primary-foreground/70"
                                : "text-muted-foreground",
                            )}
                          >
                            <time dateTime={new Date(message.createdAt).toISOString()}>
                              {formatTime(message.createdAt)}
                            </time>
                            {!isUser && !message.error && (
                              <div className="ml-auto flex items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={() => handleCopy(message)}
                                  className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                  aria-label="Copiar resposta"
                                >
                                  {copiedId === message.id ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRated((p) => ({ ...p, [message.id]: "up" }))}
                                  aria-label="Marcar resposta como útil"
                                  aria-pressed={rated[message.id] === "up"}
                                  className={cn(
                                    "inline-flex min-h-8 min-w-8 items-center justify-center rounded-md transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    rated[message.id] === "up"
                                      ? "text-emerald-600"
                                      : "text-muted-foreground",
                                  )}
                                >
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRated((p) => ({ ...p, [message.id]: "down" }))}
                                  aria-label="Marcar resposta como imprecisa"
                                  aria-pressed={rated[message.id] === "down"}
                                  className={cn(
                                    "inline-flex min-h-8 min-w-8 items-center justify-center rounded-md transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    rated[message.id] === "down"
                                      ? "text-destructive"
                                      : "text-muted-foreground",
                                  )}
                                >
                                  <ThumbsDown className="h-3.5 w-3.5" />
                                </button>
                                {isLast && (
                                  <button
                                    type="button"
                                    onClick={handleRegenerate}
                                    aria-label="Regenerar resposta"
                                    className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                  >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </article>

                    );
                  })}

                  {isLoading && <ThinkingBubble />}

                  {lastIsAssistant && (
                    <div className="flex flex-wrap gap-2 pl-0 sm:pl-[52px] animate-in fade-in duration-500">
                      {followUps.map((f) => (
                        <button
                          key={f}
                          onClick={() => send(f)}
                          className="rounded-full border border-border/70 bg-card px-3 py-1.5 text-[12px] font-medium text-muted-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:border-azure/50 hover:text-foreground"
                        >
                          {f}
                        </button>
                      ))}
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
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() =>
                              toast.info("Anexos chegam em breve", {
                                description:
                                  "Envie documentos pela Base de Conhecimento enquanto isso.",
                              })
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          >
                            <Paperclip className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Anexar documento (em breve)</TooltipContent>
                      </Tooltip>
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

        {/* Consultas desta sessão (o backend ainda não persiste conversas) */}
        {railOpen && (
          <aside className="hidden w-72 shrink-0 flex-col border-l border-border/60 bg-card/40 lg:flex">
            <div className="border-b border-border/60 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Consultas desta sessão
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {messages.filter((m) => m.role === "user").length === 0 ? (
                <DataGap
                  compact
                  title="Sem histórico persistente"
                  endpoint="GET /conversations"
                  description="As perguntas desta sessão aparecem aqui."
                  className="m-1"
                />
              ) : (
                messages
                  .filter((m) => m.role === "user")
                  .map((m, i) => (
                    <button
                      key={`${m.id ?? i}-rail`}
                      onClick={() => send(m.content)}
                      className="group mb-1 w-full rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-muted/70"
                    >
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-3 w-3 shrink-0 text-azure" />
                        <span className="truncate text-[13px] font-medium text-foreground">
                          {m.content.slice(0, 40)}
                        </span>
                      </div>
                      <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        {m.content}
                      </div>
                    </button>
                  ))
              )}
            </div>
          </aside>
        )}

      </div>
    </TooltipProvider>
  );
}
