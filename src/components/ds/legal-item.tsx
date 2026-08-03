import type { ReactNode } from "react";
import { Scale } from "lucide-react";

import { Badge } from "@/components/ds";
import { cn } from "@/lib/utils";

/**
 * Item de Base Legal — componente preparado para receber, futuramente,
 * referências de artigo, parágrafo e capítulo. Nenhuma lógica implementada:
 * os campos opcionais são apenas exibidos quando informados.
 */
export type LegalReference = {
  id: string;
  title: string;
  source?: string;
  /** Campos preparados para evolução futura. */
  article?: string;
  paragraph?: string;
  chapter?: string;
  badge?: string;
};

export function LegalItem({
  reference,
  action,
  className,
}: {
  reference: LegalReference;
  action?: ReactNode;
  className?: string;
}) {
  const refs = [
    reference.chapter && `Cap. ${reference.chapter}`,
    reference.article && `Art. ${reference.article}`,
    reference.paragraph && `§ ${reference.paragraph}`,
  ].filter(Boolean) as string[];

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-150 hover:bg-muted/60",
        className,
      )}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-border/60 bg-muted/50 text-muted-foreground transition-colors group-hover:border-azure/30 group-hover:text-azure">
        <Scale className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-footnote font-medium text-foreground">{reference.title}</p>
        <p className="truncate text-caption text-muted-foreground">
          {[reference.source, ...refs].filter(Boolean).join(" · ") || "Referência normativa"}
        </p>
      </div>
      {reference.badge && (
        <Badge tone="accent" className="hidden sm:inline-flex">
          {reference.badge}
        </Badge>
      )}
      {action}
    </div>
  );
}
