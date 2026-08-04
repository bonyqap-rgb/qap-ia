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
  Layout,
  Info,
  ExternalLink,
  BookOpen,
  Link as LinkIcon,
  BarChart3,
  Zap,
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
import { Card } from "@/components/ds/components/Card";
import { EmptyState } from "@/components/ds/components/EmptyState";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
    <div className="flex items-start gap-3 sm:gap-5 animate-in fade-in duration-300">
      <BrandLogo size={32} className="rounded-xl shrink-0" />
      <div className="w-full max-w-md rounded-2xl border border-border/40 bg-card px-5 py-4 shadow-soft">
        <div className="flex items-center gap-2.5">
          {/* Indicador discreto giratório */}
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-azure/20 border-t-azure" />
          <span className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">
            Consultando base legal...
          </span>
        </div>
        <div className="mt-4 space-y-2.5">
          <div className="h-2 w-full rounded-full bg-muted/60 animate-pulse [animation-duration:1.8s]" />
          <div className="h-2 w-[85%] rounded-full bg-muted/60 animate-pulse [animation-duration:1.8s] [animation-delay:0.2s]" />
          <div className="h-2 w-[60%] rounded-full bg-muted/60 animate-pulse [animation-duration:1.8s] [animation-delay:0.4s]" />
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
      <div className="relative flex h-[calc(100dvh-3.5rem)] overflow-hidden bg-background">
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Workspace Header - Productivity Bar */}
          <div className="flex shrink-0 items-center gap-4 border-b border-border/60 bg-card/40 px-4 py-2.5 backdrop-blur-md sm:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-azure/10 text-azure shadow-sm">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="flex min-w-0 flex-col leading-tight">
                <h2 className="truncate text-[14px] font-bold tracking-tight text-foreground">
                  {isEmpty ? "Nova Consulta Jurídica" : messages[0].content.slice(0, 60)}
                </h2>
                {!isEmpty && (
                  <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">
                    <span>{messages.length} mensagens</span>
                    <span className="text-muted-foreground/30">•</span>
                    <span>Atualizado agora</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNewChat}
                    className="h-8 gap-1.5 px-2.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline text-[11px] font-semibold uppercase tracking-wider">Novo</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Iniciar novo workspace de consulta</TooltipContent>
              </Tooltip>
              
              <div className="h-4 w-px bg-border/60 mx-1" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExport}
                    disabled={isEmpty}
                    className="h-8 gap-1.5 px-2.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline text-[11px] font-semibold uppercase tracking-wider">Exportar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Exportar workspace atual</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setRailOpen((v) => !v)}
                    className="h-8 w-8 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  >
                    <Layout className={cn("h-4 w-4 transition-transform", railOpen && "text-azure")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {railOpen ? "Fechar painel contextual" : "Abrir painel contextual"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8">
            <div className={cn("mx-auto w-full max-w-3xl", isEmpty && "flex h-full items-center")}>
              {isEmpty ? (
                <div className="flex w-full flex-col items-center justify-center py-8 sm:py-12 animate-rise max-w-2xl mx-auto">
                  {/* Identificador de marca discreto e sofisticado */}
                  <div className="mb-6 flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs text-muted-foreground shadow-soft">
                    <BrandLogo size={20} className="rounded-md" />
                    <span className="font-semibold tracking-wide uppercase text-[10px] text-text-secondary">
                      QAP IA • Assistente Corporativo
                    </span>
                  </div>

                  <h1 className="text-balance text-center font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl leading-tight">
                    Como posso ajudar em sua{" "}
                    <span className="text-gradient-azure">pesquisa hoje?</span>
                  </h1>
                  <p className="mt-3 text-center text-[14px] leading-relaxed text-muted-foreground max-w-lg">
                    Realize consultas com base em legislação militar e bases jurídicas vigentes,
                    obtendo respostas estruturadas e devidamente fundamentadas.
                  </p>

                  {/* Sugestões em formato de Cards Premium */}
                  <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                    {suggestions.map((s, i) => (
                      <Card
                        key={s.title}
                        interactive
                        onClick={() => send(s.prompt)}
                        style={{ animationDelay: `${i * 60}ms` }}
                        padding="sm"
                        className="group flex animate-rise items-start gap-4 border-border/40 hover:border-azure/30 transition-all duration-200"
                      >
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-azure/8 text-azure transition-all duration-200 group-hover:bg-gradient-azure group-hover:text-primary-foreground">
                          <s.icon className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[14px] font-semibold text-foreground tracking-tight group-hover:text-azure transition-colors">
                            {s.title}
                          </div>
                          <div className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
                            {s.prompt}
                          </div>
                        </div>
                        <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground/65 opacity-0 group-hover:opacity-100 transition-all duration-200 mt-1" />
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className="space-y-10 pb-8"
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
                          "flex items-start gap-3 sm:gap-5 animate-rise",
                          isUser && "flex-row-reverse",
                        )}
                      >
                        {isUser ? (
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-muted/60 text-muted-foreground ring-1 ring-border/50">
                            <User className="h-4 w-4" aria-hidden />
                          </div>
                        ) : (
                          <BrandLogo size={32} className="rounded-xl shadow-soft ring-1 ring-azure/10 shrink-0" />
                        )}
                        <div
                          className={cn(
                            "group relative min-w-0 rounded-2xl transition-all duration-300",
                            isUser
                              ? "max-w-[85%] bg-gradient-azure text-primary-foreground px-5 py-3.5 shadow-azure sm:max-w-[75%]"
                              : "w-full max-w-full border border-border/80 bg-card text-foreground px-5 py-4.5 sm:px-6 sm:py-5.5 shadow-subtle",
                            !isUser && message.error && "border-destructive/30 bg-destructive/5",
                          )}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap text-[15px] leading-relaxed font-medium">
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
                                  className="mt-2.5 gap-1.5 rounded-xl"
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
                              "mt-3 flex items-center gap-3 text-[10px] font-bold tracking-[0.05em] uppercase transition-all duration-300",
                              isUser
                                ? "justify-end text-primary-foreground/70"
                                : "text-muted-foreground/50 border-t border-border/40 pt-3.5",
                            )}
                          >
                            <time dateTime={new Date(message.createdAt).toISOString()}>
                              {formatTime(message.createdAt)}
                            </time>
                            {!isUser && !message.error && (
                              <div className="ml-auto flex items-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={() => handleCopy(message)}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-muted/40 text-muted-foreground transition-all hover:bg-muted hover:text-foreground shadow-sm"
                                  aria-label="Copiar resposta"
                                >
                                  {copiedId === message.id ? (
                                    <Check className="h-3.5 w-3.5 text-azure" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRated((p) => ({ ...p, [message.id]: "up" }))}
                                  className={cn(
                                    "inline-flex h-7 w-7 items-center justify-center rounded-lg bg-muted/40 transition-all hover:bg-muted shadow-sm",
                                    rated[message.id] === "up"
                                      ? "text-azure bg-azure/10"
                                      : "text-muted-foreground hover:text-foreground",
                                  )}
                                >
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRated((p) => ({ ...p, [message.id]: "down" }))}
                                  className={cn(
                                    "inline-flex h-7 w-7 items-center justify-center rounded-lg bg-muted/40 transition-all hover:bg-muted shadow-sm",
                                    rated[message.id] === "down"
                                      ? "text-destructive bg-destructive/10"
                                      : "text-muted-foreground hover:text-foreground",
                                  )}
                                >
                                  <ThumbsDown className="h-3.5 w-3.5" />
                                </button>
                                {isLast && (
                                  <button
                                    type="button"
                                    onClick={handleRegenerate}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-muted/40 text-muted-foreground transition-all hover:bg-muted hover:text-foreground shadow-sm"
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

          <div className="shrink-0 border-t border-border/60 bg-card/40 px-4 py-5 backdrop-blur-md sm:px-6 sm:py-6">
            <div className="mx-auto max-w-3xl">
              <div className="group relative flex flex-col rounded-2xl border border-border/80 bg-card shadow-medium transition-all duration-300 focus-within:border-azure/70 focus-within:ring-azure/20 focus-within:ring-4 focus-within:shadow-elevated hover:border-border/100">
                <div className="p-3 sm:p-4">
                  <textarea
                    ref={textareaRef}
                    id="question"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Faça uma pergunta jurídica ou administrativa sobre legislação militar..."
                    disabled={isLoading}
                    rows={1}
                    className="max-h-[240px] min-h-[52px] w-full resize-none bg-transparent px-3 py-2 text-[16px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60"
                  />

                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/40 pt-2.5 px-1">
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => toast.info("Anexos em breve na central")}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                          >
                            <Paperclip className="h-4.5 w-4.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Anexar documento</TooltipContent>
                      </Tooltip>
                      <div className="hidden text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50 sm:block">
                        Markdown Ativo
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="hidden text-[11px] font-medium text-muted-foreground/60 sm:inline-block">
                        <kbd className="rounded border border-border/80 bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold">Shift + Enter</kbd> pular linha
                      </span>
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!input.trim() || isLoading}
                        className={cn(
                          "h-10 gap-2 rounded-xl px-5 text-[13px] font-bold transition-all shadow-azure",
                          !input.trim() || isLoading ? "opacity-40" : "hover:scale-[1.02] active:scale-[0.98]"
                        )}
                      >
                        <span>{isLoading ? "Consultando" : "Enviar"}</span>
                        {isLoading ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Send className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-[11px] font-medium text-muted-foreground/60 italic">
                O QAP IA pode cometer erros. Verifique informações importantes na legislação oficial.
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
            <div className="flex-1 overflow-y-auto p-3">
              {messages.filter((m) => m.role === "user").length === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="Sem consultas"
                  description="As perguntas feitas nesta sessão aparecerão listadas aqui."
                  className="m-1 border-dashed p-4"
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
