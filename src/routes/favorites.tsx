import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  Star,
  MessageSquarePlus,
  Search,
  Calendar,
  Share2,
  Bookmark,
  Sparkle,
  BookOpen,
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

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favoritos Premium — QAP IA" },
      {
        name: "description",
        content: "Sua biblioteca corporativa de consultas e normas de alta relevância no QAP IA.",
      },
      { property: "og:title", content: "Favoritos Premium — QAP IA" },
      {
        property: "og:description",
        content: "Sua biblioteca corporativa de consultas e normas de alta relevância no QAP IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FavoritesPage,
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
  category?: string;
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
    category: "Diretrizes Operacionais",
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
    category: "Administrativo",
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
    category: "Constitucional",
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
    category: "Direito Militar",
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
    category: "Jurisprudência",
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
    category: "Previdenciário",
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
    category: "Direito Penal Militar",
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
    category: "Constitucional",
  },
];

function FavoritesSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-hidden="true">
      <div className="space-y-4">
        <div className="h-5 w-24 rounded bg-muted/60" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((c) => (
            <div key={c} className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-2/3 rounded bg-muted/60" />
                  <div className="h-4 w-5/6 rounded bg-muted/40" />
                </div>
                <div className="size-6 rounded bg-muted/50" />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border/30">
                <div className="flex gap-4">
                  <div className="h-3 w-16 rounded bg-muted/40" />
                  <div className="h-3 w-12 rounded bg-muted/40" />
                </div>
                <div className="flex gap-1.5">
                  <div className="size-8 rounded-lg bg-muted/40" />
                  <div className="size-8 rounded-lg bg-muted/40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FavoritesPage() {
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
        localStorage.setItem("qap_history_conversations", JSON.stringify(INITIAL_CONVERSATIONS));
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

  // Get only favorited items
  const favorites = useMemo(() => {
    return conversations.filter((c) => c.isFavorite);
  }, [conversations]);

  // KPIs
  const stats = useMemo(() => {
    const total = favorites.length;
    const recent = favorites.filter((c) => c.isRecent).length;
    // Categorias distintas programaticamente tratadas
    const categoriesSet = new Set(
      favorites
        .map((c) => c.category)
        .filter((cat): cat is string => Boolean(cat) && cat !== "não especificado"),
    );
    const categoriesCount = categoriesSet.size;
    return { total, recent, categoriesCount };
  }, [favorites]);

  // Filtered favorites
  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) return favorites;
    const query = searchQuery.toLowerCase();
    return favorites.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.query.toLowerCase().includes(query) ||
        (c.category && c.category.toLowerCase().includes(query)),
    );
  }, [favorites, searchQuery]);

  // Grouped favorites (organizados utilizando os grupos existentes)
  const groupedFavorites = useMemo(() => {
    const groups: Record<string, Conversation[]> = {
      Hoje: [],
      Ontem: [],
      "Últimos 7 dias": [],
      "Este mês": [],
    };

    filteredFavorites.forEach((c) => {
      if (groups[c.group]) {
        groups[c.group].push(c);
      } else {
        const key = c.group || "Este mês";
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(c);
      }
    });

    return Object.entries(groups).filter(([_, items]) => items.length > 0);
  }, [filteredFavorites]);

  return (
    <Container size="wide" className="py-6 sm:py-8 space-y-6">
      {/* Top Header Block */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="grid size-7 place-items-center rounded-lg bg-amber-500/10 text-amber-500"
              aria-hidden="true"
            >
              <Star className="size-4 fill-amber-500" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Biblioteca Corporativa
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl leading-tight">
            Biblioteca de Favoritos
          </h1>
          <p className="text-caption sm:text-footnote text-muted-foreground max-w-xl leading-relaxed">
            Acesse e gerencie de forma ágil as consultas e normas marcadas como favoritas. Todas as
            fundamentações legais e o fluxo correspondente estão consolidados para acesso rápido.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
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
      {favorites.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat
            label="Itens Salvos"
            value={stats.total.toString()}
            hint="Consultas arquivadas"
            icon={Bookmark}
            tone="warning"
            loading={isLoading}
            interactive={false}
          />
          <Stat
            label="Atualizados Recentes"
            value={stats.recent.toString()}
            hint="Modificados recentemente"
            icon={Sparkle}
            tone="success"
            loading={isLoading}
            interactive={false}
          />
          <Stat
            label="Categorias Distintas"
            value={stats.categoriesCount.toString()}
            hint="Áreas do Direito e Atuação"
            icon={BookOpen}
            tone="info"
            loading={isLoading}
            interactive={false}
          />
        </div>
      )}

      {/* Filters & Search Control */}
      {favorites.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-muted/20 border border-border/50 rounded-xl p-3">
          <div className="flex-1 max-w-md">
            <SearchField
              placeholder="Filtrar favoritos por título, trecho ou categoria..."
              className="w-full h-10 bg-card border-border/60"
              shortcut={null}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />
          </div>
          <div className="flex items-center justify-end text-[12px] text-muted-foreground font-medium px-1">
            Exibindo{" "}
            <span className="text-foreground font-semibold mx-1">{filteredFavorites.length}</span>{" "}
            de <span className="text-foreground font-semibold mx-1">{favorites.length}</span>{" "}
            favoritos
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <div className="min-h-[300px]">
        {isLoading ? (
          <FavoritesSkeleton />
        ) : favorites.length === 0 ? (
          <div className="py-12 text-center max-w-md mx-auto">
            <EmptyState
              icon={Star}
              title="Sua biblioteca de favoritos está vazia"
              description="Salve consultas jurídicas e regulamentos importantes no histórico ou chat para acessá-los instantaneamente aqui."
              action={
                <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mt-4">
                  <Button asChild size="sm" className="gap-2 bg-gradient-azure shadow-azure">
                    <Link to="/chat">
                      <MessageSquarePlus className="size-4" />
                      Nova Consulta
                    </Link>
                  </Button>
                </div>
              }
              className="border border-dashed border-border/80 bg-muted/15 py-12 px-6 rounded-2xl"
            />
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="py-12 text-center max-w-md mx-auto">
            <EmptyState
              icon={Search}
              title="Nenhum favorito correspondente"
              description={`Não encontramos favoritos correspondentes a "${searchQuery}". Tente outros termos de pesquisa.`}
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
            {groupedFavorites.map(([groupName, items]) => (
              <div key={groupName} className="space-y-3.5">
                {/* Visual Section Group Label */}
                <div className="flex items-center gap-2 px-1">
                  <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
                    {groupName}
                  </h3>
                  <span className="h-px flex-1 bg-border/40" aria-hidden="true" />
                  <span className="text-[11px] font-bold text-muted-foreground/60 bg-muted/60 px-2 py-0.5 rounded-full">
                    {items.length} {items.length === 1 ? "favorito" : "favoritos"}
                  </span>
                </div>

                {/* Grid of Favorites */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => {
                    const cleanCategory =
                      item.category && item.category !== "não especificado" ? item.category : null;

                    return (
                      <Card
                        key={item.id}
                        interactive
                        padding="none"
                        className="group flex flex-col justify-between border-border/40 hover:border-azure/30 hover:shadow-subtle transition-all duration-200"
                      >
                        {/* Card Content Top */}
                        <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                          <div className="space-y-3">
                            {/* Badge and Star Header */}
                            <div className="flex items-center justify-between gap-2">
                              {cleanCategory ? (
                                <Badge
                                  tone="accent"
                                  className="text-[10px] uppercase tracking-wider h-5 px-2"
                                >
                                  {cleanCategory}
                                </Badge>
                              ) : (
                                <div className="h-5" /> // Keep alignment height consistent
                              )}

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleFavorite(item.id)}
                                className="size-8 rounded-full text-amber-500 hover:text-amber-600 bg-amber-500/10 hover:bg-amber-500/15 transition-all duration-140"
                                title="Remover dos favoritos"
                              >
                                <Star className="size-4 fill-current animate-scale" />
                              </Button>
                            </div>

                            {/* Title */}
                            <h4 className="font-display text-[15px] sm:text-base font-bold leading-snug tracking-tight text-foreground group-hover:text-azure transition-colors line-clamp-2">
                              {item.title}
                            </h4>

                            {/* Snippet (trecho da pergunta) */}
                            <p className="text-[12.5px] leading-relaxed text-muted-foreground line-clamp-3">
                              {item.query}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 px-5 py-3 border-t border-border/30 bg-muted/15 group-hover:bg-muted/20 transition-colors rounded-b-xl">
                          {/* Left metadata */}
                          <div className="flex items-center gap-2.5 text-[11px] font-semibold text-muted-foreground/80 tracking-wide uppercase">
                            <div className="flex items-center gap-1" title="Data da consulta">
                              <Calendar className="size-3.5 text-muted-foreground/60" />
                              <span>{item.date}</span>
                            </div>
                            <span className="text-muted-foreground/30">•</span>
                            <span title="Última atualização">{item.lastUpdateText}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 self-end xs:self-auto">
                            {/* Share action */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleShare(item.id)}
                              className="size-8 rounded-lg text-muted-foreground/70 hover:text-azure hover:bg-muted transition-all duration-140"
                              title="Compartilhar link de consulta"
                            >
                              <Share2 className="size-4" />
                            </Button>

                            <div className="h-4 w-px bg-border/50 mx-1" aria-hidden="true" />

                            {/* Open action */}
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
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
