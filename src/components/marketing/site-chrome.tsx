import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Recursos", to: "/" as const, hash: "recursos" },
  { label: "Demonstração", to: "/" as const, hash: "demo" },
  { label: "Planos", to: "/pricing" as const },
  { label: "Ajuda", to: "/help" as const },
  { label: "Contato", to: "/contact" as const },
];

function ThemeButton() {
  const { theme, toggle } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
      className="h-9 w-9"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="QAP IA — início">
          <BrandLogo size={34} />
          <span className="truncate font-display text-base font-bold tracking-tight text-foreground">
            QAP <span className="text-azure">IA</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {navLinks.map((l) =>
            l.hash ? (
              <a
                key={l.label}
                href={`#${l.hash}`}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                to={l.to}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeButton />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-gradient-azure text-primary-foreground shadow-azure transition-all hover:brightness-110"
          >
            <Link to="/chat">Abrir plataforma</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/95 px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Navegação móvel">
            {navLinks.map((l) =>
              l.hash ? (
                <a
                  key={l.label}
                  href={`#${l.hash}`}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {l.label}
                </Link>
              ),
            )}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground sm:hidden"
            >
              Entrar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

const footerGroups: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Produto",
    links: [
      { label: "Chat Jurídico", to: "/chat" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Base de Conhecimento", to: "/knowledge" },
      { label: "Documentos", to: "/documents" },
      { label: "Planos", to: "/pricing" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Contato", to: "/contact" },
      { label: "Central de Ajuda", to: "/help" },
      { label: "Configurações", to: "/settings" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Política de Privacidade", to: "/privacy" },
      { label: "Termos de Uso", to: "/terms" },
      { label: "LGPD", to: "/lgpd" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div className="min-w-0">
            <Link to="/" className="flex items-center gap-2.5">
              <BrandLogo size={34} />
              <span className="font-display text-base font-bold tracking-tight text-foreground">
                QAP <span className="text-azure">IA</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Inteligência que apoia quem protege. Pesquisa jurídica e administrativa
              com base legal citada em toda resposta.
            </p>
          </div>

          {footerGroups.map((g) => (
            <div key={g.title}>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {g.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} QAP IA. Todos os direitos reservados.</p>
          <p className="max-w-md sm:text-right">
            As respostas possuem caráter informativo e devem ser conferidas na
            legislação oficial.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function MarketingLayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className={cn("flex-1", className)}>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-border/60 bg-linear-to-b from-azure/8 to-transparent">
      <div className="mx-auto w-full max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
        {eyebrow && (
          <span className="inline-flex items-center rounded-full border border-azure/25 bg-azure/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-azure-dark">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
