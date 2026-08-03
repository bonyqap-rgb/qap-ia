import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";

const toneStyles: Record<BadgeTone, string> = {
  neutral: "border-border/70 bg-muted/60 text-muted-foreground",
  accent: "border-azure/30 bg-azure/10 text-azure-dark dark:text-azure-light",
  success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  warning: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  danger: "border-destructive/30 bg-destructive/10 text-destructive",
  info: "border-azure/30 bg-azure/10 text-azure-dark dark:text-azure-light",
};

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

/** Badge institucional (categorias, status, contadores). */
export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-caption font-semibold tracking-tight",
        "transition-colors duration-140",
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
