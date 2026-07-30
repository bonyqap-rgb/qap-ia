import { createFileRoute } from "@tanstack/react-router";
import { Lock, Users, ShieldCheck, KeyRound, ScrollText } from "lucide-react";

import { AdminCard, AdminPage, PlaceholderPanel } from "@/components/admin/admin-primitives";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/seguranca")({
  component: AdminSeguranca,
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

function AdminSeguranca() {
  return (
    <AdminPage
      title="Segurança"
      description="Usuários, perfis, permissões, auditoria e chaves de API."
      icon={Lock}
      readOnly
    >
      <AdminCard
        title="Usuários e perfis"
        description="Controle de acesso institucional"
        actions={
          <Button variant="outline" size="sm" disabled>
            <Users className="mr-1.5 h-4 w-4" />
            Novo usuário
          </Button>
        }
      >
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
                        u.role === "Administrador" && "border-azure/40 bg-azure/10 text-azure-dark",
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
                    <Button variant="ghost" size="sm" disabled>
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </AdminCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminCard title="Trilha de auditoria" description="Últimas ações registradas">
          <ul className="divide-y divide-border/60">
            {auditLogs.map((log, i) => (
              <li key={i} className="flex items-start gap-3 py-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-azure/10 text-azure">
                  <ScrollText className="h-4 w-4" />
                </span>
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
        </AdminCard>

        <div className="space-y-4">
          <PlaceholderPanel
            icon={ShieldCheck}
            title="Permissões granulares"
            description="Matriz de perfis e escopos por módulo será habilitada quando a API de autorização estiver disponível."
            items={["Administrador", "Editor", "Consulta", "Auditor"]}
          />
          <PlaceholderPanel
            icon={KeyRound}
            title="API Keys"
            description="Emissão, rotação e revogação de chaves de integração institucional."
            items={["Emitir chave", "Rotacionar", "Revogar", "Escopos"]}
          />
        </div>
      </div>
    </AdminPage>
  );
}
