import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, MessageSquarePlus, FileJson, FileText, FileCode, Clock, HardDrive, Hash, Filter } from "lucide-react";
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
  Divider
} from "@/components/ds";

export const Route = createFileRoute("/exports")({
  head: () => ({
    meta: [
      { title: "Exportações — QAP IA" },
      {
        name: "description",
        content: "Relatórios e consultas exportadas a partir do QAP IA.",
      },
      { property: "og:title", content: "Exportações — QAP IA" },
      {
        property: "og:description",
        content: "Relatórios e consultas exportadas a partir do QAP IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ExportsPage,
});

// Mock de dados para visualização premium
const MOCK_EXPORTS = [
  {
    id: "1",
    name: "Relatório_Consolidado_I-2-PM_2026.pdf",
    format: "PDF",
    date: "15 Mai 2026",
    status: "Concluído",
    size: "1.2 MB",
    origin: "Chat"
  },
  {
    id: "2",
    name: "Transcrição_Consulta_Escala_Maio.docx",
    format: "DOCX",
    date: "14 Mai 2026",
    status: "Concluído",
    size: "450 KB",
    origin: "Chat"
  },
  {
    id: "3",
    name: "Dados_Estatísticos_Produção_P3.xlsx",
    format: "XLSX",
    date: "12 Mai 2026",
    status: "Processando",
    size: "---",
    origin: "Dashboard"
  },
  {
    id: "4",
    name: "Referência_Legal_RDPM_V2.pdf",
    format: "PDF",
    date: "10 Mai 2026",
    status: "Concluído",
    size: "2.8 MB",
    origin: "Conhecimento"
  }
];

function ExportsPage() {
  const [search, setSearch] = useState("");
  const items = MOCK_EXPORTS.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "PDF": return FileText;
      case "XLSX": return FileCode;
      case "DOCX": return FileText;
      default: return FileJson;
    }
  };

  return (
    <Container size="wide" className="py-6 sm:py-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Exportações</h2>
          <p className="mt-0.5 text-footnote text-muted-foreground">Arquivos gerados a partir das suas consultas</p>
        </div>

        
        <div className="flex items-center gap-2">
          <SearchField 
            placeholder="Pesquisar arquivos…" 
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
          <Badge tone="accent" className="cursor-pointer">Todos</Badge>
          <Badge tone="neutral" className="cursor-pointer hover:bg-muted/80">PDF</Badge>
          <Badge tone="neutral" className="cursor-pointer hover:bg-muted/80">Documentos</Badge>
          <Badge tone="neutral" className="cursor-pointer hover:bg-muted/80">Planilhas</Badge>
          <Divider orientation="vertical" className="mx-1 h-4" />
          <Badge tone="neutral" className="cursor-pointer hover:bg-muted/80">Hoje</Badge>
          <Badge tone="neutral" className="cursor-pointer hover:bg-muted/80">Esta Semana</Badge>
        </div>

        <Panel 
          className="overflow-hidden p-1"
          title="Central de Arquivos" 
          description={items.length > 0 ? `${items.length} exportações registradas` : "Nenhuma exportação disponível"}
        >
          {items.length > 0 ? (
            <div className="divide-y divide-border/40">
              {items.map((item) => (
                <div key={item.id} className="group relative">
                  <ListRow
                    icon={getFormatIcon(item.format)}
                    title={
                      <span className="text-body font-semibold group-hover:text-azure transition-colors">
                        {item.name}
                      </span>
                    }
                    description={
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-0.5">
                        <span className="flex items-center gap-1.5 text-caption">
                          <Hash className="size-3 text-muted-foreground/70" />
                          {item.format}
                        </span>
                        <span className="flex items-center gap-1.5 text-caption">
                          <HardDrive className="size-3 text-muted-foreground/70" />
                          {item.size}
                        </span>
                        <span className="flex items-center gap-1.5 text-caption">
                          <Clock className="size-3 text-muted-foreground/70" />
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1.5 text-caption">
                          <Download className="size-3 text-muted-foreground/70" />
                          Origem: {item.origin}
                        </span>
                      </div>
                    }
                    badge={
                      <Badge tone={item.status === "Concluído" ? "success" : "warning"}>
                        {item.status}
                      </Badge>
                    }
                    className="py-4 hover:bg-azure/5"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        Excluir
                      </Button>
                      <Button variant="ghost" size="sm" className="text-azure hover:bg-azure/10 gap-1.5">
                        <Download className="size-3" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Download}
              title={search ? "Nenhum arquivo encontrado" : "Nenhuma exportação disponível"}
              description={search ? `Não encontramos arquivos para "${search}"` : "Ao exportar uma consulta, o arquivo gerado ficará listado aqui."}
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
    </Container>
  );
}

