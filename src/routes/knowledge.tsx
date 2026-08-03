import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  BookOpen,
  Database,
  FileText,
  Layers,
  MessageSquare,
  Search,
  SearchX,
  Sparkles,
  Upload,
  Scale,
  Check,
  Copy,
  ChevronRight,
} from "lucide-react";

import { Container, Card, Badge, Button, Tooltip, EmptyState, Stat } from "@/components/ds";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiErrorNotice } from "@/components/common/page-primitives";
import { useDocuments, useDocumentStatistics } from "@/hooks/use-documents";
import { ApiError } from "@/services/api-client";
import { chatService } from "@/services/chat.service";
import { cn } from "@/lib/utils";
import type { SearchResult, ApiDocument } from "@/types/api";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Base Legal Premium — QAP IA" },
      {
        name: "description",
        content: "Módulo estratégico de consulta e busca semântica jurídica no acervo do QAP IA.",
      },
      { property: "og:title", content: "Base Legal Premium — QAP IA" },
      {
        property: "og:description",
        content: "Módulo estratégico de consulta e busca semântica jurídica no acervo do QAP IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: KnowledgePage,
});

const examples = [
  "prazo para instauração de sindicância",
  "uso progressivo da força",
  "transgressão disciplinar grave",
  "direitos do preso na abordagem",
];

type LegalReferenceInfo = {
  article?: string;
  paragraph?: string;
  chapter?: string;
  inciso?: string;
  documentName?: string;
};

/**
 * Sanitiza strings, removendo e ocultando referências dinâmicas contendo 'não especificado'.
 * Retorna string vazia se o valor contém 'não especificado' (case-insensitive).
 */
function sanitizeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value).trim();
  if (/n[ãa]o\s+especificado/i.test(str)) {
    return "";
  }
  return str;
}

/**
 * Analisa o snippet e o nome do documento para tentar extrair referências legais de forma elegante.
 */
function parseLegalReferences(snippet: string, docName?: string): LegalReferenceInfo {
  const result: LegalReferenceInfo = {
    documentName: sanitizeText(docName),
  };

  if (!snippet) return result;

  // 1. Procurar por Artigo (Art. ou Artigo seguido de número ou único)
  const artMatch =
    snippet.match(/art\.?\s*(\d+º?|único)/i) || snippet.match(/artigo\s*(\d+º?|único)/i);
  if (artMatch) {
    result.article = artMatch[1];
  }

  // 2. Procurar por Parágrafo (§ ou parágrafo seguido de número ou único)
  const parMatch =
    snippet.match(/§\s*(\d+º?|único)/i) || snippet.match(/parágrafo\s*(único|\d+º?)/i);
  if (parMatch) {
    result.paragraph = parMatch[1];
  }

  // 3. Procurar por Capítulo (Cap. ou Capítulo seguido de número romano/arábico)
  const capMatch =
    snippet.match(/cap\.?\s*([I|V|X|L|C|D|M]+|\d+)/i) ||
    snippet.match(/capítulo\s*([I|V|X|L|C|D|M]+|\d+)/i);
  if (capMatch) {
    result.chapter = capMatch[1];
  }

  // 4. Procurar por Inciso (Inciso seguido de número romano)
  const incMatch = snippet.match(/inciso\s*([I|V|X|L|C|D|M]+)/i);
  if (incMatch) {
    result.inciso = incMatch[1];
  }

  return result;
}

