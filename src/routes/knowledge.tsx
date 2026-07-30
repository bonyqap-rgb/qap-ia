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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ApiErrorNotice,
  EmptyState,
  PageHeader,
} from "@/components/common/page-primitives";
import { StatCard } from "@/components/common/stat-card";
import { useDocuments, useDocumentStatistics } from "@/hooks/use-documents";
import { chatService } from "@/services/chat.service";
import { cn } from "@/lib/utils";
import type { SearchResult } from "@/types/api";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Base de Conhecimento — QAP IA" },
      {
        name: "description",
        content:
          "Busca semântica nos documentos jurídicos e administrativos indexados no QAP IA.",
      },
      { property: "og:title", content: "Base de Conhecimento — QAP IA" },
      {
        property: "og:description",
        content:
          "Busca semântica nos documentos jurídicos indexados na base do QAP IA.",
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

function KnowledgePage() {
  const documents = useDocuments();
  const statistics = useDocumentStatistics();
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  const search = useMutation({
    mutationFn: (q: string) => chatService.search({ query: q, limit: 12 }),
  });

  const results: SearchResult[] = search.data ?? [];
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

  const stats = statistics.data;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:px-8">
      <PageHeader
        title="Base de Conhecimento"
        description="Pesquise semanticamente nos documentos indexados que alimentam as respostas do QAP IA."
        actions={
          <>
            <Button asChild variant="outline" className="gap-1.5">
              <Link to="/documents">
                <Upload className="h-4 w-4" />
                Gerenciar documentos
              </Link>
            </Button>
            <Button asChild className="gap-1.5 bg-gradient-azure text-primary-foreground">
              <Link to="/chat">
                <MessageSquare className="h-4 w-4" />
                Perguntar no chat
              </Link>
            </Button>
          </>
        }
      />

      {(documents.isUnavailable || statistics.isUnavailable) && (
        <ApiErrorNotice
          error={documents.error ?? statistics.error}
          onRetry={() => {
            documents.refetch();
            statistics.refetch();
          }}
        />
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Documentos"
          value={stats?.totalDocuments}
          loading={statistics.isLoading}
          icon={FileText}
        />
        <StatCard
          label="Indexados"
          value={stats?.indexedDocuments}
          loading={statistics.isLoading}
          icon={Database}
        />
        <StatCard
          label="Trechos vetoriais"
          value={stats?.totalChunks}
          icon={Layers}
          loading={statistics.isLoading}
        />
        <StatCard
          label="Páginas"
          value={stats?.totalPages}
          loading={statistics.isLoading}
          icon={BookOpen}
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Busca semântica</CardTitle>
          <CardDescription>
            A consulta é vetorizada e comparada com os trechos da base — não é apenas
            busca por palavra-chave.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(query);
            }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex.: prazo para conclusão do PAD militar"
                className="pl-9"
                aria-label="Buscar na base de conhecimento"
              />
            </div>
            <Button type="submit" disabled={search.isPending} className="gap-1.5">
              <Sparkles className="h-4 w-4" />
              {search.isPending ? "Buscando..." : "Buscar"}
            </Button>
          </form>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {examples.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => onSubmit(e)}
                className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-azure/45 hover:text-foreground"
              >
                {e}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {search.isPending ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : !submitted ? (
              <EmptyState
                icon={Search}
                title="Faça uma busca na base"
                description="Digite um tema jurídico ou administrativo para localizar os trechos mais relevantes."
              />
            ) : searchFailed ? (
              <ApiErrorNotice
                error={search.error instanceof ApiError ? search.error : null}
                onRetry={() => search.mutate(submitted)}
              />
            ) : results.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="Nenhum trecho encontrado"
                description="Tente reformular a consulta ou enviar novos documentos à base."
                action={
                  <Button asChild variant="outline" size="sm">
                    <Link to="/documents">Enviar documento</Link>
                  </Button>
                }
              />
            ) : (
              <>
                <ul className="space-y-2">
                  {results.map((r, i) => (
                    <li
                      key={r.chunkId ?? `${r.documentName}-${i}`}
                      className="rounded-xl border border-border/70 bg-card p-3.5 transition-colors hover:border-azure/45"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-2">
                          <FileText className="h-4 w-4 shrink-0 text-azure" />
                          <span className="truncate text-sm font-medium text-foreground">
                            {r.documentName}
                            {r.page ? ` · p. ${r.page}` : ""}
                          </span>
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "shrink-0 text-[10px] font-semibold",
                            r.score >= 0.8
                              ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : "border-border bg-muted/50 text-muted-foreground",
                          )}
                        >
                          {Math.round(r.score * 100)}% relevância
                        </Badge>
                      </div>
                      {r.snippet && (
                        <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
                          {r.snippet}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Cobertura da base</CardTitle>
          <CardDescription>Distribuição dos documentos por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Base vazia"
              description="Envie documentos para começar a alimentar o QAP IA."
              action={
                <Button asChild size="sm">
                  <Link to="/documents">Enviar documento</Link>
                </Button>
              }
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map(([name, count]) => (
                <Badge
                  key={name}
                  variant="outline"
                  className="gap-1.5 border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-foreground"
                >
                  {name}
                  <span className="text-muted-foreground">{count}</span>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
