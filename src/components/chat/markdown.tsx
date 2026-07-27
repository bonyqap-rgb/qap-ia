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
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-gold-light">
        <span>{lang}</span>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-gold-light/70 transition hover:bg-white/10 hover:text-gold-light"
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

export function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div
      className={cn(
        "prose-sm max-w-none text-sm leading-relaxed text-foreground [&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_a]:text-navy [&_a]:underline [&_strong]:font-semibold [&_h1]:mt-3 [&_h1]:mb-1 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:mt-3 [&_h2]:mb-1 [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_table]:my-2 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: any) {
            const value = String(children).replace(/\n$/, "");
            if (inline) {
              return (
                <code
                  className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-navy"
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
