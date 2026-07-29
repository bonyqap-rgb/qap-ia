import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  FileText,
  Search,
  Eye,
  Trash2,
  RefreshCw,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { mockDocuments, type DocStatus, type MockDocument } from "@/lib/mock-data";

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
  DocStatus,
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
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  },
  erro: {
    label: "Erro",
    icon: AlertCircle,
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
  },
};

function DocumentsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [view, setView] = useState<MockDocument | null>(null);
  const [toDelete, setToDelete] = useState<MockDocument | null>(null);
  const [docs, setDocs] = useState<MockDocument[]>(mockDocuments);

  const categories = useMemo(
    () => Array.from(new Set(mockDocuments.map((d) => d.category))),
    [],
  );

  const filtered = docs.filter((d) => {
    const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "all" || d.category === category;
    const matchesStatus = status === "all" || d.status === status;
    return matchesQuery && matchesCategory && matchesStatus;
  });

  const handleDelete = () => {
    if (!toDelete) return;
    setDocs((prev) => prev.filter((d) => d.id !== toDelete.id));
    toast.success(`"${toDelete.name}" removido`);
    setToDelete(null);
  };

  const handleReindex = (doc: MockDocument) => {
    toast.info(`Reindexação de "${doc.name}" agendada`);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Documentos
          </h1>
          <p className="text-sm text-muted-foreground">
            Catálogo institucional de documentos indexados. Pesquise, filtre e gerencie a base
            documental.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-base">Catálogo</CardTitle>
              <CardDescription>{filtered.length} de {docs.length} documentos</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-8 sm:w-64"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full sm:w-44">
                  <Filter className="mr-1 h-3.5 w-3.5" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas categorias</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos status</SelectItem>
                  <SelectItem value="concluído">Indexado</SelectItem>
                  <SelectItem value="indexando">Indexando</SelectItem>
                  <SelectItem value="aguardando">Aguardando</SelectItem>
                  <SelectItem value="erro">Erro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/60" />
              <div className="text-sm font-medium">Nenhum documento encontrado</div>
              <div className="text-xs text-muted-foreground">
                Ajuste os filtros ou envie novos arquivos pela Base de Conhecimento.
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Páginas</TableHead>
                    <TableHead className="text-right">Chunks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Upload</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((d) => {
                    const s = statusMap[d.status];
                    const Icon = s.icon;
                    return (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-navy/5 text-navy">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="truncate">{d.name}</div>
                              <div className="text-[11px] text-muted-foreground">{d.size}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {d.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{d.pages}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {d.chunks.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("gap-1", s.className)}>
                            <Icon
                              className={cn("h-3 w-3", d.status === "indexando" && "animate-spin")}
                            />
                            {s.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">{d.uploadedAt}</div>
                          <div className="text-[11px] text-muted-foreground">{d.uploadedBy}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setView(d)}
                              aria-label="Visualizar"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleReindex(d)}
                              aria-label="Reindexar"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => setToDelete(d)}
                              aria-label="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-navy" />
              {view?.name}
            </DialogTitle>
            <DialogDescription>Detalhes técnicos do documento indexado.</DialogDescription>
          </DialogHeader>
          {view && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Categoria</div>
                <div className="font-medium">{view.category}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Tamanho</div>
                <div className="font-medium">{view.size}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Páginas</div>
                <div className="font-medium">{view.pages}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Chunks</div>
                <div className="font-medium">{view.chunks.toLocaleString("pt-BR")}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Enviado em</div>
                <div className="font-medium">{view.uploadedAt}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Enviado por</div>
                <div className="font-medium">{view.uploadedBy}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setView(null)}>
              Fechar
            </Button>
            <Button className="bg-navy text-primary-foreground hover:bg-navy-light">
              <Download className="mr-1.5 h-4 w-4" />
              Baixar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover documento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá <span className="font-medium">{toDelete?.name}</span> e todos
              os seus chunks indexados. Não é possível desfazer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
