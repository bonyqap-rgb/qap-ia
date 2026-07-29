import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Star,
  Trash2,
  Download,
  MessageSquare,
  Pencil,
  MoreVertical,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
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
import { mockConversations, type MockConversation } from "@/lib/mock-data";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Histórico — QAP IA" },
      {
        name: "description",
        content: "Histórico pesquisável de conversas com o assistente QAP IA.",
      },
      { property: "og:title", content: "Histórico — QAP IA" },
      {
        property: "og:description",
        content: "Histórico pesquisável de conversas com o assistente QAP IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<MockConversation[]>(mockConversations);
  const [query, setQuery] = useState("");
  const [renameTarget, setRenameTarget] = useState<MockConversation | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MockConversation | null>(null);

  const filtered = items.filter((c) =>
    (c.title + " " + c.preview).toLowerCase().includes(query.toLowerCase()),
  );
  const favorites = filtered.filter((c) => c.favorite);

  const toggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c)),
    );
  };

  const openRename = (c: MockConversation) => {
    setRenameTarget(c);
    setRenameValue(c.title);
  };

  const confirmRename = () => {
    if (!renameTarget || !renameValue.trim()) return;
    setItems((prev) =>
      prev.map((c) =>
        c.id === renameTarget.id ? { ...c, title: renameValue.trim() } : c,
      ),
    );
    toast.success("Conversa renomeada");
    setRenameTarget(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    toast.success("Conversa excluída");
    setDeleteTarget(null);
  };

  const renderList = (list: MockConversation[]) =>
    list.length === 0 ? (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <MessageSquare className="h-10 w-10 text-muted-foreground/60" />
        <div className="text-sm font-medium">Nada por aqui ainda</div>
        <div className="text-xs text-muted-foreground">
          Comece uma conversa em <Link to="/" className="text-navy underline">Chat Jurídico</Link>.
        </div>
      </div>
    ) : (
      <ul className="divide-y divide-border/60">
        {list.map((c) => (
          <li key={c.id} className="group flex items-start gap-3 py-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy/5 text-navy">
              <MessageSquare className="h-4 w-4" />
            </div>
            <Link
              to="/"
              className="min-w-0 flex-1 rounded-md px-1 py-0.5 hover:bg-muted/40"
            >
              <div className="flex items-center gap-2">
                <div className="truncate text-sm font-semibold text-foreground">
                  {c.title}
                </div>
                {c.favorite && <Star className="h-3.5 w-3.5 fill-azure text-azure" />}
              </div>
              <div className="mt-0.5 truncate text-xs text-muted-foreground">
                {c.preview}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{c.updatedAt}</span>
                <span>·</span>
                <Badge
                  variant="outline"
                  className="h-4 px-1.5 text-[10px] font-medium"
                >
                  {c.messages} msgs
                </Badge>
              </div>
            </Link>
            <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label={c.favorite ? "Desfavoritar" : "Favoritar"}
                onClick={() => toggleFavorite(c.id)}
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    c.favorite ? "fill-azure text-azure" : "text-muted-foreground",
                  )}
                />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Mais">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => openRename(c)}>
                    <Pencil className="mr-2 h-3.5 w-3.5" /> Renomear
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => toast.success("Conversa exportada (.md)")}
                  >
                    <Download className="mr-2 h-3.5 w-3.5" /> Exportar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setDeleteTarget(c)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" /> Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>
    );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Histórico
        </h1>
        <p className="text-sm text-muted-foreground">
          Pesquise, favorite e organize suas conversas anteriores com o QAP IA.
        </p>
      </div>

      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-base">Conversas</CardTitle>
              <CardDescription>{filtered.length} resultado(s)</CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar no histórico..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="fav" className="gap-1.5">
                <Star className="h-3 w-3" />
                Favoritas
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-3">
              {renderList(filtered)}
            </TabsContent>
            <TabsContent value="fav" className="mt-3">
              {renderList(favorites)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!renameTarget} onOpenChange={(o) => !o && setRenameTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renomear conversa</DialogTitle>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="Novo título"
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameTarget(null)}>
              Cancelar
            </Button>
            <Button
              onClick={confirmRename}
              className="bg-navy text-primary-foreground hover:bg-navy-light"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir conversa?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.title}" será removida permanentemente do histórico.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
