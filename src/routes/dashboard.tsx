import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  Database,
  Clock,
  Activity,
  CheckCircle2,
  Cpu,
  UploadCloud,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { cn } from "@/lib/utils";
import { PageHeader, ApiErrorNotice } from "@/components/common/page-primitives";
import { StatCard, StatusPill } from "@/components/common/stat-card";
import { useDocumentStatistics } from "@/hooks/use-documents";
import { useHealth } from "@/hooks/use-system";


export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — QAP IA" },
      {
        name: "description",
        content:
          "Painel institucional com métricas, integridade da plataforma e uso do QAP IA em tempo real.",
      },
      { property: "og:title", content: "Dashboard — QAP IA" },
      {
        property: "og:description",
        content:
          "Painel institucional com métricas, integridade da plataforma e uso do QAP IA em tempo real.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

const usageData = [
  { day: "Seg", consultas: 320, indexacoes: 12 },
  { day: "Ter", consultas: 410, indexacoes: 18 },
  { day: "Qua", consultas: 380, indexacoes: 8 },
  { day: "Qui", consultas: 520, indexacoes: 22 },
  { day: "Sex", consultas: 610, indexacoes: 15 },
  { day: "Sáb", consultas: 240, indexacoes: 4 },
  { day: "Dom", consultas: 180, indexacoes: 2 },
];

const topics = [
  { topic: "Disciplinar", total: 412 },
  { topic: "Abordagem", total: 318 },
  { topic: "Trânsito", total: 265 },
  { topic: "Processo", total: 199 },
  { topic: "Direitos", total: 142 },
];

const recentDocs = [
  { name: "Regulamento Disciplinar PMESP.pdf", status: "concluído", chunks: 428, when: "há 2 dias" },
  { name: "Código Penal Militar.pdf", status: "concluído", chunks: 812, when: "há 5 dias" },
  { name: "Portaria 001-2025.docx", status: "indexando", chunks: 34, when: "agora" },
  { name: "Manual de Abordagem.pdf", status: "aguardando", chunks: 0, when: "agora" },
];

const statusColor: Record<string, string> = {
  concluído:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  indexando: "bg-azure/10 text-azure-dark border-azure/30",
  aguardando: "bg-muted text-muted-foreground border-border",
  erro: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
};

const serviceLabels: Array<{ key: string; label: string }> = [
  { key: "api", label: "Backend (API)" },
  { key: "database", label: "Banco de dados" },
  { key: "ai", label: "Modelo de IA" },
  { key: "vector", label: "Índice vetorial" },
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
  const isDemo = statistics.isUnavailable || health.isUnavailable;

  const liveStats = [
    {
      label: "Total de documentos",
      value: statistics.data?.totalDocuments.toLocaleString("pt-BR"),
      hint: "Base documental completa",
      icon: FileText,
    },
    {
      label: "Documentos indexados",
      value: statistics.data?.indexedDocuments.toLocaleString("pt-BR"),
      hint: "Prontos para busca semântica",
      icon: CheckCircle2,
    },
    {
      label: "Documentos pendentes",
      value: statistics.data?.pendingDocuments.toLocaleString("pt-BR"),
      hint: "Aguardando ou em indexação",
      icon: Clock,
    },
    {
      label: "Chunks vetorizados",
      value: statistics.data?.totalChunks.toLocaleString("pt-BR"),
      hint: `${(statistics.data?.totalPages ?? 0).toLocaleString("pt-BR")} páginas processadas`,
      icon: Database,
    },
    {
      label: "Última indexação",
      value: formatDate(statistics.data?.lastIndexedAt),
      hint:
        statistics.data?.averageIndexingSeconds
          ? `Média de ${statistics.data?.averageIndexingSeconds}s por documento`
          : undefined,
      icon: UploadCloud,
    },
    {
      label: "Versão do backend",
      value: health.data?.version ?? "—",
      hint: health.data?.uptimeSeconds
        ? `Uptime ${(health.data?.uptimeSeconds / 3600).toFixed(1)}h`
        : "Sem dados de uptime",
      icon: Cpu,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8">
      <PageHeader
        title="Dashboard"
        description="Visão institucional de uso, integridade e produtividade da plataforma."
        actions={
          <Badge
            variant="outline"
            className={cn(
              "w-fit gap-1.5",
              health.data?.status === "online"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
            )}
          >
            <span className="relative flex h-2 w-2" aria-hidden>
              <span
                className={cn(
                  "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
                  health.data?.status === "online" ? "bg-emerald-500" : "bg-amber-500",
                )}
              />
              <span
                className={cn(
                  "relative inline-flex h-2 w-2 rounded-full",
                  health.data?.status === "online" ? "bg-emerald-500" : "bg-amber-500",
                )}
              />
            </span>
            {health.data?.status === "online"
              ? "Todos os serviços operacionais"
              : "Integridade parcial"}
          </Badge>
        }
      />

      {isDemo && <ApiErrorNotice onRetry={() => { statistics.refetch(); health.refetch(); }} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {liveStats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            hint={s.hint}
            icon={s.icon}
            loading={statistics.isLoading || health.isLoading}
          />
        ))}
      </div>


      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Consultas e indexações</CardTitle>
            <CardDescription>Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-navy)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-navy)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="c2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-azure)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-azure)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" fontSize={12} stroke="var(--color-muted-foreground)" />
                <YAxis fontSize={12} stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                    color: "var(--color-foreground)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="consultas"
                  stroke="var(--color-navy)"
                  strokeWidth={2}
                  fill="url(#c1)"
                />
                <Area
                  type="monotone"
                  dataKey="indexacoes"
                  stroke="var(--color-azure)"
                  strokeWidth={2}
                  fill="url(#c2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tópicos mais consultados</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topics} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" fontSize={12} stroke="var(--color-muted-foreground)" />
                <YAxis
                  dataKey="topic"
                  type="category"
                  fontSize={12}
                  width={80}
                  stroke="var(--color-muted-foreground)"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                    color: "var(--color-foreground)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="total" fill="var(--color-azure)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Documentos recentes</CardTitle>
              <CardDescription>Últimas indexações na base</CardDescription>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Documento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Chunks</TableHead>
                  <TableHead className="text-right">Atualizado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDocs.map((d) => (
                  <TableRow key={d.name}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {d.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("gap-1", statusColor[d.status])}>
                        {d.status === "concluído" && <CheckCircle2 className="h-3 w-3" />}
                        {d.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {d.chunks.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {d.when}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status dos serviços</CardTitle>
            <CardDescription>Integridade da infraestrutura em tempo real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {serviceLabels.map((svc) => {
              const service = health.data?.services?.[svc.key];
              return (
                <StatusPill
                  key={svc.key}
                  label={svc.label}
                  status={service?.status ?? health.data?.status}
                  detail={
                    service?.detail ??
                    (service?.latencyMs ? `${service.latencyMs} ms` : undefined)
                  }
                  loading={health.isLoading}
                />
              );
            })}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
