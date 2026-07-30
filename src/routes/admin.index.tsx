import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Cpu,
  Database,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ApiErrorNotice, EmptyState } from "@/components/common/page-primitives";
import { StatCard, StatusPill } from "@/components/common/stat-card";
import { AdminCard, AdminPage } from "@/components/admin/admin-primitives";
import { adminItems } from "@/components/app-sidebar";
import { useDocumentStatistics } from "@/hooks/use-documents";
import { useHealth, useMetrics, useReady } from "@/hooks/use-system";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const metrics = useMetrics();
  const health = useHealth();
  const ready = useReady();
  const statistics = useDocumentStatistics();

  return (
    <AdminPage
      title="Visão geral"
      description="Estado consolidado da plataforma e atalhos para as áreas técnicas."
    >
      {(metrics.isUnavailable || health.isUnavailable) && <ApiErrorNotice error={health.error} onRetry={health.refetch} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Requisições (24h)"
          value={(metrics.data?.requestsLast24h ?? 0).toLocaleString("pt-BR")}
          hint={`${(metrics.data?.requestsTotal ?? 0).toLocaleString("pt-BR")} no total`}
          icon={Activity}
          loading={metrics.isLoading}
        />
        <StatCard
          label="Latência média"
          value={`${Math.round(metrics.data?.averageLatencyMs ?? 0)} ms`}
          hint={`p95 ${Math.round(metrics.data?.p95LatencyMs ?? 0)} ms`}
          icon={Cpu}
          loading={metrics.isLoading}
        />
        <StatCard
          label="Taxa de erro"
          value={`${((metrics.data?.errorRate ?? 0) * 100).toFixed(2)}%`}
          hint="Janela de 24 horas"
          icon={AlertTriangle}
          loading={metrics.isLoading}
        />
        <StatCard
          label="Chunks na base"
          value={(statistics.data?.totalChunks ?? 0).toLocaleString("pt-BR")}
          hint={`${statistics.data?.totalDocuments} documentos · pgvector`}
          icon={Database}
          loading={statistics.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AdminCard
          title="Saúde da plataforma"
          description="/health e /ready monitorados continuamente"
          contentClassName="space-y-3"
        >
          {[
            { key: "api", label: "Backend (API)" },
            { key: "database", label: "Banco de dados" },
            { key: "ai", label: "Modelo de IA" },
            { key: "vector", label: "Índice vetorial" },
          ].map((svc) => {
            const service = health.data?.services?.[svc.key];
            return (
              <StatusPill
                key={svc.key}
                label={svc.label}
                status={service?.status ?? health.data?.status}
                detail={service?.detail}
                loading={health.isLoading}
              />
            );
          })}
          <div className="rounded-lg border border-border/60 p-3">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium">Prontidão (/ready)</span>
              <span className="text-muted-foreground">
                {ready.data?.ready ? "Pronto" : "Não pronto"}
              </span>
            </div>
            <Progress value={ready.data?.ready ? 100 : 15} className="h-1.5" />
          </div>
        </AdminCard>

        <AdminCard
          title="Erros recentes"
          description="Logs resumidos do backend"
          className="lg:col-span-2"
        >
          {(metrics.data?.recentErrors ?? []).length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="Nenhum erro recente"
              description="A plataforma não registrou falhas na janela monitorada."
            />
          ) : (
            <ul className="space-y-2.5">
              {(metrics.data?.recentErrors ?? []).slice(0, 6).map((err, i) => (
                <li
                  key={`${err.at}-${i}`}
                  className="rounded-lg border border-border/60 bg-muted/30 p-3"
                >
                  <p className="text-sm text-foreground">{err.message}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {err.scope ? `${err.scope} · ` : ""}
                    {new Date(err.at).toLocaleString("pt-BR")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>

      <AdminCard
        title="Áreas administrativas"
        description="Acesso rápido às ferramentas técnicas"
        contentClassName="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
      >
        {adminItems.map((item) => (
          <Button
            key={item.url}
            asChild
            variant="outline"
            className="h-auto justify-start gap-3 rounded-xl border-border/70 px-3 py-3 text-left hover-lift"
          >
            <Link to={item.url}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-azure/10 text-azure">
                <item.icon className="h-4 w-4" />
              </span>
              <span className="flex-1 truncate text-sm font-medium">{item.title}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          </Button>
        ))}
      </AdminCard>

      <AdminCard
        title="Indexações recentes"
        description="Consulte o histórico completo na área Base de Conhecimento"
        actions={
          <Button asChild size="sm" variant="outline">
            <Link to="/admin/base">
              <FileText className="mr-1.5 h-4 w-4" />
              Abrir
            </Link>
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground">
          {statistics.data?.indexedDocuments} documentos indexados ·{" "}
          {statistics.data?.pendingDocuments} em processamento ·{" "}
          {statistics.data?.failedDocuments ?? 0} com falha.
        </p>
      </AdminCard>
    </AdminPage>
  );
}
