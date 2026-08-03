import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Settings,
  ShieldCheck,
  Star,
  FileText,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Perfil do usuário — QAP IA" },
      {
        name: "description",
        content: "Dados do perfil, lotação, permissões e atividade recente no QAP IA.",
      },
      { property: "og:title", content: "Perfil do usuário — QAP IA" },
      {
        property: "og:description",
        content: "Dados do perfil, lotação, permissões e atividade no QAP IA.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

const identity = {
  name: "Cap. Paulo Mendes",
  rank: "Capitão PM · Matrícula 118.402-7",
  email: "paulo.mendes@pm.gov.br",
  phone: "(62) 98111-2233",
  unit: "1º Batalhão de Polícia Militar",
  location: "Goiânia · GO",
  since: "Membro desde março de 2025",
  initials: "PM",
};

const stats = [
  { label: "Consultas realizadas", value: "1.284", icon: MessageSquare },
  { label: "Documentos enviados", value: "37", icon: FileText },
  { label: "Respostas favoritadas", value: "62", icon: Star },
];

const permissions = [
  { label: "Chat jurídico", granted: true },
  { label: "Base de conhecimento", granted: true },
  { label: "Upload de documentos", granted: true },
  { label: "Painel administrativo", granted: false },
];

const activity = [
  { title: "Consulta sobre prazos do PAD militar", time: "há 2 horas" },
  { title: "Upload: Portaria nº 214/2025", time: "ontem" },
  { title: "Conversa favoritada: Uso diferenciado da força", time: "há 3 dias" },
  { title: "Exportação de histórico em PDF", time: "há 6 dias" },
];

function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:px-8">
      <header className="surface-raised overflow-hidden">
        <div className="bg-gradient-navy px-5 py-6 sm:px-7">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar className="h-16 w-16 shrink-0 border border-azure/30 shadow-azure">
                <AvatarFallback className="bg-navy-dark text-lg font-bold text-primary-foreground">
                  {identity.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                  <h1 className="truncate font-display text-xl font-bold text-primary-foreground sm:text-2xl">
                    {identity.name}
                  </h1>
                  <BadgeCheck className="h-4 w-4 shrink-0 text-azure-light" />
                </div>
                <p className="truncate text-xs font-medium text-steel-light/80">{identity.rank}</p>
                <Badge
                  variant="outline"
                  className="mt-2 border-azure/40 bg-azure/15 text-[10px] font-semibold text-azure-light"
                >
                  Plano Professional
                </Badge>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button asChild variant="secondary" size="sm" className="gap-1.5">
                <Link to="/settings">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Editar perfil</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 divide-y divide-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3 px-5 py-4">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-azure/10 text-azure">
                <s.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="font-display text-lg font-bold text-foreground">{s.value}</div>
                <div className="truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </header>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr]">
        <Card className="surface-panel">
          <CardHeader>
            <CardTitle className="text-base">Dados institucionais</CardTitle>
            <CardDescription>Informações de contato e lotação vinculadas à conta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: Mail, label: "E-mail", value: identity.email },
              { icon: Phone, label: "Telefone", value: identity.phone },
              { icon: Building2, label: "Unidade", value: identity.unit },
              { icon: MapPin, label: "Localidade", value: identity.location },
              { icon: CalendarDays, label: "Conta", value: identity.since },
            ].map((row) => (
              <div key={row.label} className="flex items-start gap-3">
                <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {row.label}
                  </div>
                  <div className="truncate text-sm text-foreground">{row.value}</div>
                </div>
              </div>
            ))}

            <Separator />

            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Consultas do mês</span>
                <span className="text-muted-foreground">418 de 1.000</span>
              </div>
              <Progress value={41.8} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="surface-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-4 w-4 text-azure" />
                Permissões
              </CardTitle>
              <CardDescription>Acessos concedidos pelo administrador da unidade.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {permissions.map((p) => (
                <div
                  key={p.label}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
                >
                  <span className="truncate text-sm text-foreground">{p.label}</span>
                  <Badge
                    variant="outline"
                    className={
                      p.granted
                        ? "border-emerald-500/40 bg-emerald-500/10 text-[10px] font-semibold text-emerald-600"
                        : "border-border text-[10px] font-semibold text-muted-foreground"
                    }
                  >
                    {p.granted ? "Liberado" : "Restrito"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="surface-panel">
            <CardHeader>
              <CardTitle className="text-base">Segurança da conta</CardTitle>
              <CardDescription>Credenciais de acesso institucional.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">Senha</p>
                <p className="text-[11px] text-muted-foreground">
                  Atualizada há 3 meses · gerenciada pela unidade
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Alterar senha
              </Button>
            </CardContent>
          </Card>

          <Card className="surface-panel">
            <CardHeader>
              <CardTitle className="text-base">Atividade recente</CardTitle>
              <CardDescription>Últimas ações registradas.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {activity.map((a) => (
                <div key={a.title} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-azure" />
                  <div className="min-w-0">
                    <div className="truncate text-sm text-foreground">{a.title}</div>
                    <div className="text-[11px] text-muted-foreground">{a.time}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
