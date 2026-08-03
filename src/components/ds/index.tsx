/**
 * Design System QAP IA — componentes de layout e superfície reutilizáveis.
 * Camada exclusivamente visual: nenhum componente aqui faz chamada de API,
 * autenticação ou regra de negócio.
 */
import type { ComponentType, ReactNode } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ layout */

/** Contêiner padrão de conteúdo (grade e respiro consistentes). */
export function Container({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "wide" | "narrow";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        size === "default" && "max-w-6xl",
        size === "wide" && "max-w-7xl",
        size === "narrow" && "max-w-3xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Bloco vertical de seção com espaçamento consistente. */
export function Section({
  children,
  className,
  title,
  description,
  actions,
  id,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("mt-10 first:mt-0", className)}>
      {(title || actions) && (
        <SectionHeader title={title ?? ""} description={description} actions={actions} />
      )}
      {children}
    </section>
  );
}

/** Cabeçalho de seção: título forte, descrição discreta, ações à direita. */
export function SectionHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="font-display text-base font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-footnote text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ---------------------------------------------------------------- surfaces */

type CardProps = {
  children: ReactNode;
  className?: string;
  /** Ativa realce sutil em hover/foco (para cards clicáveis). */
  interactive?: boolean;
  padding?: "none" | "sm" | "default" | "lg";
};

/** Superfície base do Design System: borda leve, radius consistente, sombra discreta. */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className, interactive, padding = "default" },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-border/60 bg-card text-card-foreground shadow-soft",
        padding === "sm" && "p-4",
        padding === "default" && "p-5 sm:p-6",
        padding === "lg" && "p-6 sm:p-8",
        interactive &&
          "transition-[transform,border-color,box-shadow] duration-200 ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-azure/40 hover:shadow-elevated focus-within:border-azure/50",
        className,
      )}
    >
      {children}
    </div>
  );
});

/** Painel com cabeçalho fixo e corpo — usado em listas e gráficos. */
export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <Card padding="none" className={cn("overflow-hidden", className)}>
      <div className="flex items-start justify-between gap-3 border-b border-border/50 px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <h3 className="font-display text-[15px] font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-caption text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
      </div>
      <div className={cn("px-2 py-2 sm:px-3", bodyClassName)}>{children}</div>
    </Card>
  );
}

/* ------------------------------------------------------------------- badges */

type Tone = "neutral" | "accent" | "success" | "warning" | "danger";

const toneStyles: Record<Tone, string> = {
  neutral: "border-border/70 bg-muted/60 text-muted-foreground",
  accent: "border-azure/30 bg-azure/10 text-azure-dark dark:text-azure-light",
  success:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  warning: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  danger: "border-destructive/30 bg-destructive/10 text-destructive",
};

/** Badge institucional (categorias, status, contadores). */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-caption font-semibold tracking-tight",
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------------- kpi */

/** Indicador numérico (KPI) com micro animação de entrada. */
export function Stat({
  label,
  value,
  hint,
  icon: Icon,
  tone = "accent",
  loading,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ComponentType<{ className?: string }>;
  tone?: Tone;
  loading?: boolean;
  className?: string;
}) {
  return (
    <Card interactive padding="sm" className={cn("animate-rise", className)}>
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
          {hint && (
            <p className="mt-0.5 truncate text-caption text-muted-foreground">{hint}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

/* --------------------------------------------------------------- list rows */

/** Linha de lista premium (histórico, favoritos, base legal). */
export function ListRow({
  icon: Icon,
  title,
  description,
  meta,
  badge,
  className,
}: {
  icon?: ComponentType<{ className?: string }>;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  badge?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-150 hover:bg-muted/60",
        className,
      )}
    >
      {Icon && (
        <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-border/60 bg-muted/50 text-muted-foreground transition-colors group-hover:border-azure/30 group-hover:text-azure">
          <Icon className="size-4" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-footnote font-medium text-foreground">{title}</p>
        {description && (
          <p className="truncate text-caption text-muted-foreground">{description}</p>
        )}
      </div>
      {badge && <div className="hidden shrink-0 sm:block">{badge}</div>}
      {meta && (
        <span className="shrink-0 text-caption tabular-nums text-muted-foreground">{meta}</span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- empty state */

/** Estado vazio padrão do Design System. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("state-surface", className)}>
      {Icon && (
        <span className="grid size-11 place-items-center rounded-2xl border border-border/60 bg-card text-muted-foreground">
          <Icon className="size-5" />
        </span>
      )}
      <div className="max-w-sm">
        <p className="font-display text-[15px] font-semibold text-foreground">{title}</p>
        {description && (
          <p className="mt-1 text-footnote text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
