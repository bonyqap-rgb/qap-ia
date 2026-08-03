import { BookMarked, Clock, Cpu, FileText, Gauge } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Citation } from "@/types/api";

/** Barra de metadados da resposta: modelo, tempo, confiança e documentos usados. */
export function AnswerMeta({
  model,
  latencyMs,
  confidence,
  usedDocuments,
}: {
  model?: string;
  latencyMs?: number;
  confidence?: number;
  usedDocuments?: Array<{ id?: string; name: string }>;
}) {
  const items: Array<{ icon: typeof Cpu; label: string; title: string }> = [];
  if (model) items.push({ icon: Cpu, label: model, title: "Modelo utilizado" });
  if (typeof latencyMs === "number")
    items.push({
      icon: Clock,
      label: `${(latencyMs / 1000).toFixed(1)}s`,
      title: "Tempo de resposta",
    });
  if (typeof confidence === "number")
    items.push({
      icon: Gauge,
      label: `${Math.round(confidence * 100)}% de confiança`,
      title: "Confiança estimada da resposta",
    });
  if (usedDocuments?.length)
    items.push({
      icon: FileText,
      label: `${usedDocuments.length} documento(s)`,
      title: usedDocuments.map((d) => d.name).join(", "),
    });

  if (!items.length) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {items.map((item) => (
        <Tooltip key={item.label}>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className="gap-1 border-border/70 bg-muted/40 text-[10px] font-medium text-muted-foreground"
            >
              <item.icon className="h-3 w-3" />
              {item.label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>{item.title}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

/** Citações clicáveis retornadas pelo backend RAG. */
export function CitationList({
  citations,
  onSelect,
}: {
  citations: Citation[];
  onSelect?: (citation: Citation) => void;
}) {
  if (!citations.length) return null;

  return (
    <div className="mt-3.5 border-t border-border/60 pt-3">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        <BookMarked className="h-3 w-3 text-azure" />
        Trechos utilizados
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {citations.map((c, index) => (
          <button
            key={c.chunkId ?? `${c.documentName}-${index}`}
            type="button"
            onClick={() => onSelect?.(c)}
            className={cn(
              "group flex w-full items-start gap-2 rounded-lg border border-border/70 bg-muted/40 px-2.5 py-2 text-left transition-colors",
              "hover:border-azure/45 hover:bg-azure/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50",
            )}
          >
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-azure/12 text-[10px] font-bold text-azure">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] font-medium text-foreground">
                {c.documentName}
                {c.page ? ` · p. ${c.page}` : ""}
              </span>
              {c.snippet && (
                <span className="mt-0.5 line-clamp-2 block text-[11px] leading-snug text-muted-foreground">
                  {c.snippet}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
