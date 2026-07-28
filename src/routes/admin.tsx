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
import { systemStatus } from "@/lib/mock-data";

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
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <ShieldAlert className="h-6 w-6 text-gold-dark" />
            Administração
          </h1>
          <p className="text-sm text-muted-foreground">
            Central de controle, auditoria e integridade da plataforma QAP IA.
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit gap-1.5 border-gold/40 bg-gold/10 text-gold-dark"
        >
          Acesso restrito · Nível 3
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Usuários ativos", value: "42", icon: Users, hint: "+3 esta semana" },
          { label: "Uploads (mês)", value: "128", icon: UploadCloud, hint: "+12%" },
          { label: "Ações auditadas", value: "1.284", icon: Activity, hint: "últimos 30 dias" },
          { label: "Ocupação do índice", value: "68%", icon: Database, hint: "pgvector · 4.821 chunks" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-navy/5 text-navy">
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                {s.value}
              </div>
              <div className="mt-1 text-xs font-medium text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-2 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                {s.hint}
              </div>
            </CardContent>
          </Card>
        ))}
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
                              "border-gold/40 bg-gold/10 text-gold-dark",
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
            <CardDescription>Serviços monitorados em tempo real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {systemStatus.map((s) => {
              const meta = statusMeta[s.status];
              const Icon = meta.icon;
              return (
                <div
                  key={s.label}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground">{s.label}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{s.detail}</div>
                  </div>
                  <Badge variant="outline" className={cn("gap-1", meta.className)}>
                    <Icon className="h-3 w-3" />
                    {meta.label}
                  </Badge>
                </div>
              );
            })}
            <div className="rounded-lg border border-border/60 p-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium">Cota de embeddings</span>
                <span className="text-muted-foreground">68%</span>
              </div>
              <Progress value={68} className="h-1.5" />
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium">Uso do modelo (mês)</span>
                <span className="text-muted-foreground">42%</span>
              </div>
              <Progress value={42} className="h-1.5" />
            </div>
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
