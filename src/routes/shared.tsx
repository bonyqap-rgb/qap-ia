import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Share2,
  MessageSquarePlus,
  Filter,
  Clock,
  User,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Container,
  EmptyState,
  Panel,
  Section,
  SearchField,
  ListRow,
  Badge,
  Card,
  Divider,
} from "@/components/ds";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shared")({
  head: () => ({
    meta: [
      { title: "Compartilhados — QAP IA" },
      {
        name: "description",
        content: "Consultas compartilhadas entre integrantes da equipe no QAP IA.",
      },
      { property: "og:title", content: "Compartilhados — QAP IA" },
      {
        property: "og:description",
        content: "Consultas compartilhadas entre integrantes da equipe no QAP IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SharedPage,
});

// Mock de dados para visualização premium
const MOCK_SHARED = [
  {
    id: "1",
    title: "Análise de Procedimento Disciplinar I-2-PM",
    type: "Parecer",
    author: "Cap PM Silva",
    sharedWith: "Seção de Justiça e Disciplina",
    date: "14 Mai 2026",
    status: "Finalizado",
  },
  {
    id: "2",
    title: "Consulta sobre Escala de Serviço Extraordinária",
    type: "Consulta",
    author: "Sgt PM Oliveira",
    sharedWith: "P-3/PM",
    date: "12 Mai 2026",
    status: "Em Revisão",
  },
  {
    id: "3",
    title: "Memorando de Diretrizes Operacionais (MDO)",
    type: "Documento",
    author: "Maj PM Souza",
    sharedWith: "Comando de Área",
    date: "10 Mai 2026",
    status: "Finalizado",
  },
];

function SharedPage() {
  const [search, setSearch] = useState("");
  const items = MOCK_SHARED.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.author.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Container
      size="wide"
      className="py-6 sm:py-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Compartilhados
          </h2>
          <p className="mt-0.5 text-footnote text-muted-foreground">
            Consultas e pareceres compartilhados com a sua equipe
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SearchField
            placeholder="Pesquisar na biblioteca…"
            className="w-full sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="size-4" />
          </Button>
        </div>
      </header>

      <div className="grid gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent" className="cursor-pointer">
            Todos
          </Badge>
          <Badge tone="neutral" className="cursor-pointer hover:bg-muted/80">
            Pareceres
          </Badge>
          <Badge tone="neutral" className="cursor-pointer hover:bg-muted/80">
            Consultas
          </Badge>
          <Badge tone="neutral" className="cursor-pointer hover:bg-muted/80">
            Documentos
          </Badge>
          <Divider orientation="vertical" className="mx-1 h-4" />
          <Badge tone="neutral" className="cursor-pointer hover:bg-muted/80">
            Recentemente Adicionados
          </Badge>
        </div>

        <Panel
          className="overflow-hidden p-1"
          title="Biblioteca de Compartilhamentos"
          description={
            items.length > 0
              ? `${items.length} itens encontrados`
              : "Nenhum compartilhamento disponível"
          }
        >
          {items.length > 0 ? (
            <div className="divide-y divide-border/40">
              {items.map((item) => (
                <div key={item.id} className="group relative">
                  <ListRow
                    icon={FileText}
                    title={
                      <span className="text-body font-semibold group-hover:text-azure transition-colors">
                        {item.title}
                      </span>
                    }
                    description={
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-0.5">
                        <span className="flex items-center gap-1.5 text-caption">
                          <User className="size-3 text-muted-foreground/70" />
                          {item.author}
                        </span>
                        <span className="flex items-center gap-1.5 text-caption">
                          <Share2 className="size-3 text-muted-foreground/70" />
                          {item.sharedWith}
                        </span>
                        <span className="flex items-center gap-1.5 text-caption">
                          <Clock className="size-3 text-muted-foreground/70" />
                          {item.date}
                        </span>
                      </div>
                    }
                    badge={
                      <Badge tone={item.status === "Finalizado" ? "success" : "warning"}>
                        {item.status}
                      </Badge>
                    }
                    className="py-4 hover:bg-azure/5"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="text-azure hover:bg-azure/10">
                      Visualizar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Share2}
              title={search ? "Nenhum resultado encontrado" : "Nada compartilhado ainda"}
              description={
                search
                  ? `Não encontramos nada para "${search}"`
                  : "As consultas compartilhadas com você aparecerão nesta área."
              }
              action={
                search ? (
                  <Button variant="outline" size="sm" onClick={() => setSearch("")}>
                    Limpar Pesquisa
                  </Button>
                ) : (
                  <Button asChild size="sm" className="gap-2">
                    <Link to="/chat">
                      <MessageSquarePlus className="size-4" />
                      Nova Consulta
                    </Link>
                  </Button>
                )
              }
              className="border-0 bg-transparent py-16"
            />
          )}
        </Panel>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card interactive padding="sm" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="size-8 rounded-lg bg-azure/10 flex items-center justify-center">
              <CheckCircle2 className="size-4 text-azure" />
            </div>
            <Badge tone="success">Novo</Badge>
          </div>
          <div>
            <h4 className="font-semibold text-body">Guia Rápido: RDPM</h4>
            <p className="text-caption text-muted-foreground">
              Compartilhado por Maj PM Oliveira para toda a corporação.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-between border-t border-border/40">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Manual
            </span>
            <span className="text-[10px] text-muted-foreground">2 horas atrás</span>
          </div>
        </Card>
      </div>
    </Container>
  );
}
