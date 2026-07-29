import { BookMarked, ExternalLink } from "lucide-react";

/**
 * Extrai referências de base legal do texto da resposta.
 * Puramente visual — não altera o conteúdo retornado pelo serviço de IA.
 */
export function extractSources(content: string): string[] {
  const lines = content.split("\n");
  const sources: string[] = [];

  for (const line of lines) {
    const match = line.match(/^\s*(?:\*\*)?(base legal|fonte|fundamento legal)(?:\*\*)?\s*:\s*(.+)$/i);
    if (match) {
      match[2]
        .replace(/\*\*/g, "")
        .split(/;|\s+e\s+(?=[A-ZÀ-Ú])/)
        .map((s) => s.trim().replace(/\.$/, ""))
        .filter((s) => s.length > 3)
        .forEach((s) => {
          if (!sources.includes(s)) sources.push(s);
        });
    }
  }

  return sources.slice(0, 4);
}

export function SourceCards({ sources }: { sources: string[] }) {
  if (sources.length === 0) return null;

  return (
    <div className="mt-3.5 border-t border-border/60 pt-3">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        <BookMarked className="h-3 w-3 text-azure" />
        Fontes citadas
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {sources.map((s) => (
          <div
            key={s}
            className="group flex items-start gap-2 rounded-lg border border-border/70 bg-muted/40 px-2.5 py-2 transition-colors hover:border-azure/45 hover:bg-azure/5"
          >
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-azure/12 text-azure">
              <BookMarked className="h-3 w-3" />
            </span>
            <span className="min-w-0 flex-1 text-[12px] font-medium leading-snug text-foreground">
              {s}
            </span>
            <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
        Confira sempre o texto integral na legislação oficial vigente.
      </p>
    </div>
  );
}
