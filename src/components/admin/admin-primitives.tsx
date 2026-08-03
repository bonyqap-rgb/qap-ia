import type { ComponentType, ReactNode } from "react";
import { Lock } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Cabeçalho padronizado das telas administrativas. */
export function AdminPage({
  title,
  description,
  icon: Icon,
  actions,
  readOnly,
  children,
}: {
  title: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  actions?: ReactNode;
  readOnly?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="space-y-6">
      <header className="grid gap-3 sm:flex sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-foreground">
            {Icon && <Icon className="h-5 w-5 text-azure" />}
            {title}
            {readOnly && (
              <Badge
                variant="outline"
                className="gap-1 border-border/70 bg-muted/50 text-[10px] font-medium text-muted-foreground"
              >
                <Lock className="h-3 w-3" />
                Somente leitura
              </Badge>
            )}
          </h2>
          {description && (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </header>
      {children}
    </section>
  );
}

/** Card padrão das telas administrativas. */
export function AdminCard({
  title,
  description,
  actions,
  className,
  contentClassName,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}) {
  return (
    <Card className={cn("surface-panel", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 gap-3">
        <div className="min-w-0">
          <CardTitle className="text-[15px]">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
      </CardHeader>
      <CardContent className={cn("pt-0", contentClassName)}>{children}</CardContent>
    </Card>
  );
}

/** Linha rótulo/valor usada nas telas de parâmetros. */
export function SettingRow({
  label,
  hint,
  value,
  loading,
  children,
}: {
  label: string;
  hint?: string;
  value?: ReactNode;
  loading?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 py-3 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className="shrink-0 text-sm text-muted-foreground">
        {loading ? (
          <Skeleton className="h-5 w-24" />
        ) : (
          (children ?? (
            <span className="rounded-md bg-muted px-2 py-1 font-mono text-[12px] text-foreground">
              {value ?? "—"}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

/** Área ainda não conectada ao backend — placeholder elegante. */
export function PlaceholderPanel({
  icon: Icon,
  title,
  description,
  items,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  items?: string[];
}) {
  return (
    <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-azure/10 text-azure">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="font-medium text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          {items && items.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {items.map((item) => (
                <li key={item}>
                  <Badge
                    variant="outline"
                    className="border-border/70 bg-background text-[11px] font-normal text-muted-foreground"
                  >
                    {item}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
