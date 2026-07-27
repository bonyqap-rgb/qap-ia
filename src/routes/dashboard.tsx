import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  Database,
  MessageSquare,
  Clock,
  Activity,
  TrendingUp,
  CheckCircle2,
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

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — QAP IA" },
      {
        name: "description",
        content:
          "Métricas de uso e desempenho da plataforma QAP IA em tempo real.",
      },
      { property: "og:title", content: "Dashboard — QAP IA" },
      {
        property: "og:description",
        content:
          "Métricas de uso e desempenho da plataforma QAP IA em tempo real.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

const stats = [
  {
    label: "Documentos enviados",
    value: "128",
    delta: "+12 este mês",
    icon: FileText,
    color: "bg-navy/5 text-navy",
  },
  {
    label: "Chunks indexados",
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
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    label: "Tempo médio de resposta",
    value: "1,4s",
    delta: "-0,2s vs média",
    icon: Clock,
    color: "bg-blue-50 text-blue-700",
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
  concluído: "bg-emerald-50 text-emerald-700 border-emerald-200",
  indexando: "bg-gold/10 text-gold-dark border-gold/30",
  aguardando: "bg-muted text-muted-foreground border-border",
  erro: "bg-red-50 text-red-700 border-red-200",
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
            Visão geral de uso e desempenho da plataforma.
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit gap-1.5 border-emerald-200 bg-emerald-50 text-emerald-700"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          API operacional
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={cn("grid h-10 w-10 place-items-center rounded-lg", s.color)}>
                  <s.icon className="h-5 w-5" />
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                {s.value}
              </div>
              <div className="mt-1 text-xs font-medium text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-2 text-[11px] font-medium text-emerald-700">
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
                    <stop offset="0%" stopColor="oklch(0.32 0.07 253)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.32 0.07 253)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="c2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.12 83)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.7 0.12 83)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 255)" />
                <XAxis dataKey="day" fontSize={12} stroke="oklch(0.5 0.04 255)" />
                <YAxis fontSize={12} stroke="oklch(0.5 0.04 255)" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid oklch(0.88 0.01 255)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="consultas"
                  stroke="oklch(0.32 0.07 253)"
                  strokeWidth={2}
                  fill="url(#c1)"
                />
                <Area
                  type="monotone"
                  dataKey="indexacoes"
                  stroke="oklch(0.7 0.12 83)"
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
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 255)" />
                <XAxis type="number" fontSize={12} stroke="oklch(0.5 0.04 255)" />
                <YAxis
                  dataKey="topic"
                  type="category"
                  fontSize={12}
                  width={80}
                  stroke="oklch(0.5 0.04 255)"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid oklch(0.88 0.01 255)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="total" fill="oklch(0.7 0.12 83)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
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
                    <Badge
                      variant="outline"
                      className={cn("gap-1", statusColor[d.status])}
                    >
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
    </div>
  );
}
