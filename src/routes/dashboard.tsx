import { createFileRoute, Link } from "@tanstack/react-router";
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
import { BrandLockup } from "@/components/brand-logo";
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

  return (
    <Container size="wide" className="py-6 sm:py-8">
      {/* -------------------------------------------------------------- hero */}
      <Card padding="lg" className="relative overflow-hidden bg-glow-azure">
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-5">
            <BrandLockup size={84} className="hidden shrink-0 sm:block" />
            <div className="min-w-0">
              <Badge tone={online ? "success" : "warning"}>
                <span className="relative flex size-1.5" aria-hidden>
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
                {online ? "Plataforma operacional" : "Integridade parcial"}
              </Badge>
              <h1 className="mt-3 font-display text-title2 font-semibold tracking-tight text-foreground sm:text-title1">
                Inteligência que apoia quem protege.
              </h1>
              <p className="mt-1.5 max-w-xl text-footnote text-muted-foreground">
                Pesquisa jurídica e administrativa com fundamentação normativa rastreável, pensada
                para a rotina operacional da tropa.
              </p>
            </div>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              asChild
              className="gap-2 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Link to="/chat">
                <MessageSquarePlus className="size-4" />
                Nova Consulta
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="gap-2 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Link to="/knowledge">
                <Scale className="size-4" />
                Explorar Base Legal
              </Link>
            </Button>
          </div>
        </div>
      </Card>

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card interactive padding="sm">
            <ListRow
              icon={FileText}
              title="Documentos na base"
              description={`${statistics.data?.totalDocuments?.toLocaleString("pt-BR") ?? "—"} arquivos`}
            />
          </Card>
          <Card interactive padding="sm">
            <ListRow
              icon={Database}
              title="Páginas processadas"
              description={`${statistics.data?.totalPages?.toLocaleString("pt-BR") ?? "—"} páginas`}
            />
          </Card>
          <Card interactive padding="sm">
            <ListRow
              icon={Clock}
              title="Pendentes de indexação"
              description={`${statistics.data?.pendingDocuments?.toLocaleString("pt-BR") ?? "—"} documentos`}
            />
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
