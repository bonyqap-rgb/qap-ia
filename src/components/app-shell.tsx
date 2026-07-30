import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, ChevronRight } from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

/** Rótulos legíveis para cada segmento de rota (usados no breadcrumb). */
const routeLabels: Record<string, string> = {
  chat: "Chat Jurídico",
  dashboard: "Dashboard",
  knowledge: "Base de Conhecimento",
  documents: "Documentos",
  history: "Histórico",
  admin: "Administração",
  settings: "Preferências",
  help: "Ajuda",
  profile: "Minha Conta",
  // Subseções administrativas
  ia: "IA",
  rag: "RAG",
  sistema: "Sistema",
  api: "API",
  monitoramento: "Monitoramento",
  logs: "Logs",
  base: "Base de Conhecimento",
  seguranca: "Segurança",
  backup: "Backup",
};

/** Rotas públicas (site institucional e autenticação) não usam o shell interno. */
const PUBLIC_ROUTES = new Set([
  "/",
  "/pricing",
  "/contact",
  "/privacy",
  "/terms",
  "/lgpd",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
]);

function Breadcrumbs({ pathname }: { pathname: string }) {
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((seg, i) => ({
    label: routeLabels[seg] ?? decodeURIComponent(seg),
    href: `/${segments.slice(0, i + 1).join("/")}`,
    isLast: i === segments.length - 1,
  }));

  return (
    <nav
      aria-label="Trilha de navegação"
      className="hidden min-w-0 items-center gap-1 text-xs font-medium text-muted-foreground sm:flex"
    >
      <Link
        to="/dashboard"
        className="shrink-0 rounded px-1 py-0.5 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        QAP IA
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex min-w-0 items-center gap-1">
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" aria-hidden />
          {crumb.isLast ? (
            <span className="truncate px-1 py-0.5 text-foreground" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.href}
              className="truncate rounded px-1 py-0.5 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
          className="h-8 w-8"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {theme === "dark" ? "Tema claro" : "Tema escuro"}
      </TooltipContent>
    </Tooltip>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  if (PUBLIC_ROUTES.has(pathname.replace(/(.)\/$/, "$1"))) {
    return (
      <>
        {children}
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <SidebarProvider>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Ir para o conteúdo principal
        </a>
        <div className="flex min-h-dvh w-full bg-background">
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-card/70 px-3 backdrop-blur-md">
              <SidebarTrigger className="h-8 w-8" />
              <div className="h-4 w-px bg-border" aria-hidden />
              <Breadcrumbs pathname={pathname} />
              <div className="ml-auto flex items-center gap-1.5">
                <ThemeToggle />
                <div className="mx-1 h-4 w-px bg-border" aria-hidden />
                <Link
                  to="/profile"
                  aria-label="Abrir minha conta"
                  className={cn(
                    "rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    pathname === "/profile" && "ring-2 ring-azure",
                  )}
                >
                  <Avatar className="h-8 w-8 border border-border transition hover:border-azure">
                    <AvatarFallback className="bg-navy text-[11px] font-semibold text-primary-foreground">
                      PM
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            </header>
            <main id="conteudo" className="flex min-w-0 flex-1 flex-col">
              {children}
            </main>
          </div>
        </div>
        <Toaster position="top-right" />
      </SidebarProvider>
    </TooltipProvider>
  );
}
