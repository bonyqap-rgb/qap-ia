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

      {/* ------------------------------------------------------- atividade */}
      <Section>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel
            title="Atividade"
            description="Consultas nos últimos 7 dias"
            className="lg:col-span-2"
            bodyClassName="px-4 py-5 sm:px-5"
          >
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="qapActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-azure)" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="var(--color-azure)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />
                  <XAxis
                    dataKey="day"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    stroke="var(--color-muted-foreground)"
                  />
                  <YAxis
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={32}
                    stroke="var(--color-muted-foreground)"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card)",
                      color: "var(--color-foreground)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="consultas"
                    stroke="var(--color-azure)"
                    strokeWidth={2}
                    fill="url(#qapActivity)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel
            title="Integridade dos serviços"
            description="Leitura em tempo real"
            bodyClassName="space-y-2 px-4 py-4"
          >
            {serviceLabels.map((svc) => {
              const service = health.data?.services?.[svc.key];
              return (
                <StatusPill
                  key={svc.key}
                  label={svc.label}
                  status={service?.status ?? health.data?.status}
                  detail={
                    service?.detail ?? (service?.latencyMs ? `${service.latencyMs} ms` : undefined)
                  }
                  loading={health.isLoading}
                />
              );
            })}
          </Panel>
        </div>
      </Section>

      {/* ------------------------------------- consultas recentes + base legal */}
      <Section>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel
            title="Consultas recentes"
            description="Suas últimas pesquisas"
            actions={
              <Button asChild variant="ghost" size="sm" className="gap-1 text-caption">
                <Link to="/history">
                  Histórico
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            }
            bodyClassName="px-3 py-3"
          >
            <EmptyState
              icon={MessagesSquare}
              title="Nenhuma consulta registrada"
              description="Suas consultas aparecerão aqui assim que você iniciar uma nova pesquisa."
              action={
                <Button asChild size="sm" className="gap-2">
                  <Link to="/chat">
                    <MessageSquarePlus className="size-4" />
                    Nova Consulta
                  </Link>
                </Button>
              }
              className="border-0 bg-transparent py-8"
            />
          </Panel>

          <Panel
            title="Base legal"
            description="Normas de referência da plataforma"
            actions={
              <Button asChild variant="ghost" size="sm" className="gap-1 text-caption">
                <Link to="/knowledge">
                  Ver tudo
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            }
          >
            {legalHighlights.map((ref) => (
              <LegalItem key={ref.id} reference={ref} />
            ))}
          </Panel>
        </div>
      </Section>

      {/* ------------------------------------------------------ cards inferiores */}
      <Section>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Card
            interactive
            padding="sm"
            className="group transition-all duration-200 hover:-translate-y-1 hover:border-azure/40 hover:shadow-medium border border-border/50 bg-card/60 backdrop-blur-md"
          >
            <div className="flex items-center gap-4 p-1">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border/50 bg-muted/40 text-muted-foreground/80 transition-colors duration-200 group-hover:border-azure/30 group-hover:text-azure">
                <FileText className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80">
                  Documentos na base
                </p>
                <p className="mt-0.5 text-headline font-bold text-foreground tabular-nums">
                  {statistics.data?.totalDocuments?.toLocaleString("pt-BR") ?? "—"} arquivos
                </p>
              </div>
            </div>
          </Card>
          <Card
            interactive
            padding="sm"
            className="group transition-all duration-200 hover:-translate-y-1 hover:border-azure/40 hover:shadow-medium border border-border/50 bg-card/60 backdrop-blur-md"
          >
            <div className="flex items-center gap-4 p-1">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border/50 bg-muted/40 text-muted-foreground/80 transition-colors duration-200 group-hover:border-azure/30 group-hover:text-azure">
                <Database className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80">
                  Páginas processadas
                </p>
                <p className="mt-0.5 text-headline font-bold text-foreground tabular-nums">
                  {statistics.data?.totalPages?.toLocaleString("pt-BR") ?? "—"} páginas
                </p>
              </div>
            </div>
          </Card>
          <Card
            interactive
            padding="sm"
            className="group transition-all duration-200 hover:-translate-y-1 hover:border-azure/40 hover:shadow-medium border border-border/50 bg-card/60 backdrop-blur-md"
          >
            <div className="flex items-center gap-4 p-1">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border/50 bg-muted/40 text-muted-foreground/80 transition-colors duration-200 group-hover:border-azure/30 group-hover:text-azure">
                <Clock className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80">
                  Pendentes de indexação
                </p>
                <p className="mt-0.5 text-headline font-bold text-foreground tabular-nums">
                  {statistics.data?.pendingDocuments?.toLocaleString("pt-BR") ?? "—"} documentos
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <p className="mt-8 flex items-center gap-1.5 text-caption text-muted-foreground">
        <Sparkle className="size-3.5 text-azure" aria-hidden />
        As respostas possuem caráter informativo e devem ser conferidas na legislação oficial.
      </p>
    </Container>
  );
}
