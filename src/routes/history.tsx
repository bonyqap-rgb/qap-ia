import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  History,
  MessageSquare,
  Calendar,
  Clock,
  Star,
  Share2,
  Trash2,
  MessageSquarePlus,
  Sparkle,
  RotateCcw,
  Search,
} from "lucide-react";
import {
  Container,
  Section,
  Card,
  Badge,
  Stat,
  EmptyState,
  SearchField,
  Button,
} from "@/components/ds";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Histórico Premium — QAP IA" },
      {
        name: "description",
        content:
          "Workspace corporativo para gerenciamento de consultas anteriores com o assistente jurídico QAP IA.",
      },
      { property: "og:title", content: "Histórico Premium — QAP IA" },
      {
        property: "og:description",
        content:
          "Workspace corporativo para gerenciamento de consultas anteriores com o assistente jurídico QAP IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HistoryPage,
});

interface Conversation {
  id: string;
  title: string;
  query: string;
  date: string;
  time: string;
  messagesCount: number;
  lastUpdateText: string;
  isRecent: boolean;
  group: "Hoje" | "Ontem" | "Últimos 7 dias" | "Este mês";
  isFavorite?: boolean;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    title: "Uso progressivo da força",
    query:
      "Quais são as diretrizes para uso progressivo da força sob as novas normas da corporação?",
    date: "14/05/2024",
    time: "14:32",
    messagesCount: 5,
    lastUpdateText: "10 min atrás",
    isRecent: true,
    group: "Hoje",
    isFavorite: true,
  },
  {
    id: "conv-2",
    title: "Prazos do Processo Administrativo Disciplinar (PAD)",
    query: "Qual o prazo máximo para conclusão e prorrogação do PAD no estatuto militar?",
    date: "14/05/2024",
    time: "09:15",
    messagesCount: 3,
    lastUpdateText: "5 horas atrás",
    isRecent: true,
    group: "Hoje",
    isFavorite: false,
  },
  {
    id: "conv-3",
    title: "Abordagem veicular em flagrante delito",
    query: "Procedimentos, excludentes de ilicitude e nulidades em buscas veiculares operacionais.",
    date: "13/05/2024",
    time: "18:40",
    messagesCount: 8,
    lastUpdateText: "Ontem",
    isRecent: false,
    group: "Ontem",
    isFavorite: false,
  },
  {
    id: "conv-4",
    title: "Inquérito Policial Militar (IPM) - Competência",
    query:
      "Diferenciação de competência civil e da Justiça Militar em crimes dolosos contra a vida.",
    date: "13/05/2024",
    time: "11:20",
    messagesCount: 4,
    lastUpdateText: "Ontem",
    isRecent: false,
    group: "Ontem",
    isFavorite: true,
  },
  {
    id: "conv-5",
    title: "Lei de Abuso de Autoridade e algemas",
    query: "Jurisprudência consolidada e Súmula Vinculante 11 sobre o uso de algemas.",
    date: "10/05/2024",
    time: "16:15",
    messagesCount: 6,
    lastUpdateText: "4 dias atrás",
    isRecent: false,
    group: "Últimos 7 dias",
    isFavorite: false,
  },
  {
    id: "conv-6",
    title: "Pensão militar e reserva remunerada",
    query: "Regras vigentes de transição para transferência para inatividade e remunerações PM.",
    date: "08/05/2024",
    time: "10:05",
    messagesCount: 12,
    lastUpdateText: "6 dias atrás",
    isRecent: false,
    group: "Últimos 7 dias",
    isFavorite: false,
  },
  {
    id: "conv-7",
    title: "Excludentes de ilicitude no CPM",
    query: "Análise doutrinária sobre legítima defesa e estrito cumprimento do dever legal.",
    date: "28/04/2024",
    time: "22:11",
    messagesCount: 7,
    lastUpdateText: "16 dias atrás",
    isRecent: false,
    group: "Este mês",
    isFavorite: false,
  },
  {
    id: "conv-8",
    title: "Constitucionalidade de busca domiciliar",
    query: "Entendimento supremo sobre fundadas suspeitas para entrada domiciliar sem mandado.",
    date: "18/04/2024",
    time: "15:45",
    messagesCount: 15,
    lastUpdateText: "26 dias atrás",
    isRecent: false,
    group: "Este mês",
    isFavorite: false,
  },
];

function HistorySkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-hidden="true">
      {[1, 2].map((g) => (
        <div key={g} className="space-y-4">
          <div className="h-5 w-24 rounded bg-muted/60" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1, 2].map((c) => (
              <div key={c} className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-2/3 rounded bg-muted/60" />
                    <div className="h-4 w-5/6 rounded bg-muted/40" />
                  </div>
                  <div className="h-6 w-14 rounded-full bg-muted/50" />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <div className="flex gap-4">
                    <div className="h-3 w-16 rounded bg-muted/40" />
                    <div className="h-3 w-12 rounded bg-muted/40" />
                  </div>
                  <div className="flex gap-1.5">
                    <div className="size-8 rounded-lg bg-muted/40" />
                    <div className="size-8 rounded-lg bg-muted/40" />
                    <div className="size-8 rounded-lg bg-muted/40" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("qap_history_conversations");
    if (stored) {
      try {
        setConversations(JSON.parse(stored));
      } catch {
        setConversations(INITIAL_CONVERSATIONS);
      }
    } else {
      setConversations(INITIAL_CONVERSATIONS);
      localStorage.setItem("qap_history_conversations", JSON.stringify(INITIAL_CONVERSATIONS));
    }
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const saveConversations = (updated: Conversation[]) => {
    setConversations(updated);
    localStorage.setItem("qap_history_conversations", JSON.stringify(updated));
  };

  const handleToggleFavorite = (id: string) => {
    const updated = conversations.map((c) => {
      if (c.id === id) {
        const newState = !c.isFavorite;
        toast.success(
          newState ? "Consulta marcada como favorita" : "Consulta removida dos favoritos",
          {
            description: c.title,
          },
        );
        return { ...c, isFavorite: newState };
      }
      return c;
    });
    saveConversations(updated);
  };

  const handleDelete = (id: string) => {
    const itemToDelete = conversations.find((c) => c.id === id);
    const updated = conversations.filter((c) => c.id !== id);
    saveConversations(updated);
    toast.success("Consulta excluída com sucesso", {
      description: itemToDelete?.title,
    });
  };

  const handleShare = (id: string) => {
    const item = conversations.find((c) => c.id === id);
    if (!item) return;
    navigator.clipboard.writeText(`https://qapia.militar/share/${id}`);
    toast.success("Link corporativo gerado", {
      description: `Link de compartilhamento para "${item.title}" copiado para a área de transferência.`,
    });
  };

  const handleOpen = (title: string) => {
    toast.info("Carregando consulta jurídica...", {
      description: `Recuperando mensagens e fundamentação legal para "${title}".`,
    });
  };

  const handleRestoreDefault = () => {
    setIsLoading(true);
    saveConversations(INITIAL_CONVERSATIONS);
    toast.success("Histórico padrão restaurado", {
      description: "As consultas corporativas de demonstração foram recarregadas.",
    });
    setTimeout(() => setIsLoading(false), 600);
  };

  // KPIs
  const stats = useMemo(() => {
    const total = conversations.length;
    const recent = conversations.filter((c) => c.isRecent).length;
    const favorites = conversations.filter((c) => c.isFavorite).length;
    return { total, recent, favorites };
  }, [conversations]);

  // Filtering
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter(
      (c) => c.title.toLowerCase().includes(query) || c.query.toLowerCase().includes(query),
    );
  }, [conversations, searchQuery]);

  // Grouping (without modifying existing keys or adding custom structures)
  const groupedConversations = useMemo(() => {
    const groups: Record<string, Conversation[]> = {
      Hoje: [],
      Ontem: [],
      "Últimos 7 dias": [],
      "Este mês": [],
    };

    filteredConversations.forEach((c) => {
      if (groups[c.group]) {
        groups[c.group].push(c);
      }
    });

    return Object.entries(groups).filter(([_, items]) => items.length > 0);
  }, [filteredConversations]);

  return (
    <Container size="wide" className="py-6 sm:py-8 space-y-6">
      {/* Top Header Block */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="grid size-7 place-items-center rounded-lg bg-azure/10 text-azure"
              aria-hidden="true"
            >
              <History className="size-4" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-azure-dark dark:text-azure-light">
              Workspace Corporativo
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl leading-tight">
            Histórico de Consultas
          </h1>
          <p className="text-caption sm:text-footnote text-muted-foreground max-w-xl leading-relaxed">
            Acesse e gerencie suas pesquisas anteriores. As fundamentações legais e o fluxo de
            mensagens são persistidos localmente para acesso rápido.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {conversations.length < INITIAL_CONVERSATIONS.length && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRestoreDefault}
              className="gap-2 h-9 text-[13px] font-medium hover:bg-muted/50"
            >
              <RotateCcw className="size-3.5 text-muted-foreground" />
              Restaurar Padrão
            </Button>
          )}
          <Button
            asChild
            size="sm"
            className="shadow-azure gap-2 bg-gradient-azure hover:brightness-110 h-9 text-[13px]"
          >
            <Link to="/chat">
              <MessageSquarePlus className="size-4" />
              Nova Consulta
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards section */}
      {conversations.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Total de pesquisas"
            value={stats.total.toString()}
            hint="Registradas localmente"
            icon={History}
            tone="accent"
            loading={isLoading}
            interactive={false}
          />
          <Stat
            label="Consultas Recentes"
            value={stats.recent.toString()}
            hint="Interações de hoje"
            icon={Sparkle}
            tone="success"
            loading={isLoading}
            interactive={false}
          />
          <Stat
            label="Favoritadas"
            value={stats.favorites.toString()}
            hint="Acesso rápido salvo"
            icon={Star}
            tone="warning"
            loading={isLoading}
            interactive={false}
          />
          <Stat
            label="Tempo Economizado"
            value="~4h"
            hint="Estimativa de pesquisa legal"
            icon={MessageSquare}
            tone="info"
            loading={isLoading}
            interactive={false}
          />
        </div>
      )}

      {/* Filters & Search Control */}
      {conversations.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-muted/20 border border-border/50 rounded-xl p-3">
          <div className="flex-1 max-w-md">
            <SearchField
              placeholder="Filtrar por título ou palavra-chave..."
              className="w-full h-10 bg-card border-border/60"
              shortcut={null}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />
          </div>
          <div className="flex items-center justify-end text-[12px] text-muted-foreground font-medium px-1">
            Exibindo{" "}
            <span className="text-foreground font-semibold mx-1">
              {filteredConversations.length}
            </span>{" "}
            de <span className="text-foreground font-semibold mx-1">{conversations.length}</span>{" "}
            consultas
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <div className="min-h-[300px]">
        {isLoading ? (
          <HistorySkeleton />
        ) : conversations.length === 0 ? (
          <div className="py-12 text-center max-w-md mx-auto">
            <EmptyState
              icon={History}
              title="Seu histórico está vazio"
              description="Nenhuma consulta jurídica ou administrativa foi registrada ainda. Comece enviando uma pergunta ao assistente."
              action={
                <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mt-4">
                  <Button asChild size="sm" className="gap-2 bg-gradient-azure shadow-azure">
                    <Link to="/chat">
                      <MessageSquarePlus className="size-4" />
                      Nova Consulta
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRestoreDefault}
                    className="gap-2"
                  >
                    <RotateCcw className="size-3.5 text-muted-foreground" />
                    Restaurar Padrão
                  </Button>
                </div>
              }
              className="border border-dashed border-border/80 bg-muted/15 py-12 px-6 rounded-2xl"
            />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="py-12 text-center max-w-md mx-auto">
            <EmptyState
              icon={Search}
              title="Nenhuma consulta correspondente"
              description={`Não encontramos resultados locais correspondentes a "${searchQuery}". Tente outros termos de pesquisa.`}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="mt-4 gap-1.5"
                >
                  Limpar Pesquisa
                </Button>
              }
              className="border border-dashed border-border/80 bg-muted/15 py-12 px-6 rounded-2xl"
            />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
            {groupedConversations.map(([groupName, items]) => (
              <div key={groupName} className="space-y-3.5">
                {/* Visual Section Group Label */}
                <div className="flex items-center gap-2 px-1">
                  <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
                    {groupName}
                  </h3>
                  <span className="h-px flex-1 bg-border/40" aria-hidden="true" />
                  <span className="text-[11px] font-bold text-muted-foreground/60 bg-muted/60 px-2 py-0.5 rounded-full">
                    {items.length} {items.length === 1 ? "consulta" : "consultas"}
                  </span>
                </div>

                {/* Grid of Conversations */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      interactive
                      padding="none"
                      className="group flex flex-col justify-between border-border/40 hover:border-azure/30 hover:shadow-subtle transition-all duration-200"
                    >
                      {/* Card Content Top */}
                      <div className="p-5 space-y-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {item.isRecent && (
                                <Badge
                                  tone="success"
                                  className="h-5 px-1.5 py-0 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shrink-0 animate-pulse"
                                >
                                  <span className="size-1 rounded-full bg-emerald-500" />
                                  Recente
                                </Badge>
                              )}
                              {item.isFavorite && (
                                <Badge
                                  tone="warning"
                                  className="h-5 px-1.5 py-0 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shrink-0"
                                >
                                  <Star className="size-2.5 fill-amber-500 text-amber-500" />
                                  Favorito
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-display text-[15px] sm:text-base font-bold leading-snug tracking-tight text-foreground group-hover:text-azure transition-colors truncate">
                              {item.title}
                            </h4>
                          </div>
                        </div>

                        <p className="text-[12.5px] leading-relaxed text-muted-foreground line-clamp-2 min-h-[38px]">
                          {item.query}
                        </p>
                      </div>

                      {/* Card Footer with actions & metadata */}
                      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 px-5 py-3 border-t border-border/30 bg-muted/15 group-hover:bg-muted/20 transition-colors rounded-b-xl">
                        {/* Left column: metadata details */}
                        <div className="flex items-center gap-3 text-[11px] font-semibold text-muted-foreground/80 tracking-wide uppercase">
                          <div
                            className="flex items-center gap-1.5"
                            title="Quantidade de mensagens"
                          >
                            <MessageSquare className="size-3.5 text-muted-foreground/60" />
                            <span>{item.messagesCount} msgs</span>
                          </div>
                          <span className="text-muted-foreground/30">•</span>
                          <div
                            className="flex items-center gap-1.5"
                            title={`Pesquisa feita em ${item.date}`}
                          >
                            <Calendar className="size-3.5 text-muted-foreground/60" />
                            <span>{item.lastUpdateText}</span>
                          </div>
                        </div>

                        {/* Right column: actions */}
                        <div className="flex items-center gap-1 self-end xs:self-auto">
                          {/* Favorite button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleFavorite(item.id)}
                            className={cn(
                              "size-8 rounded-lg text-muted-foreground/70 transition-all duration-140",
                              item.isFavorite
                                ? "text-amber-500 hover:text-amber-600 bg-amber-500/10 hover:bg-amber-500/15"
                                : "hover:text-amber-500 hover:bg-muted",
                            )}
                            title={
                              item.isFavorite ? "Remover dos favoritos" : "Marcar como favorita"
                            }
                          >
                            <Star className={cn("size-4", item.isFavorite && "fill-current")} />
                          </Button>

                          {/* Share button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleShare(item.id)}
                            className="size-8 rounded-lg text-muted-foreground/70 hover:text-azure hover:bg-muted transition-all duration-140"
                            title="Compartilhar link de consulta"
                          >
                            <Share2 className="size-4" />
                          </Button>

                          {/* Delete button (Strictly using premium corporate red for destructive action) */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                            className="size-8 rounded-lg text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-all duration-140"
                            title="Excluir do histórico"
                          >
                            <Trash2 className="size-4" />
                          </Button>

                          <div className="h-4 w-px bg-border/50 mx-1" aria-hidden="true" />

                          {/* Open button */}
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpen(item.title)}
                            className="h-8 rounded-lg px-2.5 text-[11px] font-bold uppercase tracking-wider gap-1 hover:bg-muted border-border/80 text-foreground transition-all duration-140 shrink-0"
                          >
                            <Link to="/chat">Abrir</Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
