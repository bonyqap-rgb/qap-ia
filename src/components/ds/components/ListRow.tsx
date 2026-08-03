import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ListRowProps {
  icon?: ComponentType<{ className?: string }>;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  badge?: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

/** Linha de lista premium (histórico, favoritos, base legal) com suporte a estados. */
export function ListRow({
  icon: Icon,
  title,
  description,
  meta,
  badge,
  className,
  onClick,
  disabled,
}: ListRowProps) {
  const isClickable = !!onClick && !disabled;

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-150 hover:bg-muted/60",
        disabled ? "opacity-50 pointer-events-none" : "",
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
