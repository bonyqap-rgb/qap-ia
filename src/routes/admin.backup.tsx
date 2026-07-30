import { createFileRoute } from "@tanstack/react-router";
import { DatabaseBackup, Download, Upload, History, RotateCcw } from "lucide-react";

import { AdminCard, AdminPage, PlaceholderPanel } from "@/components/admin/admin-primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/backup")({
  component: AdminBackup,
});

const snapshots = [
  { id: "s1", label: "Backup automático", at: "30/07/2026 03:00", size: "412 MB", status: "concluído" },
  { id: "s2", label: "Backup automático", at: "29/07/2026 03:00", size: "409 MB", status: "concluído" },
  { id: "s3", label: "Backup manual", at: "27/07/2026 18:22", size: "398 MB", status: "concluído" },
];

function AdminBackup() {
  return (
    <AdminPage
      title="Backup"
      description="Cópias de segurança da base documental e dos vetores gerados."
      icon={DatabaseBackup}
      readOnly
      actions={
        <Button size="sm" variant="outline" disabled>
          <DatabaseBackup className="mr-1.5 h-4 w-4" />
          Gerar backup
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PlaceholderPanel
          icon={Download}
          title="Exportar base"
          description="Exportação completa de documentos, metadados e embeddings em formato portável."
          items={["Documentos", "Metadados", "Embeddings"]}
        />
        <PlaceholderPanel
          icon={Upload}
          title="Importar base"
          description="Restauração a partir de um pacote exportado previamente, com validação de integridade."
          items={["Validação", "Mesclar", "Substituir"]}
        />
      </div>

      <AdminCard title="Snapshots recentes" description="Rotina diária às 03:00">
        <ul className="divide-y divide-border/60">
          {snapshots.map((snap) => (
            <li key={snap.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-azure/10 text-azure">
                <History className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{snap.label}</p>
                <p className="text-[11px] text-muted-foreground">
                  {snap.at} · {snap.size}
                </p>
              </div>
              <Badge
                variant="outline"
                className="border-emerald-200 bg-emerald-50 font-normal text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                {snap.status}
              </Badge>
              <Button variant="ghost" size="sm" disabled>
                <RotateCcw className="mr-1.5 h-4 w-4" />
                Restaurar
              </Button>
            </li>
          ))}
        </ul>
      </AdminCard>
    </AdminPage>
  );
}
