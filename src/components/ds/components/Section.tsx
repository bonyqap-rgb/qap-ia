import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

/** Cabeçalho de seção: título forte, descrição discreta, ações à direita. */
export function SectionHeader({ title, description, actions, className }: SectionHeaderProps) {
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
        {description && <p className="mt-0.5 text-footnote text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export interface SectionProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  id?: string;
}

/** Bloco vertical de seção com espaçamento consistente baseado em múltiplos de 8. */
export function Section({ children, className, title, description, actions, id }: SectionProps) {
  return (
    <section id={id} className={cn("mt-10 first:mt-0", className)}>
      {(title || actions) && (
        <SectionHeader title={title ?? ""} description={description} actions={actions} />
      )}
      {children}
    </section>
  );
}
