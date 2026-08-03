import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-gradient-navy lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-azure/25 blur-3xl"
        />
        <Link to="/" className="relative flex items-center gap-2.5">
          <BrandLogo size={38} />
          <span className="font-display text-base font-bold tracking-tight text-primary-foreground">
            QAP <span className="text-azure-light">IA</span>
          </span>
        </Link>

        <div className="relative max-w-sm">
          <ShieldCheck className="h-7 w-7 text-azure-light" />
          <p className="mt-4 font-display text-2xl font-bold leading-snug tracking-tight text-primary-foreground">
            Inteligência que apoia quem protege.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-steel-light/80">
            Consultas jurídicas e administrativas objetivas, com base legal citada e a base
            documental da sua unidade sempre à mão.
          </p>
        </div>

        <p className="relative text-[11px] text-steel-light/60">
          As respostas possuem caráter informativo e devem ser conferidas na legislação oficial.
        </p>
      </aside>

      <main className="flex flex-col justify-center px-4 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-sm">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao site
          </Link>

          <div className="lg:hidden">
            <BrandLogo size={44} className="mb-5 rounded-2xl shadow-azure" />
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>

          <div className="mt-7">{children}</div>

          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

export function authHead(title: string, description: string, path: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `https://qap-ia.lovable.app${path}` },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `https://qap-ia.lovable.app${path}` }],
  };
}