function KnowledgePage() {
  const documents = useDocuments();
  const statistics = useDocumentStatistics();
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  // Filtros locais de resultado
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedScore, setSelectedScore] = useState("all"); // 'all', 'high' (>=80%), 'medium' (>=50%)
  const [sortBy, setSortBy] = useState("relevance"); // 'relevance', 'document'

  // Estado de leitura (Visualização de documento longo)
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const search = useMutation({
    mutationFn: (q: string) => chatService.search({ query: q, limit: 12 }),
  });

  const results = useMemo<SearchResult[]>(() => search.data ?? [], [search.data]);
  const searchFailed = search.isError;

  const onSubmit = (value: string) => {
    const q = value.trim();
    if (!q) return;
    setQuery(q);
    setSubmitted(q);
    search.mutate(q);
  };

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of documents.data ?? []) {
      const key = d.category ?? "Sem categoria";
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [documents.data]);

  // Mapa de documento por nome/id para extração de metadados
  const docMap = useMemo(() => {
    const map = new Map<string, ApiDocument>();
    const docsList = documents.data ?? [];
    for (const d of docsList) {
      if (d.id) map.set(d.id.toLowerCase(), d);
      if (d.name) map.set(d.name.toLowerCase(), d);
    }
    return map;
  }, [documents.data]);

  const stats = statistics.data;

  // Filtragem e ordenação dos resultados de busca
  const filteredResults = useMemo(() => {
    let list = [...results];

    // Aplicar filtro de categoria
    if (selectedCategory !== "all") {
      list = list.filter((r) => {
        const doc = r.documentId
          ? docMap.get(r.documentId.toLowerCase())
          : r.documentName
            ? docMap.get(r.documentName.toLowerCase())
            : null;
        const cat = doc?.category ?? "Sem categoria";
        return cat === selectedCategory;
      });
    }

    // Aplicar filtro de score de relevância
    if (selectedScore === "high") {
      list = list.filter((r) => r.score >= 0.8);
    } else if (selectedScore === "medium") {
      list = list.filter((r) => r.score >= 0.5);
    }

    // Aplicar ordenação
    if (sortBy === "document") {
      list.sort((a, b) => a.documentName.localeCompare(b.documentName));
    } else {
      list.sort((a, b) => b.score - a.score);
    }

    return list;
  }, [results, selectedCategory, selectedScore, sortBy, docMap]);

  // Extrair categorias exclusivas presentes nos resultados retornados
  const resultCategories = useMemo(() => {
    const set = new Set<string>();
    for (const r of results) {
      const doc = r.documentId
        ? docMap.get(r.documentId.toLowerCase())
        : r.documentName
          ? docMap.get(r.documentName.toLowerCase())
          : null;
      const cat = doc?.category ?? "Sem categoria";
      set.add(cat);
    }
    return Array.from(set);
  }, [results, docMap]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    toast.success("Trecho copiado para a área de transferência!");
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <Container className="py-8 space-y-10">
      {/* 1. CABEÇALHO PREMIUM */}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-azure tracking-wide text-xs font-bold uppercase">
            <Scale className="size-4" />
            <span>Módulo de Base Legal Premium</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Acervo Normativo & Jurídico
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Explore o repositório regulatório corporativo através de buscas semânticas vetoriais.
            Consulte trechos, leis, estatutos e referências instantaneamente.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-10 rounded-xl px-4 border-border/70 hover:bg-muted/30"
          >
            <Link to="/documents" className="gap-2">
              <Upload className="size-4 text-muted-foreground" />
              <span>Gerenciar Acervo</span>
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="h-10 rounded-xl px-4 bg-gradient-azure text-primary-foreground shadow-azure"
          >
            <Link to="/chat" className="gap-2">
              <MessageSquare className="size-4" />
              <span>Perguntar no Chat</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* ERRO DE CONEXÃO DA API */}
      {(documents.isUnavailable || statistics.isUnavailable) && (
        <ApiErrorNotice
          error={documents.error ?? statistics.error}
          onRetry={() => {
            documents.refetch();
            statistics.refetch();
          }}
        />
      )}

      {/* 2. STATS GRID */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="Documentos Ativos"
          value={stats?.totalDocuments ?? "—"}
          loading={statistics.isLoading}
          icon={FileText}
          tone="accent"
        />
        <Stat
          label="Base Indexada"
          value={stats?.indexedDocuments ?? "—"}
          loading={statistics.isLoading}
          icon={Database}
          tone="success"
        />
        <Stat
          label="Trechos Vetoriais"
          value={stats?.totalChunks ?? "—"}
          loading={statistics.isLoading}
          icon={Layers}
          tone="info"
        />
        <Stat
          label="Total de Páginas"
          value={stats?.totalPages ?? "—"}
          loading={statistics.isLoading}
          icon={BookOpen}
          tone="neutral"
        />
      </section>

      {/* 3. CAMPO DE BUSCA PREMIUM */}
      <Card
        padding="lg"
        className="border border-border/50 bg-gradient-to-b from-card to-muted/20 shadow-soft"
      >
        <div className="space-y-4">
          <div>
            <h2 className="font-display text-[16px] font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="size-4.5 text-azure animate-pulse" />
              <span>Pesquisa Semântica Premium</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Nossa inteligência entende o contexto e o significado das suas frases — não apenas
              palavras-chave isoladas.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(query);
            }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative min-w-0 flex-1 group">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground group-focus-within:text-azure transition-colors" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite um tema, art. ou dúvida (ex: prazo para instauração de sindicância)"
                className="h-11 w-full rounded-xl border border-border/70 bg-muted/40 pl-11 pr-14 text-[14px] text-foreground outline-none transition-all placeholder:text-muted-foreground/80 hover:border-border focus:border-azure/50 focus:bg-card focus:ring-2 focus:ring-azure/10"
                aria-label="Buscar na base legal"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 select-none rounded-md border border-border/70 bg-card px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:block">
                Enter
              </kbd>
            </div>
            <Button
              type="submit"
              disabled={search.isPending}
              className="h-11 rounded-xl px-6 bg-gradient-azure shadow-azure font-medium tracking-tight"
            >
              {search.isPending ? (
                <>
                  <span className="size-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Buscando...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Analisar Base
                </>
              )}
            </Button>
          </form>

          {/* Sugestões de exemplo */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mr-1">
              Consultas comuns:
            </span>
            {examples.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => onSubmit(e)}
                className="rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-[12px] font-medium text-muted-foreground transition-all hover:border-azure/40 hover:bg-azure/5 hover:text-azure-dark dark:hover:text-azure-light"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* 4. RESULTADOS & NAVEGAÇÃO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLUNA ESQUERDA: RESULTADOS DE BUSCA */}
        <div className="lg:col-span-8 space-y-6">
          {submitted && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/30 pb-4">
              <div>
                <h3 className="font-display text-[15px] font-semibold text-foreground">
                  Resultados para <span className="text-azure">"{submitted}"</span>
                </h3>
                <p className="text-caption text-muted-foreground mt-0.5">
                  Encontramos {filteredResults.length} trechos correspondentes
                </p>
              </div>

              {/* FILTROS LOCAIS E ORDENAÇÃO */}
              <div className="flex flex-wrap gap-2">
                {resultCategories.length > 0 && (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-lg border border-border/80 bg-card px-2.5 py-1.5 text-[12px] font-medium text-foreground outline-none focus:border-azure/45"
                    aria-label="Filtrar por Categoria"
                  >
                    <option value="all">Todas as Categorias</option>
                    {resultCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  value={selectedScore}
                  onChange={(e) => setSelectedScore(e.target.value)}
                  className="rounded-lg border border-border/80 bg-card px-2.5 py-1.5 text-[12px] font-medium text-foreground outline-none focus:border-azure/45"
                  aria-label="Filtrar por Relevância"
                >
                  <option value="all">Qualquer Relevância</option>
                  <option value="high">Alta (≥ 80%)</option>
                  <option value="medium">Média (≥ 50%)</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-border/80 bg-card px-2.5 py-1.5 text-[12px] font-medium text-foreground outline-none focus:border-azure/45"
                  aria-label="Ordenar por"
                >
                  <option value="relevance">Mais Relevante</option>
                  <option value="document">Por Documento</option>
                </select>
              </div>
            </div>
          )}

          {/* ESTADO CARREGANDO */}
          {search.isPending ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Skeleton className="size-8 rounded-lg" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-40 rounded" />
                        <Skeleton className="h-3 w-20 rounded" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-16 w-full rounded" />
                </Card>
              ))}
            </div>
          ) : !submitted ? (
            /* ESTADO INICIAL VAZIO */
            <EmptyState
              icon={Scale}
              title="Consulte a Base Legal"
              description="Digite um termo ou pergunta jurídica no campo de busca para encontrar as fundamentações normativas mais relevantes para seu caso."
            />
          ) : searchFailed ? (
            <ApiErrorNotice
              error={search.error instanceof ApiError ? search.error : null}
              onRetry={() => search.mutate(submitted)}
            />
          ) : filteredResults.length === 0 ? (
            /* SEM RESULTADOS */
            <EmptyState
              icon={SearchX}
              title="Nenhum resultado localizado"
              description="Nenhum trecho de documento atendeu aos filtros selecionados. Tente reformular sua busca ou remover os filtros."
              action={
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedScore("all");
                  }}
                  className="mt-2 border-border/70 text-xs rounded-lg"
                >
                  Limpar Filtros
                </Button>
              }
            />
          ) : (
            /* LISTA DE CARDS JURÍDICOS */
            <div className="space-y-4">
              {filteredResults.map((r, i) => {
                const doc = r.documentId
                  ? docMap.get(r.documentId.toLowerCase())
                  : r.documentName
                    ? docMap.get(r.documentName.toLowerCase())
                    : null;
                const category = doc?.category ?? "Direito Normativo";

                // Sanitização completa de metadados
                const cleanDocName = sanitizeText(r.documentName) || "Documento Jurídico";
                const cleanPage = sanitizeText(r.page);

                // Extração automática de referências legais
                const legalInfo = parseLegalReferences(r.snippet, cleanDocName);

                return (
                  <Card
                    key={r.chunkId ?? `${r.documentName}-${i}`}
                    interactive
                    onClick={() => setSelectedResult(r)}
                    className="border border-border/40 hover:border-azure/40 bg-card p-5 group transition-all"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/20 pb-3.5 mb-3.5">
                      <div className="flex gap-3 min-w-0 flex-1">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-border/50 bg-muted/40 text-azure transition-colors group-hover:border-azure/30 group-hover:bg-azure/5">
                          <Scale className="size-4.5" />
                        </span>
                        <div className="min-w-0">
                          <h4 className="truncate text-[14px] font-semibold text-foreground tracking-tight group-hover:text-azure transition-colors">
                            {cleanDocName}
                          </h4>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                              {category}
                            </span>
                            {cleanPage && (
                              <span className="text-[11px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                                Página {cleanPage}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* BADGE DE RELEVÂNCIA (AZURE OU EMERALD, NUNCA VERMELHO) */}
                      <Badge
                        tone={r.score >= 0.8 ? "success" : "accent"}
                        className="shrink-0 text-[11px] font-semibold tracking-tight h-6 rounded-md px-2"
                      >
                        {Math.round(r.score * 100)}% relevância
                      </Badge>
                    </div>

                    {/* SNIPPET COM ÓTIMA TIPOGRAFIA */}
                    {r.snippet && (
                      <p className="line-clamp-3 text-[13.5px] leading-relaxed text-muted-foreground/90 font-normal">
                        {r.snippet}
                      </p>
                    )}

                    {/* REFERÊNCIAS JURÍDICAS INTERATIVAS SE DISPONÍVEIS */}
                    {(legalInfo.article ||
                      legalInfo.paragraph ||
                      legalInfo.chapter ||
                      legalInfo.inciso) && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3.5 border-t border-border/20">
                        <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider mr-1">
                          Referências Detectadas:
                        </span>

                        {legalInfo.chapter && (
                          <Tooltip content="Capítulo normativo detectado no texto">
                            <span className="inline-flex items-center rounded-md bg-azure/5 border border-azure/20 px-2 py-0.5 text-[11px] font-medium text-azure-dark dark:text-azure-light">
                              Cap. {legalInfo.chapter}
                            </span>
                          </Tooltip>
                        )}

                        {legalInfo.article && (
                          <Tooltip content="Artigo jurídico correspondente">
                            <span className="inline-flex items-center rounded-md bg-azure/5 border border-azure/20 px-2 py-0.5 text-[11px] font-medium text-azure-dark dark:text-azure-light">
                              Art. {legalInfo.article}
                            </span>
                          </Tooltip>
                        )}

                        {legalInfo.paragraph && (
                          <Tooltip content="Parágrafo legal detectado">
                            <span className="inline-flex items-center rounded-md bg-azure/5 border border-azure/20 px-2 py-0.5 text-[11px] font-medium text-azure-dark dark:text-azure-light">
                              § {legalInfo.paragraph}
                            </span>
                          </Tooltip>
                        )}

                        {legalInfo.inciso && (
                          <Tooltip content="Inciso / Cláusula regulamentadora">
                            <span className="inline-flex items-center rounded-md bg-azure/5 border border-azure/20 px-2 py-0.5 text-[11px] font-medium text-azure-dark dark:text-azure-light">
                              Inciso {legalInfo.inciso}
                            </span>
                          </Tooltip>
                        )}
                      </div>
                    )}

                    {/* INDICAÇÃO DE LEITURA COMPLETA */}
                    <div className="flex items-center justify-end gap-1 text-[11px] font-medium text-azure mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Expandir leitura</span>
                      <ChevronRight className="size-3.5" />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* COLUNA DIREITA: COBERTURA DA BASE & INDEXAÇÕES */}
        <div className="lg:col-span-4 space-y-6">
          <Card padding="default" className="border border-border/40 bg-card">
            <div className="border-b border-border/20 pb-3 mb-4">
              <h3 className="font-display text-[15px] font-semibold text-foreground">
                Cobertura do Acervo
              </h3>
              <p className="text-caption text-muted-foreground mt-0.5">
                Distribuição quantitativa de documentos indexados
              </p>
            </div>

            {categories.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Sem categorias"
                description="Envie e categorize seus documentos para mapear a cobertura da base."
                action={
                  <Button asChild size="sm" variant="outline" className="mt-2 text-xs h-8">
                    <Link to="/documents">Adicionar Documento</Link>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-2.5">
                {categories.map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between group py-0.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="size-2 rounded-full bg-azure" />
                      <span className="text-[13px] font-medium text-foreground truncate">
                        {name}
                      </span>
                    </div>
                    <Badge
                      tone="neutral"
                      className="px-2 py-0.5 text-[11px] font-semibold text-muted-foreground group-hover:bg-muted transition-colors"
                    >
                      {count} {count === 1 ? "doc" : "docs"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card padding="default" className="border border-border/40 bg-card">
            <h3 className="font-display text-[14px] font-semibold text-foreground flex items-center gap-2 mb-3">
              <Database className="size-4 text-azure" />
              <span>Garantia de Atualização</span>
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              O QAP IA realiza a sincronização em tempo real com as novas portarias e publicações
              administrativas. Qualquer alteração ou novo envio de documento é refletido
              instantaneamente nesta base jurídica de conhecimento semântico.
            </p>
            <div className="mt-4 pt-4 border-t border-border/20 flex justify-between items-center text-[11px] text-muted-foreground">
              <span>Sincronização Ativa</span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-emerald-600 font-semibold dark:text-emerald-400">
                  100% Operacional
                </span>
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* 5. INTERACTIVE READER DRAWER FOR LONG TEXTS (SHEET) */}
      <Sheet open={!!selectedResult} onOpenChange={(open) => !open && setSelectedResult(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl h-full flex flex-col p-6 bg-card border-l border-border/40 shadow-overlay"
        >
          {selectedResult && (
            <>
              <SheetHeader className="border-b border-border/20 pb-4.5 text-left">
                <div className="flex items-center gap-1.5 text-azure tracking-wider text-[11px] font-bold uppercase mb-1">
                  <Scale className="size-3.5" />
                  <span>Leitura do Documento</span>
                </div>
                <SheetTitle className="text-lg font-bold tracking-tight text-foreground text-left">
                  {sanitizeText(selectedResult.documentName) || "Documento Jurídico"}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground text-left mt-0.5">
                  Visualização detalhada e contextualizada do trecho da base vetorial.
                </SheetDescription>
              </SheetHeader>

              {/* Corpo da leitura em tipografia extremamente confortável */}
              <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-thin">
                {/* Metadados adicionais */}
                <div className="grid grid-cols-2 gap-3.5 bg-muted/35 rounded-xl p-3.5 border border-border/20 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Categoria
                    </span>
                    <span className="font-semibold text-foreground mt-0.5 block">
                      {(() => {
                        const doc = selectedResult.documentId
                          ? docMap.get(selectedResult.documentId.toLowerCase())
                          : selectedResult.documentName
                            ? docMap.get(selectedResult.documentName.toLowerCase())
                            : null;
                        return doc?.category ?? "Direito Normativo";
                      })()}
                    </span>
                  </div>
                  {sanitizeText(selectedResult.page) && (
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Página
                      </span>
                      <span className="font-semibold text-foreground mt-0.5 block">
                        Página {sanitizeText(selectedResult.page)}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Relevância da Busca
                    </span>
                    <span className="font-semibold text-foreground mt-0.5 block flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      {Math.round(selectedResult.score * 100)}% de correspondência
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Chunk ID
                    </span>
                    <span className="font-mono text-muted-foreground mt-0.5 block truncate">
                      {selectedResult.chunkId ?? "—"}
                    </span>
                  </div>
                </div>

                {/* Conteúdo do Snippet em formato de documento legal */}
                <div className="space-y-3.5">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Trecho do Texto / Fundamentação:
                  </span>
                  <div className="rounded-xl border border-border/30 bg-card p-5.5 shadow-sm">
                    {/* Linha vertical de estilo de citação premium */}
                    <p className="text-[14.5px] leading-relaxed text-foreground/95 font-normal border-l-4 border-azure pl-4.5 italic">
                      "{selectedResult.snippet}"
                    </p>
                  </div>
                </div>

                {/* Referências do trecho */}
                {(() => {
                  const legal = parseLegalReferences(
                    selectedResult.snippet,
                    selectedResult.documentName,
                  );
                  if (!legal.article && !legal.paragraph && !legal.chapter && !legal.inciso)
                    return null;
                  return (
                    <div className="space-y-2.5">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Referências Identificadas:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {legal.chapter && (
                          <span className="inline-flex items-center gap-1.5 rounded-xl bg-azure/5 border border-azure/25 px-3 py-1 text-xs font-semibold text-azure-dark dark:text-azure-light">
                            Capítulo {legal.chapter}
                          </span>
                        )}
                        {legal.article && (
                          <span className="inline-flex items-center gap-1.5 rounded-xl bg-azure/5 border border-azure/25 px-3 py-1 text-xs font-semibold text-azure-dark dark:text-azure-light">
                            Artigo {legal.article}
                          </span>
                        )}
                        {legal.paragraph && (
                          <span className="inline-flex items-center gap-1.5 rounded-xl bg-azure/5 border border-azure/25 px-3 py-1 text-xs font-semibold text-azure-dark dark:text-azure-light">
                            Parágrafo {legal.paragraph}
                          </span>
                        )}
                        {legal.inciso && (
                          <span className="inline-flex items-center gap-1.5 rounded-xl bg-azure/5 border border-azure/25 px-3 py-1 text-xs font-semibold text-azure-dark dark:text-azure-light">
                            Inciso {legal.inciso}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Botões de Ação na Base da Leitura */}
              <div className="border-t border-border/20 pt-4.5 flex items-center justify-between gap-3">
                <Button
                  onClick={() => handleCopy(selectedResult.snippet)}
                  variant="outline"
                  className="flex-1 h-10 rounded-xl gap-2 text-xs border-border/70 hover:bg-muted/30"
                >
                  {copiedText ? (
                    <>
                      <Check className="size-4 text-emerald-500" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-4 text-muted-foreground" />
                      <span>Copiar Trecho</span>
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setSelectedResult(null)}
                  className="flex-1 h-10 rounded-xl text-xs bg-gradient-azure text-primary-foreground font-semibold"
                >
                  <span>Concluir Leitura</span>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </Container>
  );
}
