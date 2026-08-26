import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, FileText, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminCard, AdminPage } from "@/components/admin/admin-primitives";
import { ApiErrorNotice, EmptyState, ListSkeleton } from "@/components/common/page-primitives";
import { StatCard } from "@/components/common/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  useDocumentMutations,
  useDocumentStatistics,
  useDocuments,
  useIndexingHistory,
} from "@/hooks/use-documents";
import type { DocumentStatus } from "@/types/api";

export const Route = createFileRoute("/admin/base")({
  component: AdminBase,
});

const statusStyles: Partial<Record<DocumentStatus, string>> = {
  concluído:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  erro: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
};

function formatDateTime(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function AdminBase() {
  const documents = useDocuments();
  const statistics = useDocumentStatistics();
  const history = useIndexingHistory();
  const { remove, reindex } = useDocumentMutations();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | DocumentStatus>("all");

  /** Último erro real reportado pelo backend por documento (via /documents/history). */
  const documentErrors = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of history.data ?? []) {
      if (item.error && !map.has(item.documentName)) map.set(item.documentName, item.error);
    }
    return map;
  }, [history.data]);

  const rows = useMemo(
    () =>
      (documents.data ?? [])
        .filter((doc) => (status === "all" ? true : doc.status === status))
        .filter((doc) =>
          query.trim() ? (doc.name ?? "").toLowerCase().includes(query.trim().toLowerCase()) : true,
        ),
    [documents.data, query, status],
  );

  return (
    <AdminPage
      title="Base de Conhecimento"
      description="Gestão completa dos documentos indexados, filtros e histórico de processamento."
      icon={BookOpen}
      actions={
        <Button asChild size="sm">
          <Link to="/documents">
            <UploadCloud className="mr-1.5 h-4 w-4" />
            Enviar documentos
          </Link>
        </Button>
      }
    >
      {documents.isUnavailable && (
        <ApiErrorNotice error={documents.error} onRetry={documents.refetch} />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Documentos"
          value={statistics.data?.totalDocuments}
          icon={FileText}
          loading={statistics.isLoading}
        />
        <StatCard
          label="Indexados"
          value={statistics.data?.indexedDocuments}
          icon={BookOpen}
          loading={statistics.isLoading}
        />
        <StatCard
          label="Em processamento"
          value={statistics.data?.pendingDocuments}
          icon={RefreshCw}
          loading={statistics.isLoading}
        />
        <StatCard
          label="Chunks"
          value={(statistics.data?.totalChunks ?? 0).toLocaleString("pt-BR")}
          icon={FileText}
          loading={statistics.isLoading}
        />
      </div>

      <AdminCard title="Documentos" description={`${rows.length} registros`}>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar documento..."
            className="flex-1"
          />
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="aguardando">Aguardando</SelectItem>
              <SelectItem value="indexando">Indexando</SelectItem>
              <SelectItem value="concluído">Concluído</SelectItem>
              <SelectItem value="erro">Erro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {documents.isLoading ? (
          <ListSkeleton rows={5} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Nenhum documento encontrado"
            description="Ajuste os filtros ou envie novos arquivos para a base."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Documento</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead className="hidden sm:table-cell">Chunks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="max-w-[260px] font-medium">
                      <span className="block truncate">
                        {doc.name}
                        {doc.size && (
                          <span className="ml-2 text-[11px] text-muted-foreground">{doc.size}</span>
                        )}
                      </span>
                      {documentErrors.get(doc.name) && doc.status === "erro" && (
                        <span
                          className="mt-0.5 block truncate text-[11px] font-normal text-destructive"
                          title={documentErrors.get(doc.name) ?? undefined}
                        >
                          {documentErrors.get(doc.name)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {doc.category ?? "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">
                      {doc.chunks ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("font-normal", statusStyles[doc.status])}
                      >
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => reindex.mutate(doc.id)}
                          disabled={reindex.isPending}
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span className="sr-only">Reindexar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => remove.mutate(doc.id)}
                          disabled={remove.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </AdminCard>

      <AdminCard title="Histórico de indexações" description="Últimos processamentos executados">
        {history.data?.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Nenhuma indexação registrada"
            description="Assim que documentos forem processados, o histórico aparecerá aqui."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Documento</TableHead>
                  <TableHead className="hidden sm:table-cell">Início</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead className="hidden sm:table-cell">Chunks</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.data?.slice(0, 10).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="max-w-[220px] font-medium">
                      <span className="block truncate">{item.documentName}</span>
                      {item.error && (
                        <span
                          className="mt-0.5 block truncate text-[11px] font-normal text-destructive"
                          title={item.error}
                        >
                          {item.error}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {formatDateTime(item.startedAt)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.durationSeconds ? `${item.durationSeconds}s` : "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">
                      {item.chunks ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("font-normal", statusStyles[item.status])}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </AdminCard>
    </AdminPage>
  );
}
