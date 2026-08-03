import { createFileRoute } from "@tanstack/react-router";
import { Activity, Gauge, AlertTriangle, UploadCloud } from "lucide-react";

import { AdminCard, AdminPage } from "@/components/admin/admin-primitives";
import { StatCard } from "@/components/common/stat-card";
import { ApiErrorNotice, DataGap } from "@/components/common/page-primitives";
import { useMetrics } from "@/hooks/use-system";
import { useDocumentStatistics } from "@/hooks/use-documents";

export const Route = createFileRoute("/admin/monitoramento")({
  component: AdminMonitoramento,
});

function AdminMonitoramento() {
  const metrics = useMetrics();
  const statistics = useDocumentStatistics();

  const m = metrics.data;
  const stats = statistics.data;

  return (
    <AdminPage
      title="Monitoramento"
      description="Indicadores agregados reportados pelo backend em tempo real."
      icon={Activity}
    >
      {metrics.isUnavailable && <ApiErrorNotice error={metrics.error} onRetry={metrics.refetch} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Consultas (24h)"
          value={m?.requestsLast24h?.toLocaleString("pt-BR")}
          icon={Activity}
          loading={metrics.isLoading}
        />
        <StatCard
          label="Latência p95"
          value={m?.p95LatencyMs != null ? `${Math.round(m.p95LatencyMs)} ms` : undefined}
          hint={
            m?.averageLatencyMs != null ? `média ${Math.round(m.averageLatencyMs)} ms` : undefined
          }
          icon={Gauge}
          loading={metrics.isLoading}
        />
        <StatCard
          label="Taxa de erro"
          value={m?.errorRate != null ? `${(m.errorRate * 100).toFixed(2)}%` : undefined}
          icon={AlertTriangle}
          loading={metrics.isLoading}
        />
        <StatCard
          label="Tempo médio de indexação"
          value={
            stats?.averageIndexingSeconds != null
              ? `${Math.round(stats.averageIndexingSeconds)}s`
              : undefined
          }
          hint={stats ? `${stats.indexedDocuments} documentos` : undefined}
          icon={UploadCloud}
          loading={statistics.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminCard title="Consultas por dia" description="Volume de perguntas ao assistente">
          <DataGap
            title="Série temporal de consultas"
            endpoint="GET /metrics/timeseries"
            description="A API expõe apenas totais agregados, sem histórico por dia."
          />
        </AdminCard>

        <AdminCard title="Latência ao longo do tempo" description="Evolução do pipeline RAG">
          <DataGap
            title="Série temporal de latência"
            endpoint="GET /metrics/timeseries"
            description="Somente a média e o p95 atuais estão disponíveis."
          />
        </AdminCard>

        <AdminCard title="Erros por dia" description="Falhas registradas no backend">
          <DataGap
            title="Série temporal de erros"
            endpoint="GET /metrics/timeseries"
            description="Os erros recentes podem ser consultados na área de Logs."
          />
        </AdminCard>

        <AdminCard title="Uploads e indexações" description="Ingestão documental ao longo do tempo">
          <DataGap
            title="Série temporal de ingestão"
            endpoint="GET /indexing/history?groupBy=day"
            description="O histórico atual não é agregado por período."
          />
        </AdminCard>
      </div>
    </AdminPage>
  );
}
