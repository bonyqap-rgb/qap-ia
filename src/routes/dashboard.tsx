import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  MessageSquarePlus,
  MessagesSquare,
  RefreshCw,
  Scale,
  Sparkle,
  Search,
  LayoutDashboard,
  Star,
  Share2,
  Download,
  Upload,
  Zap,
  ChevronRight,
  History,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { Button } from "@/components/ui/button";
import { BrandLockup, BrandLogo } from "@/components/brand-logo";
import { ApiErrorNotice } from "@/components/common/page-primitives";
import { StatusPill } from "@/components/common/stat-card";
import { Badge, Card, Container, EmptyState, ListRow, Panel, Section, Stat } from "@/components/ds";
import { LegalItem, type LegalReference } from "@/components/ds/legal-item";
import { cn } from "@/lib/utils";
import { useDocumentStatistics } from "@/hooks/use-documents";
import { useHealth } from "@/hooks/use-system";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — QAP IA" },
      {
        name: "description",
        content:
          "Painel institucional do QAP IA com indicadores de consultas, base legal indexada e integridade da plataforma.",
      },
      { property: "og:title", content: "Dashboard — QAP IA" },
      {
        property: "og:description",
        content:
          "Painel institucional do QAP IA com indicadores de consultas, base legal indexada e integridade da plataforma.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

/** Série de atividade apresentada no gráfico (camada visual do painel). */
const activityData = [
  { day: "Seg", consultas: 320 },
  { day: "Ter", consultas: 410 },
  { day: "Qua", consultas: 380 },
  { day: "Qui", consultas: 520 },
  { day: "Sex", consultas: 610 },
  { day: "Sáb", consultas: 240 },
  { day: "Dom", consultas: 180 },
];

const serviceLabels: Array<{ key: string; label: string }> = [
  { key: "api", label: "Backend (API)" },
  { key: "database", label: "Banco de dados" },
  { key: "ai", label: "Modelo de IA" },
  { key: "vector", label: "Índice vetorial" },
];

const legalHighlights: LegalReference[] = [
  { id: "rdpm", title: "Regulamento Disciplinar da PMESP", source: "RDPM", badge: "Disciplinar" },
  { id: "cpm", title: "Código Penal Militar", source: "Decreto-Lei 1.001/69", badge: "Penal" },
  { id: "i2pm", title: "Instrução I-2-PM", source: "I-2-PM", badge: "Operacional" },
  { id: "ctb", title: "Código de Trânsito Brasileiro", source: "Lei 9.503/97", badge: "Trânsito" },
];

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function DashboardPage() {
  const statistics = useDocumentStatistics();
  const health = useHealth();
  const loading = statistics.isLoading || health.isLoading;
  const online = health.data?.status === "online";
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = now.getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <Container size="wide" className="py-8 sm:py-12 space-y-12">
      {/* -------------------------------------------------------------- center command hero */}
      <section className="animate-rise">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-azure">
              <Zap className="h-3 w-3" />
              Centro de Comando
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {getGreeting()}, <span className="text-gradient-azure">Agente.</span>
            </h1>
            <p className="text-sm font-medium text-muted-foreground/80">
              {now.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
              <span className="mx-2 text-muted-foreground/30">•</span>
              {now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              tone={online ? "success" : "warning"}
              className="px-3 py-1 text-[10px] font-bold tracking-wider uppercase border-none bg-muted/50"
            >
              <span className="relative mr-2 flex size-1.5">
                <span
                  className={cn(
                    "absolute inline-flex size-full animate-ping rounded-full opacity-60",
                    online ? "bg-emerald-500" : "bg-amber-500",
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex size-1.5 rounded-full",
                    online ? "bg-emerald-500" : "bg-amber-500",
                  )}
                />
              </span>
              {online ? "Sistemas Online" : "Instabilidade Detectada"}
            </Badge>
            <div className="h-4 w-px bg-border/60" />
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-7 w-7 rounded-full border-2 border-background bg-muted ring-1 ring-border/50"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- atalhos inteligentes */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7 animate-rise [animation-delay:100ms]">
        {[
          { label: "Nova Consulta", icon: MessageSquarePlus, url: "/chat", tone: "azure" },
          { label: "Base Legal", icon: Scale, url: "/knowledge" },
          { label: "Histórico", icon: History, url: "/history" },
          { label: "Favoritos", icon: Star, url: "/favorites" },
          { label: "Compartilhados", icon: Share2, url: "/shared" },
          { label: "Exportações", icon: Download, url: "/exports" },
          { label: "Upload", icon: Upload, url: "/admin/rag" },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.url}
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/50 bg-card/40 p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:border-azure/30 hover:bg-azure/5 hover:shadow-subtle"
          >
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground transition-colors duration-200 group-hover:bg-azure/10 group-hover:text-azure",
              item.tone === "azure" && "bg-azure/10 text-azure"
            )}>
              <item.icon className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 group-hover:text-foreground">
              {item.label}
            </span>
          </Link>
        ))}
      </section>

      {/* -------------------------------------------------- campo de consulta */}
      <div className="relative mx-auto w-full max-w-4xl space-y-8 text-center animate-rise [animation-delay:100ms]">
        <div className="space-y-3">
          <Badge tone="accent" className="px-3 py-1">Central de Pesquisa</Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground leading-tight sm:text-4xl">
            O que você deseja <span className="text-gradient-azure">consultar?</span>
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Acesse instantaneamente a base legal indexada e obtenha respostas fundamentadas com referências exatas da legislação militar.
          </p>
        </div>

        <div className="relative mx-auto max-w-3xl px-6">
          <div className="group relative flex h-16 items-center rounded-2xl border border-border/80 bg-card px-5 shadow-medium transition-all duration-300 ease-[var(--ease-standard)] focus-within:border-azure/70 focus-within:ring-azure/20 focus-within:ring-4 focus-within:shadow-elevated hover:border-border/100">
            <div className="flex items-center gap-2 absolute left-5">
              <Search
                className="size-6 text-muted-foreground transition-colors duration-200 group-focus-within:text-azure"
                aria-hidden
              />
              <Badge tone="info" className="hidden sm:inline-flex bg-azure/5 text-azure border-azure/20 text-[9px] uppercase tracking-wider font-bold h-5">Global</Badge>
            </div>
            <input
              type="search"
              placeholder="Pesquise em toda a plataforma (leis, documentos, histórico)..."
              className="h-full w-full min-w-0 bg-transparent pl-24 pr-16 text-[16px] text-foreground outline-none placeholder:text-muted-foreground/60 transition-all duration-200"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  window.location.href = `/chat?q=${encodeURIComponent(e.currentTarget.value.trim())}`;
                }
              }}
            />
            <kbd className="pointer-events-none absolute right-5 hidden select-none rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1 font-mono text-[11px] font-bold text-muted-foreground/80 sm:block shadow-sm">
              ENTER
            </kbd>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 px-6 text-[12px] text-muted-foreground">
          <span className="font-bold text-muted-foreground/40 uppercase tracking-[0.15em] text-[10px] mr-2">
            Sugestões:
          </span>
          {[
            { label: "Uso da Força", q: "Explique os níveis do uso progressivo da força pela polícia militar." },
            { label: "Regulamento Disciplinar", q: "Quais os prazos e fases do processo administrativo disciplinar militar?" },
            { label: "Abordagem Policial", q: "Qual o procedimento correto para abordagem de veículo suspeito?" },
            { label: "Código Penal Militar", q: "Quais as principais excludentes de ilicitude aplicáveis no CPM?" },
          ].map((chip) => (
            <Link
              key={chip.label}
              to={`/chat?q=${encodeURIComponent(chip.q)}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-4 py-2 font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-azure/40 hover:bg-azure/5 hover:text-foreground hover:shadow-subtle"
            >
              <Sparkle className="size-3 text-azure animate-pulse" />
              {chip.label}
            </Link>
          ))}
        </div>
      </div>


      {(statistics.isUnavailable || health.isUnavailable) && (
        <div className="mt-6">
          <ApiErrorNotice
            error={statistics.error ?? health.error}
            onRetry={() => {
              statistics.refetch();
              health.refetch();
            }}
          />
        </div>
      )}

      {/* ------------------------------------------------------- visão geral */}
      <Section title="Visão geral" description="Indicadores consolidados da plataforma">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            label="Consultas hoje"
            value="—"
            hint="Métrica não exposta pela API"
            icon={MessagesSquare}
            loading={loading}
          />
          <Stat
            label="Consultas no mês"
            value="—"
            hint="Métrica não exposta pela API"
            icon={CalendarDays}
            loading={loading}
          />
          <Stat
            label="Documentos indexados"
            value={statistics.data?.indexedDocuments.toLocaleString("pt-BR") ?? "—"}
            hint={`${statistics.data?.totalChunks.toLocaleString("pt-BR") ?? "0"} chunks vetorizados`}
            icon={CheckCircle2}
            tone="success"
            loading={loading}
          />
          <Stat
            label="Última atualização"
            value={formatDate(statistics.data?.lastIndexedAt)}
            hint={health.data?.version ? `Backend ${health.data.version}` : "Versão indisponível"}
            icon={RefreshCw}
            loading={loading}
          />
        </div>
      </Section>

      {/* ------------------------------------- atividade recente & continuar trabalhando */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel
          title="Atividade Recente"
          description="Timeline de ações do workspace"
          className="lg:col-span-2"
          bodyClassName="px-6 py-6"
        >
          <div className="space-y-6">
            {[
              { type: 'consulta', title: 'Consulta sobre RDPM', time: '10 min atrás', status: 'completo' },
              { type: 'documento', title: 'Upload de I-2-PM', time: '2 horas atrás', status: 'indexado' },
              { type: 'exportacao', title: 'Relatório de Sindicância', time: 'Ontem', status: 'pdf' },
            ].map((item, i) => (
              <div key={i} className="relative flex items-start gap-4 pb-6 last:pb-0">
                {i !== 2 && <div className="absolute left-[15px] top-[30px] h-full w-px bg-border/60" />}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/50 ring-4 ring-background">
                  {item.type === 'consulta' && <MessagesSquare className="h-3.5 w-3.5 text-azure" />}
                  {item.type === 'documento' && <FileText className="h-3.5 w-3.5 text-amber-500" />}
                  {item.type === 'exportacao' && <Download className="h-3.5 w-3.5 text-emerald-500" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-bold text-foreground">{item.title}</p>
                    <span className="text-[10px] font-medium text-muted-foreground">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="accent" className="bg-muted/50 text-[9px] font-bold uppercase tracking-wider">{item.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Continuar Trabalhando"
          description="Retomar tarefas recentes"
          bodyClassName="p-3"
        >
          <div className="space-y-1">
            {[
              { label: 'Nova Sindicância 042/24', detail: '3 mensagens · Atualizado há 1h', icon: MessagesSquare },
              { label: 'Estatuto dos Militares', detail: 'Documento favoritado', icon: Star },
              { label: 'CPP Militar', detail: 'Base jurídica', icon: Scale },
            ].map((item, i) => (
              <button key={i} className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-muted/60">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/40 text-muted-foreground group-hover:bg-azure/10 group-hover:text-azure">
                  <item.icon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-foreground">{item.label}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{item.detail}</p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-muted-foreground" />
              </button>
            ))}
          </div>
        </Panel>
      </div>

      {/* ------------------------------------------------------- kpis modernos */}
      <Section title="Métricas Workspace" description="Desempenho operacional da conta">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Consultas Mês" value="1.240" hint="+12% em relação ao mês anterior" icon={MessagesSquare} tone="azure" />
          <Stat label="Documentos Base" value={statistics.data?.indexedDocuments.toLocaleString("pt-BR") ?? "—"} hint="Total de arquivos indexados" icon={FileText} tone="warning" />
          <Stat label="Favoritos" value="48" hint="Consultas salvas no workspace" icon={Star} tone="accent" />
          <Stat label="Exportações" value="156" hint="Total de PDFs gerados" icon={Download} tone="success" />
        </div>
      </Section>

      {/* ------------------------------------- base jurídica & destaques */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel
          title="Base Jurídica"
          description="Resumo da inteligência indexada"
          actions={<Button variant="ghost" size="sm" className="text-xs">Ver Todas</Button>}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-azure" />
                <span className="text-[12px] font-medium text-foreground">Legislação PMESP</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[12px] font-medium text-foreground">Código Penal Militar</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-[12px] font-medium text-foreground">Portarias CG</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/30 p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{statistics.data?.indexedDocuments ?? '—'}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Documentos Ativos</p>
            </div>
          </div>
        </Panel>

        <Panel
          title="Destaques & Novidades"
          description="Atualizações da plataforma"
        >
          <div className="space-y-4">
            <div className="group relative flex items-start gap-3 rounded-xl border border-border/40 bg-card/40 p-3 transition-colors hover:border-azure/30">
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-azure animate-pulse" />
              <div>
                <p className="text-[12px] font-bold text-foreground">Novo Módulo de Auditoria</p>
                <p className="text-[11px] text-muted-foreground">Acompanhe o log de consultas em tempo real com maior precisão.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-transparent p-3 grayscale opacity-60">
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-muted" />
              <div>
                <p className="text-[12px] font-bold text-foreground">Integração Vade Mecum</p>
                <p className="text-[11px] text-muted-foreground">Em breve: consulta direta a toda a base do Vade Mecum Militar.</p>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* ------------------------------------------------------- integridade sistema */}
      <Section title="Integridade do Sistema" description="Status dos serviços em tempo real">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel bodyClassName="grid grid-cols-2 gap-4 p-5">
            {serviceLabels.map((svc) => {
              const service = health.data?.services?.[svc.key];
              return (
                <div key={svc.key} className="flex items-center justify-between rounded-xl border border-border/40 bg-card/40 px-4 py-3">
                  <span className="text-[11px] font-bold text-foreground">{svc.label}</span>
                  <div className="flex items-center gap-2">
                    <div className={cn("h-1.5 w-1.5 rounded-full", online ? "bg-emerald-500" : "bg-amber-500")} />
                    <span className="text-[10px] font-medium text-muted-foreground">{service?.latencyMs ? `${service.latencyMs}ms` : 'Online'}</span>
                  </div>
                </div>
              );
            })}
          </Panel>
          <Card className="flex flex-col items-center justify-center border-dashed bg-muted/20 text-center">
            <AlertCircle className="mb-2 h-5 w-5 text-muted-foreground/40" />
            <p className="text-[12px] font-medium text-muted-foreground">Manutenção programada</p>
            <p className="text-[10px] text-muted-foreground/60">Domingo, às 02:00 BRT</p>
          </Card>
        </div>
      </Section>
    </Container>
  );
}
