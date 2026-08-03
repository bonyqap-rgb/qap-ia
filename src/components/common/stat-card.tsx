import type { ComponentType } from "react";
import { PlugZap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { HealthStatus } from "@/types/api";

/**
 * Card de métrica reutilizável (dashboard e administração).
 * `value` nulo/indefinido significa que a API não forneceu o dado — o card
 * mostra explicitamente "sem dado" em vez de um número inventado.
 */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  loading,
}: {
  label: string;
  value: string | number | null | undefined;
  hint?: string;
  icon: ComponentType<{ className?: string }>;
  loading?: boolean;
}) {
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <Card className="surface-panel hover-lift">
      <CardContent className="flex items-start gap-3 p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-azure/10 text-azure">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          {loading ? (
            <Skeleton className="mt-1.5 h-6 w-20" />
          ) : hasValue ? (
            <p className="font-display text-2xl font-bold leading-tight text-foreground">{value}</p>
          ) : (
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <PlugZap className="h-3.5 w-3.5" aria-hidden />
              sem dado da API
            </p>
          )}
          {hint && <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

const statusStyles: Record<HealthStatus | "unknown", { dot: string; label: string; text: string }> =
  {
    online: {
      dot: "bg-emerald-500",
      label: "Operacional",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    degraded: {
      dot: "bg-amber-500",
      label: "Degradado",
      text: "text-amber-600 dark:text-amber-400",
    },
    offline: { dot: "bg-red-500", label: "Indisponível", text: "text-red-600 dark:text-red-400" },
    unknown: {
      dot: "bg-muted-foreground/40",
      label: "Sem leitura",
      text: "text-muted-foreground",
    },
  };

/**
 * Indicador de saúde de um serviço. Sem resposta da API o estado é
 * "Sem leitura" — nunca presumimos que o serviço está online.
 */
export function StatusPill({
  label,
  status,
  detail,
  loading,
}: {
  label: string;
  status?: HealthStatus | null;
  detail?: string;
  loading?: boolean;
}) {
  const style = statusStyles[status ?? "unknown"];
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3.5 py-3 transition-all duration-200 hover:border-border/100 hover:bg-muted/20 hover:shadow-subtle">
      <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden>
        {status === "online" && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
              style.dot,
            )}
          />
        )}
        <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", style.dot)} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{label}</p>
        {loading ? (
          <Skeleton className="mt-1 h-3 w-24" />
        ) : (
          <p className="truncate text-[11px] text-muted-foreground">{detail ?? style.label}</p>
        )}
      </div>
      <span className={cn("shrink-0 text-[11px] font-semibold", style.text)}>{style.label}</span>
    </div>
  );
}
