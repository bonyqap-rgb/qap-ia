import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import {
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  FolderOpen,
  Search,
  BookOpen,
  Layers,
  Database,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { mockCategories } from "@/lib/mock-data";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Base de Conhecimento — QAP IA" },
      {
        name: "description",
        content:
          "Gerencie documentos jurídicos e administrativos utilizados pelo QAP IA.",
      },
      { property: "og:title", content: "Base de Conhecimento — QAP IA" },
      {
        property: "og:description",
        content:
          "Gerencie documentos jurídicos e administrativos utilizados pelo QAP IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: KnowledgePage,
});

type DocStatus = "aguardando" | "indexando" | "concluído" | "erro";
type Doc = {
  id: string;
  name: string;
  size: string;
  status: DocStatus;
  progress: number;
  updatedAt: string;
};

const initialDocs: Doc[] = [
  { id: "1", name: "Regulamento Disciplinar PMESP.pdf", size: "2.4 MB", status: "concluído", progress: 100, updatedAt: "há 2 dias" },
  { id: "2", name: "Código Penal Militar.pdf", size: "5.1 MB", status: "concluído", progress: 100, updatedAt: "há 5 dias" },
  { id: "3", name: "Portaria 001-2025.docx", size: "412 KB", status: "indexando", progress: 68, updatedAt: "agora" },
  { id: "4", name: "Manual de Abordagem.pdf", size: "1.8 MB", status: "aguardando", progress: 0, updatedAt: "agora" },
  { id: "5", name: "documento-corrompido.pdf", size: "230 KB", status: "erro", progress: 0, updatedAt: "há 1 hora" },
];

const statusMap: Record<
  DocStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  aguardando: { label: "Aguardando", icon: Clock, className: "bg-muted text-muted-foreground border-border" },
  indexando: { label: "Indexando", icon: Loader2, className: "bg-gold/10 text-gold-dark border-gold/30" },
  concluído: {
    label: "Concluído",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  },
  erro: {
    label: "Erro",
    icon: AlertCircle,
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
  },
};

function KnowledgePage() {
  const [docs, setDocs] = useState<Doc[]>(initialDocs);
  const [dragOver, setDragOver] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    if (!arr.length) return;
    const newDocs: Doc[] = arr.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(2)} MB`,
      status: "aguardando",
      progress: 0,
      updatedAt: "agora",
    }));
    setDocs((prev) => [...newDocs, ...prev]);
    toast.success(`${newDocs.length} arquivo(s) adicionado(s)`);
    newDocs.forEach((d) => {
      setTimeout(() => {
        setDocs((prev) => prev.map((x) => (x.id === d.id ? { ...x, status: "indexando", progress: 15 } : x)));
        const iv = setInterval(() => {
          setDocs((prev) =>
            prev.map((x) => {
              if (x.id !== d.id) return x;
              const next = Math.min(100, x.progress + 20);
              return { ...x, progress: next, status: next >= 100 ? "concluído" : "indexando" };
            }),
          );
        }, 700);
        setTimeout(() => clearInterval(iv), 4500);
      }, 400);
    });
  }, []);

  const handleDelete = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    toast.success("Documento removido");
  };

  const filtered = docs.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));
  const totalChunks = mockCategories.reduce((s, c) => s + c.chunks, 0);
  const totalDocs = mockCategories.reduce((s, c) => s + c.docs, 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:px-8">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          <BookOpen className="h-6 w-6 text-navy" />
          Base de Conhecimento
        </h1>
        <p className="text-sm text-muted-foreground">
          Gestão institucional da base documental usada para enriquecer as respostas do QAP IA.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Categorias", value: mockCategories.length, icon: Layers },
          { label: "Documentos", value: totalDocs, icon: FileText },
          { label: "Chunks", value: totalChunks.toLocaleString("pt-BR"), icon: Database },
          { label: "Integridade", value: "98%", icon: TrendingUp },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy/5 text-navy">
                <s.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-lg font-bold text-foreground">{s.value}</div>
                <div className="text-[11px] font-medium text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card
        className={cn(
          "border-2 border-dashed transition-all",
          dragOver ? "border-gold bg-gold/5 shadow-gold" : "border-border bg-card/50",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
      >
        <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-navy/5 text-navy">
            <Upload className="h-6 w-6" />
          </div>
          <div>
            <div className="text-base font-semibold text-foreground">
              Arraste e solte seus arquivos aqui
            </div>
            <div className="text-sm text-muted-foreground">
              Ou clique no botão abaixo para selecionar. PDF, DOCX, TXT até 20 MB.
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.docx,.txt,.doc"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <Button
            onClick={() => inputRef.current?.click()}
            className="mt-1 gap-2 bg-navy text-primary-foreground hover:bg-navy-light"
          >
            <FolderOpen className="h-4 w-4" />
            Selecionar arquivos
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Categorias</CardTitle>
            <CardDescription>Organização temática da base</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {mockCategories.map((c) => (
                <li
                  key={c.name}
                  className="flex items-center justify-between rounded-lg border border-border/60 p-3 transition hover:border-gold hover:bg-gold/5"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-foreground">{c.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {c.docs} docs · {c.chunks.toLocaleString("pt-BR")} chunks
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-medium">
                    {c.updatedAt}
                  </Badge>
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="mt-4 w-full"
            >
              <Link to="/documents">Ver todos os documentos</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <div>
              <CardTitle className="text-lg">Documentos recentes</CardTitle>
              <CardDescription>{docs.length} arquivos na base</CardDescription>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar documento..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div className="text-sm font-medium text-foreground">
                  Nenhum documento encontrado
                </div>
                <div className="text-xs text-muted-foreground">
                  Ajuste a busca ou envie novos arquivos.
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-border/60">
                {filtered.map((d) => {
                  const s = statusMap[d.status];
                  const Icon = s.icon;
                  return (
                    <li key={d.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy/5 text-navy">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-foreground">{d.name}</div>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{d.size}</span>
                            <span>·</span>
                            <span>{d.updatedAt}</span>
                          </div>
                          {d.status === "indexando" && (
                            <Progress value={d.progress} className="mt-2 h-1" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:ml-3">
                        <Badge variant="outline" className={cn("gap-1", s.className)}>
                          <Icon className={cn("h-3 w-3", d.status === "indexando" && "animate-spin")} />
                          {s.label}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(d.id)}
                          aria-label="Excluir documento"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
