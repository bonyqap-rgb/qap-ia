import type { ComponentType, ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "./Card";
import { cn } from "@/lib/utils";

export interface KpiProps {
  label: string;
  value: ReactNode;
  trend?: {
    value: string | number;
    direction: "up" | "down";
    label?: string;
  };
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  loading?: boolean;
  className?: string;
}

/** Componente de Métrica Chave (KPI) corporativo premium. */
export function Kpi({
  label,
  value,
  trend,
  description,
  icon: Icon,
  loading,
  className,
}: KpiProps) {
  return (
    <Card interactive padding="sm" className={cn("animate-rise", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {label}
          </p>
          {loading ? (
            <div className="mt-2 h-8 w-28 skeleton-block" />
          ) : (
            <p className="mt-0.5 font-display text-title2 font-semibold leading-tight tracking-tight text-foreground">
              {value}
            </p>
          )}
        </div>
        {Icon && (
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border/60 bg-muted/50 text-muted-foreground">
            <Icon className="size-5" />
          </span>
        )}
      </div>

      {!loading && (trend || description) && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-caption">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full",
                trend.direction === "up" ? "bg-success/10 text-success" : "bg-error/10 text-error",
              )}
            >
              {trend.direction === "up" ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              {trend.value}
            </span>
          )}
          {description && <span className="text-muted-foreground">{description}</span>}
        </div>
      )}
    </Card>
  );
}
