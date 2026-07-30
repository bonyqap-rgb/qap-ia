import { createFileRoute } from "@tanstack/react-router";
import { Server, Clock, Gauge, Database, Activity } from "lucide-react";

import { AdminCard, AdminPage, SettingRow } from "@/components/admin/admin-primitives";
import { StatCard, StatusPill } from "@/components/common/stat-card";
import { ApiOfflineNotice } from "@/components/common/page-primitives";
import { Progress } from "@/components/ui/progress";
import { useHealth, useMetrics, useReady } from "@/hooks/use-system";
import { useDocumentStatistics } from "@/hooks/use-documents";
import { API_BASE_URL } from "@/services/api-client";

export const Route = createFileRoute("/admin/sistema")({
  component: AdminSistema,
});

function formatUptime(seconds?: number) {
  if (!seconds) return "—";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return [d && `${d}d`, h && `${h}h`, `${m}min`].filter(Boolean).join(" ");
}

function AdminSistema() {
  const health = useHealth();
  const ready = useReady();
  const metrics = useMetrics();
  const statistics = useDocumentStatistics();

  return (
    <AdminPage
      title="Sistema"
      description="Estado do serviço, prontidão, versão e recursos de infraestrutura."
      icon={Server}
    >
      {health.isDemo && <ApiOfflineNotice onRetry={health.refetch} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tempo online"
          value={formatUptime(health.data.uptimeSeconds)}
          hint={`Versão ${health.data.version ?? "—"}`}
          icon={Clock}
          loading={health.isLoading}
        />
        <StatCard
          label="Latência média"
          value={`${Math.round(metrics.data.averageLatencyMs ?? 0)} ms`}
          hint={`p95 ${Math.round(metrics.data.p95LatencyMs ?? 0)} ms`}
          icon={Gauge}
          loading={metrics.isLoading}
        />
        <StatCard
          label="Vetores"
          value={(statistics.data.totalChunks ?? 0).toLocaleString("pt-BR")}
          hint="Chunks em pgvector"
          icon={Database}
          loading={statistics.isLoading}
        />
        <StatCard
          label="Uso da API (24h)"
          value={(metrics.data.requestsLast24h ?? 0).toLocaleString("pt-BR")}
          hint={`${(metrics.data.requestsTotal ?? 0).toLocaleString("pt-BR")} no total`}
          icon={Activity}
          loading={metrics.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminCard title="Health checks" description="Serviços monitorados" contentClassName="space-y-3">
          {[
            { key: "api", label: "Backend (API)" },
            { key: "database", label: "Banco de dados" },
            { key: "ai", label: "Modelo de IA" },
            { key: "vector", label: "Índice vetorial" },
          ].map((svc) => {
            const service = health.data.services?.[svc.key];
            return (
              <StatusPill
                key={svc.key}
                label={svc.label}
                status={service?.status ?? health.data.status}
                detail={service?.detail}
                loading={health.isLoading}
              />
            );
          })}
          <div className="rounded-lg border border-border/60 p-3">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium">Prontidão (/ready)</span>
              <span className="text-muted-foreground">
                {ready.data.ready ? "Pronto" : "Não pronto"}
              </span>
            </div>
            <Progress value={ready.data.ready ? 100 : 15} className="h-1.5" />
          </div>
        </AdminCard>

        <AdminCard title="Ambiente" description="Configuração efetiva do frontend">
          <SettingRow label="Endpoint base" value={API_BASE_URL} />
          <SettingRow label="Status geral" value={health.data.status} />
          <SettingRow label="Versão do backend" value={health.data.version ?? "—"} />
          <SettingRow
            label="Embeddings gerados"
            value={(metrics.data.embeddingsGenerated ?? 0).toLocaleString("pt-BR")}
          />
          <SettingRow
            label="Tokens consumidos"
            value={(metrics.data.tokensUsed ?? 0).toLocaleString("pt-BR")}
          />
        </AdminCard>
      </div>
    </AdminPage>
  );
}
