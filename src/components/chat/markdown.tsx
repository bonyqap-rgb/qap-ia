import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const lang = className?.replace("language-", "") || "text";

  const onCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative my-3 overflow-hidden rounded-lg border border-border bg-navy-dark">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-azure-light">
        <span>{lang}</span>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? "Código copiado" : "Copiar código"}
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-azure-light/80 transition hover:bg-white/10 hover:text-azure-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-light"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-primary-foreground">
        <code>{children}</code>
      </pre>
    </div>
  );
}

/**
 * Renderização Markdown otimizada para leitura jurídica:
 * medidas de linha confortáveis, listas legíveis, tabelas com rolagem
 * horizontal e citações destacadas.
 */
export function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-none text-[15px] leading-[1.75] text-foreground",
        "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        "[&_p]:my-3",
        "[&_ul]:my-3 [&_ol]:my-3 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:my-1 [&_li]:pl-0.5 [&_li>ul]:my-1 [&_li>ol]:my-1",
        "[&_a]:font-medium [&_a]:text-azure-dark [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-azure",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_h1]:mt-5 [&_h1]:mb-2 [&_h1]:font-display [&_h1]:text-[17px] [&_h1]:font-bold [&_h1]:tracking-tight",
        "[&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-[15px] [&_h2]:font-bold [&_h2]:tracking-tight",
        "[&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:text-[14px] [&_h3]:font-semibold",
        "[&_blockquote]:my-3 [&_blockquote]:rounded-r-md [&_blockquote]:border-l-2 [&_blockquote]:border-azure [&_blockquote]:bg-azure/5 [&_blockquote]:py-1.5 [&_blockquote]:pl-3 [&_blockquote]:pr-2 [&_blockquote]:text-[14px] [&_blockquote]:not-italic [&_blockquote]:text-muted-foreground",
        "[&_hr]:my-4 [&_hr]:border-border/70",
        "[&_table]:w-full [&_table]:border-collapse [&_table]:text-[13px]",
        "[&_thead]:bg-muted/60 [&_th]:border [&_th]:border-border [&_th]:px-2.5 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-semibold",
        "[&_td]:border [&_td]:border-border [&_td]:px-2.5 [&_td]:py-1.5 [&_td]:align-top",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-lg border border-border">
              <table>{children}</table>
            </div>
          ),
          code({
            inline,
            className,
            children,
            ...props
          }: {
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
          }) {
            const value = String(children).replace(/\n$/, "");
            if (inline) {
              return (
                <code
                  className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-azure-dark"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return <CodeBlock className={className}>{value}</CodeBlock>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
