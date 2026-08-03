import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ScrollText, Search } from "lucide-react";

import { AdminCard, AdminPage } from "@/components/admin/admin-primitives";
import { ApiErrorNotice, DataGap, EmptyState } from "@/components/common/page-primitives";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { AdminLogLevel } from "@/lib/admin-config";
import { useMetrics } from "@/hooks/use-system";

export const Route = createFileRoute("/admin/logs")({
  component: AdminLogs,
});

const levelStyles: Record<AdminLogLevel, string> = {
  info: "border-border/70 bg-muted/50 text-muted-foreground",
  warn: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  error:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
};

function AdminLogs() {
  const metrics = useMetrics();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<"all" | AdminLogLevel>("all");

  const rows = useMemo(() => {
    const apiErrors = (metrics.data?.recentErrors ?? []).map((err, i) => ({
      id: `api-${i}`,
      at: err.at,
      level: "error" as AdminLogLevel,
      scope: err.scope ?? "api",
      message: err.message,
    }));
    return apiErrors
      .filter((log) => (level === "all" ? true : log.level === level))
      .filter((log) =>
        query.trim()
          ? `${log.message ?? ""} ${log.scope ?? ""}`
              .toLowerCase()
              .includes(query.trim().toLowerCase())
          : true,
      )
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  }, [metrics.data?.recentErrors, level, query]);

  return (
    <AdminPage
      title="Logs"
      description="Erros recentes reportados pelo endpoint de métricas do backend."
      icon={ScrollText}
    >
      {metrics.isUnavailable && <ApiErrorNotice error={metrics.error} onRetry={metrics.refetch} />}

      <AdminCard title="Eventos" description={`${rows.length} registros`}>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar por mensagem ou escopo..."
              className="pl-9"
            />
          </div>
          <Select value={level} onValueChange={(v) => setLevel(v as typeof level)}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os níveis</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warn">Alerta</SelectItem>
              <SelectItem value="error">Erro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={ScrollText}
            title="Nenhum registro encontrado"
            description="O backend não reportou erros na janela monitorada, ou os filtros estão restritos demais."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Nível</TableHead>
                  <TableHead className="hidden sm:table-cell w-40">Data</TableHead>
                  <TableHead className="hidden md:table-cell w-28">Escopo</TableHead>
                  <TableHead>Mensagem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("font-normal uppercase text-[10px]", levelStyles[log.level])}
                      >
                        {log.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                      {new Date(log.at).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-[12px] text-muted-foreground">
                      {log.scope}
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{log.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </AdminCard>

      <AdminCard title="Log operacional completo" description="Info e alertas de todos os escopos">
        <DataGap
          title="Stream de logs"
          endpoint="GET /logs"
          description="Somente erros agregados chegam por /metrics; não há endpoint de logs completos."
        />
      </AdminCard>
    </AdminPage>
  );
}
