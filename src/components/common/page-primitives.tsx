import type { ReactNode } from "react";
import { AlertTriangle, PlugZap, RefreshCw, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/services/api-client";
import type { ApiError } from "@/services/api-client";

/** Cabeçalho padrão de página interna. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

/**
 * Aviso exibido quando a API real não respondeu.
 * Não há dados de demonstração: a tela fica sem números até a API voltar.
 */
export function ApiErrorNotice({
  error,
  onRetry,
  className,
}: {
  error?: ApiError | null;
  onRetry?: () => void;
  className?: string;
}) {
  const isNetwork = !error || error.isNetwork;

  return (
    <div
      role="alert"
      className={cn(
        "mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/8 px-3.5 py-2.5 text-[13px] text-destructive dark:bg-destructive/12",
        className,
      )}
    >
      <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
      <span className="min-w-0 flex-1">
        {isNetwork ? (
          <>
            Não foi possível conectar à API em <code className="font-mono">{API_BASE_URL}</code>.
            Nenhum dado é exibido enquanto a conexão não for restabelecida.
          </>
        ) : (
          <>
            A API respondeu com erro {error?.status}
            {error?.message ? ` — ${error.message}` : ""}.
          </>
        )}
      </span>
      {onRetry && (
        <Button size="sm" variant="outline" className="gap-1.5" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" />
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

/**
 * Placeholder para um dado que a interface prevê mas que nenhum endpoint
 * do backend fornece ainda. Deixa a lacuna explícita em vez de preenchê-la
 * com números fictícios.
 */
export function DataGap({
  title,
  endpoint,
  description,
  className,
  compact,
}: {
  /** O que a tela precisa exibir. */
  title: string;
  /** Endpoint que precisaria existir/retornar o dado. */
  endpoint: string;
  description?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      role="note"
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/25 px-5 text-center",
        compact ? "py-6" : "py-10",
        className,
      )}
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-muted text-muted-foreground">
        <Wrench className="h-4 w-4" aria-hidden />
      </span>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
        {description ? `${description} ` : ""}
        Este dado ainda não é fornecido pela API.
      </p>
      <code className="rounded-md border border-border/70 bg-card px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
        {endpoint}
      </code>
    </div>
  );
}

/** Valor de métrica ainda não disponível na API — nunca exibe número inventado. */
export function GapValue({ label = "sem dado" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-normal text-muted-foreground">
      <PlugZap className="h-3.5 w-3.5" aria-hidden />
      {label}
    </span>
  );
}

/** Estado vazio elegante e reutilizável. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/70 px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        {description && (
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/** Skeleton de linhas para tabelas e listas. */
export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}
