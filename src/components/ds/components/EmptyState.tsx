import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** Estado vazio padrão do Design System seguindo a estética premium e limpa. */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("state-surface", className)}>
      {Icon && (
        <span className="grid size-11 place-items-center rounded-2xl border border-border/60 bg-card text-muted-foreground">
          <Icon className="size-5" />
        </span>
      )}
      <div className="max-w-sm">
        <p className="font-display text-[15px] font-semibold text-foreground">{title}</p>
        {description && <p className="mt-1 text-footnote text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
