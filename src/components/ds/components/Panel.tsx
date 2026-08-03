import type { ReactNode } from "react";
import { Card } from "./Card";
import { cn } from "@/lib/utils";

export interface PanelProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

/** Painel com cabeçalho fixo e corpo — usado em listas e gráficos. */
export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: PanelProps) {
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
