import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FileText,
  Search,
  Eye,
  Trash2,
  RefreshCw,
  Download,
  UploadCloud,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  ApiOfflineNotice,
  EmptyState,
  ListSkeleton,
  PageHeader,
} from "@/components/common/page-primitives";
import { useDocumentMutations, useDocuments } from "@/hooks/use-documents";
import type { ApiDocument, DocumentStatus } from "@/types/api";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documentos — QAP IA" },
      {
        name: "description",
        content:
          "Gerencie todos os documentos jurídicos e administrativos indexados no QAP IA.",
      },
      { property: "og:title", content: "Documentos — QAP IA" },
      {
        property: "og:description",
        content:
          "Gerencie todos os documentos jurídicos e administrativos indexados no QAP IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DocumentsPage,
});

const statusMap: Record<
  DocumentStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  aguardando: {
    label: "Aguardando",
    icon: Clock,
    className: "bg-muted text-muted-foreground border-border",
  },
  indexando: {
    label: "Indexando",
    icon: Loader2,
    className: "bg-azure/10 text-azure-dark border-azure/30",
  },
  concluído: {
    label: "Indexado",
    icon: CheckCircle2,
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  },
  erro: {
    label: "Erro",
    icon: AlertCircle,
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
  },
};

type SortKey = "recent" | "name" | "chunks";

