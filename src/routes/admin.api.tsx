import { createFileRoute } from "@tanstack/react-router";
import { Plug } from "lucide-react";

import { AdminCard, AdminPage, SettingRow } from "@/components/admin/admin-primitives";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/common/stat-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHealth } from "@/hooks/use-system";
import { apiConfig, apiEndpoints } from "@/lib/admin-config";
import { API_BASE_URL } from "@/services/api-client";

export const Route = createFileRoute("/admin/api")({
  component: AdminApi,
});

function AdminApi() {
  const health = useHealth();

  return (
    <AdminPage
      title="API"
      description="Endpoint, resiliência e endpoints REST disponíveis no backend."
      icon={Plug}
      readOnly
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminCard title="Conexão" description="Configuração efetiva do cliente HTTP">
          <SettingRow label="Endpoint" value={API_BASE_URL} />
          <SettingRow label="Timeout" value={`${apiConfig.timeoutMs / 1000}s`} />
          <SettingRow label="Retry" value={`${apiConfig.retries} tentativas`} />
          <SettingRow label="Backoff" value={apiConfig.retryBackoff} />
        </AdminCard>

        <AdminCard title="Proteções" description="Limites e tolerância a falhas" contentClassName="space-y-3">
          <SettingRow label="Circuit breaker" value={apiConfig.circuitBreaker} />
          <SettingRow label="Rate limit" value={apiConfig.rateLimit} />
          <StatusPill
            label="Status da API"
            status={health.data.status}
            detail={health.isDemo ? "Sem conexão — exibindo demonstração" : undefined}
            loading={health.isLoading}
          />
        </AdminCard>
      </div>

      <AdminCard title="Endpoints" description="Rotas consumidas pelo frontend">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Método</TableHead>
                <TableHead>Rota</TableHead>
                <TableHead className="hidden sm:table-cell">Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiEndpoints.map((ep) => (
                <TableRow key={`${ep.method}-${ep.path}`}>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-azure/40 bg-azure/10 font-mono text-[10px] text-azure-dark"
                    >
                      {ep.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-[12.5px]">{ep.path}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {ep.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </AdminCard>
    </AdminPage>
  );
}
