import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, ChevronRight, Search, Bell } from "lucide-react";

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

const routeLabels: Record<string, string> = {
  "": "Início",
  chat: "Chat Jurídico",
  dashboard: "Dashboard",
  knowledge: "Base de Conhecimento",
  documents: "Documentos",
  history: "Histórico",
  admin: "Administração",
  settings: "Configurações",
  help: "Ajuda",
  profile: "Meu perfil",
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
  const crumbs = segments.length === 0 ? [""] : segments;

  return (
    <nav
      aria-label="Breadcrumb"
      className="hidden min-w-0 items-center gap-1 text-xs font-medium text-muted-foreground sm:flex"
    >
      <Link
        to="/"
        className="rounded px-1 py-0.5 hover:bg-muted hover:text-foreground"
      >
        QAP IA
      </Link>
      {crumbs.map((seg, i) => {
        const label = routeLabels[seg] ?? seg;
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex min-w-0 items-center gap-1">
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
            <span
              className={cn(
                "truncate",
                isLast ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </span>
        );
      })}
    </nav>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label="Alternar tema"
            className="h-8 w-8"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {theme === "dark" ? "Tema claro" : "Tema escuro"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-card/70 px-3 backdrop-blur-md">
            <SidebarTrigger className="h-8 w-8" />
            <div className="h-4 w-px bg-border" />
            <Breadcrumbs pathname={pathname} />
            <div className="ml-auto flex items-center gap-1.5">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Buscar"
                      className="hidden h-8 w-8 sm:inline-flex"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Buscar (⌘K)</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Notificações"
                      className="hidden h-8 w-8 sm:inline-flex"
                    >
                      <Bell className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Notificações</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <ThemeToggle />
              <div className="mx-1 h-4 w-px bg-border" />
              <Link
                to="/profile"
                aria-label="Meu perfil"
                className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar className="h-8 w-8 border border-border transition hover:border-azure">
                  <AvatarFallback className="bg-navy text-[11px] font-semibold text-primary-foreground">
                    PM
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </header>
          <main className="flex min-w-0 flex-1 flex-col">{children}</main>
        </div>
      </div>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
}