function StatusBadge({ status }: { status: DocumentStatus }) {
  const meta = statusMap[status] ?? statusMap.aguardando;
  const Icon = meta.icon;
  return (
    <Badge variant="outline" className={cn("gap-1 font-medium", meta.className)}>
      <Icon className={cn("h-3 w-3", status === "indexando" && "animate-spin")} />
      {meta.label}
    </Badge>
  );
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function UploadZone({
  onFiles,
  uploading,
  progress,
}: {
  onFiles: (files: File[]) => void;
  uploading: boolean;
  progress: number;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        onFiles(Array.from(e.dataTransfer.files));
      }}
      className={cn(
        "rounded-xl border border-dashed p-6 text-center transition-colors",
        dragging ? "border-azure bg-azure/5" : "border-border/70 bg-muted/20",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt"
        className="sr-only"
        onChange={(e) => {
          onFiles(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-azure/10 text-azure">
        <UploadCloud className="h-5 w-5" />
      </span>
      <p className="mt-3 text-sm font-medium text-foreground">
        Arraste arquivos aqui ou selecione do computador
      </p>
      <p className="mt-1 text-xs text-muted-foreground">PDF, DOCX ou TXT · até 50 MB por arquivo</p>
      <Button
        size="sm"
        variant="outline"
        className="mt-3"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Enviando..." : "Selecionar arquivos"}
      </Button>
      {uploading && <Progress value={progress} className="mx-auto mt-4 h-2 max-w-sm" />}
    </div>
  );
}

function DocumentsPage() {
  const { data: docs, isLoading, isDemo, refetch } = useDocuments();
  const { remove, reindex, upload } = useDocumentMutations();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<SortKey>("recent");
  const [view, setView] = useState<ApiDocument | null>(null);
  const [toDelete, setToDelete] = useState<ApiDocument | null>(null);
  const [progress, setProgress] = useState(0);

  const categories = useMemo(
    () => Array.from(new Set(docs.map((d) => d.category).filter(Boolean))) as string[],
    [docs],
  );

  const filtered = useMemo(() => {
    const list = docs.filter((d) => {
      const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || d.category === category;
      const matchesStatus = status === "all" || d.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });

    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "pt-BR");
      if (sort === "chunks") return (b.chunks ?? 0) - (a.chunks ?? 0);
      return (b.uploadedAt ?? "").localeCompare(a.uploadedAt ?? "");
    });
  }, [docs, query, category, status, sort]);

  const handleFiles = async (files: File[]) => {
    if (!files.length) return;
    setProgress(8);
    for (const [index, file] of files.entries()) {
      try {
        await upload.mutateAsync({ file });
      } catch {
        /* toast já emitido pelo hook */
      }
      setProgress(Math.round(((index + 1) / files.length) * 100));
    }
    setTimeout(() => setProgress(0), 600);
  };

  const exportCsv = () => {
    const header = "nome,categoria,status,paginas,chunks,enviado_em";
    const rows = filtered.map((d) =>
      [d.name, d.category ?? "", d.status, d.pages ?? 0, d.chunks ?? 0, d.uploadedAt ?? ""]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "qap-ia-documentos.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado.");
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8">
      <PageHeader
        title="Documentos"
        description="Catálogo institucional da base vetorial. Envie, pesquise, reindexe e acompanhe o status de indexação."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={exportCsv}>
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        }
      />

      {isDemo && <ApiOfflineNotice onRetry={refetch} />}

      <Card className="surface-panel mb-5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Enviar documentos</CardTitle>
          <CardDescription>
            Os arquivos são processados, divididos em chunks e vetorizados automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadZone
            onFiles={handleFiles}
            uploading={upload.isPending || progress > 0}
            progress={progress}
          />
        </CardContent>
      </Card>

      <Card className="surface-panel">
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <CardTitle className="text-base">Catálogo</CardTitle>
              <CardDescription>
                {filtered.length} de {docs.length} documentos
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  aria-label="Buscar documentos por nome"
                  placeholder="Buscar por nome..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-8 sm:w-56"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="sm:w-40" aria-label="Filtrar por categoria">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="sm:w-36" aria-label="Filtrar por status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  {Object.entries(statusMap).map(([key, meta]) => (
                    <SelectItem key={key} value={key}>
                      {meta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="sm:w-40" aria-label="Ordenar documentos">
                  <ArrowUpDown className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="name">Nome (A–Z)</SelectItem>
                  <SelectItem value="chunks">Mais chunks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <ListSkeleton rows={6} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Nenhum documento encontrado"
              description="Ajuste os filtros de busca ou envie um novo documento para a base de conhecimento."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead className="hidden md:table-cell">Categoria</TableHead>
                    <TableHead className="hidden lg:table-cell">Páginas</TableHead>
                    <TableHead className="hidden lg:table-cell">Chunks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Atualizado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((doc) => (
                    <TableRow key={doc.id} className="transition-colors hover:bg-muted/40">
                      <TableCell className="max-w-[260px]">
                        <div className="flex min-w-0 items-center gap-2">
                          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="truncate text-sm font-medium">{doc.name}</span>
                        </div>
                        {doc.size && (
                          <span className="ml-6 text-[11px] text-muted-foreground">{doc.size}</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {doc.category ?? "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{doc.pages ?? "—"}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{doc.chunks ?? "—"}</TableCell>
                      <TableCell>
                        <StatusBadge status={doc.status} />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {formatDate(doc.updatedAt ?? doc.uploadedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Ver detalhes de ${doc.name}`}
                                onClick={() => setView(doc)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Detalhes</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Reindexar ${doc.name}`}
                                disabled={reindex.isPending}
                                onClick={() => reindex.mutate(doc.id)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reindexar</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Excluir ${doc.name}`}
                                onClick={() => setToDelete(doc)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Excluir</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!view} onOpenChange={(open) => !open && setView(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="truncate">{view?.name}</DialogTitle>
            <DialogDescription>Detalhes de processamento e indexação.</DialogDescription>
          </DialogHeader>
          {view && (
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Categoria", view.category ?? "—"],
                ["Status", statusMap[view.status]?.label ?? view.status],
                ["Páginas", view.pages ?? "—"],
                ["Chunks", view.chunks ?? "—"],
                ["Tamanho", view.size ?? "—"],
                ["Enviado em", formatDate(view.uploadedAt)],
                ["Atualizado em", formatDate(view.updatedAt)],
                ["Responsável", view.uploadedBy ?? "—"],
              ].map(([label, value]) => (
                <div key={String(label)} className="min-w-0">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="truncate text-foreground">{String(value)}</dd>
                </div>
              ))}
            </dl>
          )}
          {view?.error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {view.error}
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setView(null)}>
              Fechar
            </Button>
            {view && (
              <Button
                className="gap-1.5"
                disabled={reindex.isPending}
                onClick={() => reindex.mutate(view.id)}
              >
                <RefreshCw className="h-4 w-4" />
                Reindexar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir documento?</AlertDialogTitle>
            <AlertDialogDescription>
              "{toDelete?.name}" e todos os seus chunks vetorizados serão removidos da base. Esta
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) remove.mutate(toDelete.id);
                setToDelete(null);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
