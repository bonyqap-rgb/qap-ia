import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  Database,
  MessageSquare,
  Clock,
  Activity,
  TrendingUp,
  CheckCircle2,
  Users,
  Cpu,
  UploadCloud,
  AlertTriangle,
  Layers,
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
import { systemStatus } from "@/lib/mock-data";

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

const stats = [
  {
    label: "Documentos indexados",
    value: "128",
    delta: "+12 este mês",
    icon: FileText,
    color: "bg-navy/5 text-navy",
  },
  {
    label: "Páginas processadas",
    value: "9.842",
    delta: "+412 esta semana",
    icon: Layers,
    color: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  },
  {
    label: "Chunks vetorizados",
    value: "4.821",
    delta: "+318 esta semana",
    icon: Database,
    color: "bg-gold/10 text-gold-dark",
  },
  {
    label: "Consultas realizadas",
    value: "12.940",
    delta: "+8% vs semana anterior",
    icon: MessageSquare,
    color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  {
    label: "Usuários ativos",
    value: "42",
    delta: "+3 esta semana",
    icon: Users,
    color: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
  },
  {
    label: "Tempo médio de resposta",
    value: "1,4s",
    delta: "-0,2s vs média",
    icon: Clock,
    color: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  },
  {
    label: "Último upload",
    value: "agora",
    delta: "Portaria 001-2025.docx",
    icon: UploadCloud,
    color: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300",
  },
  {
    label: "Modelo em uso",
    value: "Gemini",
    delta: "gemini-flash-latest",
    icon: Cpu,
    color: "bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300",
  },
];

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
  indexando: "bg-gold/10 text-gold-dark border-gold/30",
  aguardando: "bg-muted text-muted-foreground border-border",
  erro: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
};

const svcMeta: Record<
  string,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  online: {
    label: "Operacional",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  degraded: {
    label: "Degradado",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    icon: AlertTriangle,
  },
  offline: {
    label: "Offline",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
    icon: AlertTriangle,
  },
};

function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Visão institucional de uso, integridade e produtividade da plataforma.
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit gap-1.5 border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Todos os serviços operacionais
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="overflow-hidden transition hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={cn("grid h-10 w-10 place-items-center rounded-lg", s.color)}>
                  <s.icon className="h-5 w-5" />
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                {s.value}
              </div>
              <div className="mt-1 text-xs font-medium text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-2 truncate text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                {s.delta}
              </div>
            </CardContent>
          </Card>
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
                    <stop offset="0%" stopColor="var(--color-gold)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0} />
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
                  stroke="var(--color-gold)"
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
                <Bar dataKey="total" fill="var(--color-gold)" radius={[0, 6, 6, 0]} />
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
            <CardDescription>Integridade da infraestrutura</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {systemStatus.map((s) => {
              const meta = svcMeta[s.status];
              const Icon = meta.icon;
              return (
                <div
                  key={s.label}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{s.label}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{s.detail}</div>
                  </div>
                  <Badge variant="outline" className={cn("gap-1", meta.className)}>
                    <Icon className="h-3 w-3" />
                    {meta.label}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
