import type { ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  /** Ativa realce sutil em hover/foco (para cards clicáveis). */
  interactive?: boolean;
  padding?: "none" | "sm" | "default" | "lg";
  selected?: boolean;
  disabled?: boolean;
}

/** Superfície base do Design System: borda leve, radius consistente, sombra discreta. */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className, interactive, padding = "default", selected, disabled, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-border/60 bg-card text-card-foreground shadow-soft",
        "transition-all duration-200 ease-[var(--ease-standard)]",
        padding === "none" && "p-0",
        padding === "sm" && "p-4",
        padding === "default" && "p-5 sm:p-6",
        padding === "lg" && "p-6 sm:p-8",
        selected && "border-primary ring-2 ring-primary/20",
        disabled && "opacity-50 pointer-events-none",
        interactive &&
          !disabled && [
            "cursor-pointer hover:-translate-y-0.5 hover:border-azure/40 hover:shadow-elevated focus-within:border-azure/50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            "active:translate-y-0",
          ],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
