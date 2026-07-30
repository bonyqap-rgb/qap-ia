import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldAlert,
  Users,
  UploadCloud,
  Activity,
  Database,
  FileText,
  Cpu,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ApiOfflineNotice, EmptyState } from "@/components/common/page-primitives";
import { StatCard, StatusPill } from "@/components/common/stat-card";
import { useDocumentStatistics, useIndexingHistory } from "@/hooks/use-documents";
import { useHealth, useMetrics, useReady } from "@/hooks/use-system";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administração — QAP IA" },
      {
        name: "description",
        content:
          "Painel administrativo do QAP IA — usuários, auditoria e integridade da plataforma.",
      },
      { property: "og:title", content: "Administração — QAP IA" },
      {
        property: "og:description",
        content:
          "Painel administrativo do QAP IA — usuários, auditoria e integridade da plataforma.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const users = [
  { name: "Cel. Andrade", email: "andrade@pm.gov.br", role: "Administrador", active: true },
  { name: "Maj. Ribeiro", email: "ribeiro@pm.gov.br", role: "Editor", active: true },
  { name: "Cap. Lima", email: "lima@pm.gov.br", role: "Editor", active: true },
  { name: "Ten. Souza", email: "souza@pm.gov.br", role: "Consulta", active: true },
  { name: "Sgt. Pereira", email: "pereira@pm.gov.br", role: "Consulta", active: false },
];

const auditLogs = [
  { when: "há 3 min", user: "Ten. Souza", action: "Upload de documento", target: "Portaria 001-2025.docx" },
  { when: "há 25 min", user: "Cel. Andrade", action: "Alterou permissão", target: "Cap. Lima → Editor" },
  { when: "há 1 hora", user: "Maj. Ribeiro", action: "Reindexou documento", target: "Código Penal Militar.pdf" },
  { when: "há 2 horas", user: "Sistema", action: "Rotina de embeddings", target: "812 chunks processados" },
  { when: "ontem", user: "Cap. Lima", action: "Removeu documento", target: "documento-teste.pdf" },
];

const statusMeta: Record<
  string,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  online: {
    label: "Operacional",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  degraded: {
    label: "Degradado",
    className: "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    icon: AlertTriangle,
  },
  offline: {
    label: "Offline",
    className: "border-red-200 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
    icon: AlertTriangle,
  },
};

function AdminPage() {
  const metrics = useMetrics();
  const health = useHealth();
  const ready = useReady();
  const statistics = useDocumentStatistics();
  const history = useIndexingHistory();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <ShieldAlert className="h-6 w-6 text-azure-dark" />
            Administração
          </h1>
          <p className="text-sm text-muted-foreground">
            Central de controle, auditoria e integridade da plataforma QAP IA.
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit gap-1.5 border-azure/40 bg-azure/10 text-azure-dark"
        >
          Acesso restrito · Nível 3
        </Badge>
      </div>

      {(metrics.isDemo || health.isDemo) && <ApiOfflineNotice onRetry={health.refetch} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Requisições (24h)"
          value={(metrics.data.requestsLast24h ?? 0).toLocaleString("pt-BR")}
          hint={`${(metrics.data.requestsTotal ?? 0).toLocaleString("pt-BR")} no total`}
          icon={Activity}
          loading={metrics.isLoading}
        />
        <StatCard
          label="Latência média"
          value={`${Math.round(metrics.data.averageLatencyMs ?? 0)} ms`}
          hint={`p95 ${Math.round(metrics.data.p95LatencyMs ?? 0)} ms`}
          icon={Cpu}
          loading={metrics.isLoading}
        />
        <StatCard
          label="Taxa de erro"
          value={`${((metrics.data.errorRate ?? 0) * 100).toFixed(2)}%`}
          hint="Janela de 24 horas"
          icon={AlertTriangle}
          loading={metrics.isLoading}
        />
        <StatCard
          label="Chunks na base"
          value={(statistics.data.totalChunks ?? 0).toLocaleString("pt-BR")}
          hint={`${statistics.data.totalDocuments} documentos · pgvector`}
          icon={Database}
          loading={statistics.isLoading}
        />
      </div>


      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Usuários e permissões</CardTitle>
              <CardDescription>Controle de acesso institucional</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {}}
              className="hidden sm:inline-flex"
            >
              <Users className="mr-1.5 h-4 w-4" />
              Novo usuário
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.email}>
                      <TableCell className="font-medium">
                        <div>{u.name}</div>
                        <div className="text-[11px] text-muted-foreground">{u.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-normal",
                            u.role === "Administrador" &&
                              "border-azure/40 bg-azure/10 text-azure-dark",
                          )}
                        >
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {u.active ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                            Inativo
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Saúde da plataforma</CardTitle>
            <CardDescription>/health e /ready monitorados continuamente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
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
          </CardContent>
        </Card>

      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Histórico de indexações</CardTitle>
            <CardDescription>
              Últimos processamentos e tempo médio por documento
            </CardDescription>
          </CardHeader>
          <CardContent>
            {history.data.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Nenhuma indexação registrada"
                description="Assim que documentos forem processados, o histórico aparecerá aqui."
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Documento</TableHead>
                      <TableHead className="hidden sm:table-cell">Início</TableHead>
                      <TableHead>Duração</TableHead>
                      <TableHead className="hidden sm:table-cell">Chunks</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.data.slice(0, 8).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="max-w-[220px] truncate font-medium">
                          {item.documentName}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {new Date(item.startedAt).toLocaleString("pt-BR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.durationSeconds ? `${item.durationSeconds}s` : "—"}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">
                          {item.chunks ?? "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-normal",
                              item.status === "erro" &&
                                "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
                              item.status === "concluído" &&
                                "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
                            )}
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Erros recentes</CardTitle>
            <CardDescription>Logs resumidos do backend</CardDescription>
          </CardHeader>
          <CardContent>
            {(metrics.data.recentErrors ?? []).length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="Nenhum erro recente"
                description="A plataforma não registrou falhas na janela monitorada."
              />
            ) : (
              <ul className="space-y-2.5">
                {(metrics.data.recentErrors ?? []).slice(0, 6).map((err, i) => (
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
          </CardContent>
        </Card>
      </div>


      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Trilha de auditoria</CardTitle>
            <CardDescription>Últimas ações registradas na plataforma</CardDescription>
          </div>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border/60">
            {auditLogs.map((log, i) => (
              <li key={i} className="flex items-start gap-3 py-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy/5 text-navy">
                  {log.user === "Sistema" ? (
                    <Cpu className="h-4 w-4" />
                  ) : log.action.includes("Upload") ? (
                    <UploadCloud className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm">
                    <span className="font-semibold text-foreground">{log.user}</span>{" "}
                    <span className="text-muted-foreground">{log.action}</span>{" "}
                    <span className="font-medium text-foreground">{log.target}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">{log.when}</div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
