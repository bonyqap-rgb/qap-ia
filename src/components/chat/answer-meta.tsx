import { BookMarked, Clock, Cpu, FileText, Gauge, Scale } from "lucide-react";

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

  const cleanUsedDocs = usedDocuments?.filter(
    (d) => d.name && !/n[ãa]o\s+especificado/i.test(d.name),
  );

  if (cleanUsedDocs?.length)
    items.push({
      icon: FileText,
      label: `${cleanUsedDocs.length} documento(s)`,
      title: cleanUsedDocs.map((d) => d.name).join(", "),
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
  // Limpa as citações removendo placeholders de "não especificado"
  const validCitations = citations
    .map((c) => {
      const hasInvalidDoc =
        !c.documentName ||
        /n[ãa]o\s+especificado/i.test(c.documentName) ||
        c.documentName.trim() === "";

      const hasInvalidPage =
        !c.page ||
        /n[ãa]o\s+especificado/i.test(String(c.page)) ||
        String(c.page).trim() === "" ||
        c.page === 0;

      return {
        ...c,
        documentName: hasInvalidDoc ? "" : c.documentName,
        page: hasInvalidPage ? undefined : Number(c.page),
      };
    })
    .filter((c) => c.documentName || c.snippet);

  if (!validCitations.length) return null;

  return (
    <div className="mt-5 border-t border-border/50 pt-4.5">
      <div className="mb-3.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85">
        <Scale className="h-3.5 w-3.5 text-azure" />
        Fundamentação Legal & Referências
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {validCitations.map((c, index) => (
          <button
            key={c.chunkId ?? `${c.documentName}-${index}`}
            type="button"
            onClick={() => onSelect?.(c)}
            className={cn(
              "group flex w-full flex-col gap-2.5 rounded-xl border border-border/40 bg-muted/20 p-3 text-left transition-all duration-200",
              "hover:border-azure/35 hover:bg-azure/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/40",
            )}
          >
            {/* Header da Citação (Estilo LegalItem) */}
            <div className="flex items-center gap-2.5 w-full">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-azure/8 text-azure transition-colors group-hover:bg-azure/12">
                <Scale className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-semibold text-foreground tracking-tight group-hover:text-azure transition-colors">
                  {c.documentName || "Base Normativa"}
                </span>
                {c.page && (
                  <span className="block text-[10px] font-medium text-muted-foreground">
                    Página {c.page}
                  </span>
                )}
              </div>
              <span className="inline-flex items-center justify-center rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground/80">
                #{index + 1}
              </span>
            </div>

            {/* Snippet de Texto */}
            {c.snippet && (
              <div className="border-t border-border/30 pt-2 w-full">
                <p className="line-clamp-3 text-[11px] leading-relaxed text-muted-foreground font-medium group-hover:text-foreground/90 transition-colors pl-1.5 border-l-2 border-border/50">
                  "{c.snippet}"
                </p>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
