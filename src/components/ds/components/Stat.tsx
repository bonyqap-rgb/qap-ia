import type { ComponentType, ReactNode } from "react";
import { Card } from "./Card";
import { BadgeTone } from "./Badge";
import { cn } from "@/lib/utils";

const toneStyles: Record<BadgeTone, string> = {
  neutral: "border-border/70 bg-muted/60 text-muted-foreground",
  accent: "border-azure/30 bg-azure/10 text-azure-dark dark:text-azure-light",
  success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  warning: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  danger: "border-destructive/30 bg-destructive/10 text-destructive",
  info: "border-azure/30 bg-azure/10 text-azure-dark dark:text-azure-light",
};

export interface StatProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ComponentType<{ className?: string }>;
  tone?: BadgeTone;
  loading?: boolean;
  className?: string;
  interactive?: boolean;
}

/** Indicador numérico (KPI) com micro animação de entrada. */
export function Stat({
  label,
  value,
  hint,
  icon: Icon,
  tone = "accent",
  loading,
  className,
  interactive = true,
}: StatProps) {
  return (
    <Card interactive={interactive} padding="sm" className={cn("animate-rise", className)}>
      <div className="flex items-start gap-3">
        {Icon && (
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-xl border",
              toneStyles[tone],
            )}
            aria-hidden
          >
            <Icon className="size-4" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {label}
          </p>
          {loading ? (
            <div className="mt-2 h-6 w-24 skeleton-block" />
          ) : (
            <p className="mt-0.5 font-display text-title3 font-semibold leading-tight tracking-tight text-foreground">
              {value}
            </p>
          )}
          {hint && <p className="mt-0.5 truncate text-caption text-muted-foreground">{hint}</p>}
        </div>
      </div>
    </Card>
  );
}
