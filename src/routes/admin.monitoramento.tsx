import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Gauge, AlertTriangle, UploadCloud } from "lucide-react";

import { AdminCard, AdminPage } from "@/components/admin/admin-primitives";
import { StatCard } from "@/components/common/stat-card";
import { useMetrics } from "@/hooks/use-system";
import { useDocumentStatistics } from "@/hooks/use-documents";
import { monitoringSeries } from "@/lib/admin-config";

export const Route = createFileRoute("/admin/monitoramento")({
  component: AdminMonitoramento,
});

const axisProps = {
  stroke: "hsl(var(--muted-foreground))",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--popover))",
  fontSize: 12,
} as const;

function AdminMonitoramento() {
  const metrics = useMetrics();
  const statistics = useDocumentStatistics();

  return (
    <AdminPage
      title="Monitoramento"
      description="Consultas, latência, erros, uploads e indexações da última semana."
      icon={Activity}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Consultas (24h)"
          value={(metrics.data.requestsLast24h ?? 0).toLocaleString("pt-BR")}
          icon={Activity}
          loading={metrics.isLoading}
        />
        <StatCard
          label="Latência p95"
          value={`${Math.round(metrics.data.p95LatencyMs ?? 0)} ms`}
          hint={`média ${Math.round(metrics.data.averageLatencyMs ?? 0)} ms`}
          icon={Gauge}
          loading={metrics.isLoading}
        />
        <StatCard
          label="Taxa de erro"
          value={`${((metrics.data.errorRate ?? 0) * 100).toFixed(2)}%`}
          icon={AlertTriangle}
          loading={metrics.isLoading}
        />
        <StatCard
          label="Tempo médio de indexação"
          value={`${Math.round(statistics.data.averageIndexingSeconds ?? 0)}s`}
          hint={`${statistics.data.indexedDocuments} documentos`}
          icon={UploadCloud}
          loading={statistics.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminCard title="Consultas por dia" description="Volume de perguntas ao assistente">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monitoringSeries}>
                <defs>
                  <linearGradient id="gradConsultas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-azure)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-azure)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="day" {...axisProps} />
                <YAxis {...axisProps} width={34} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="consultas"
                  stroke="var(--color-azure)"
                  strokeWidth={2}
                  fill="url(#gradConsultas)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>

        <AdminCard title="Latência média (ms)" description="Tempo de resposta do pipeline RAG">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monitoringSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="day" {...axisProps} />
                <YAxis {...axisProps} width={44} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="latencia"
                  stroke="var(--color-azure-dark)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>

        <AdminCard title="Erros por dia" description="Falhas registradas no backend">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monitoringSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="day" {...axisProps} />
                <YAxis {...axisProps} width={28} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="erros" fill="var(--color-azure)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>

        <AdminCard title="Uploads e indexações" description="Ingestão documental semanal">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monitoringSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="day" {...axisProps} />
                <YAxis {...axisProps} width={28} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="uploads" fill="var(--color-azure)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="indexacoes" fill="var(--color-azure-dark)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>
    </AdminPage>
  );
}
