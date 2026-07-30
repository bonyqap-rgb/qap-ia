import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { adminItems } from "@/components/app-sidebar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administração — QAP IA" },
      {
        name: "description",
        content:
          "Painel administrativo do QAP IA — IA, RAG, sistema, API, monitoramento, logs, segurança e backup.",
      },
      { property: "og:title", content: "Administração — QAP IA" },
      {
        property: "og:description",
        content:
          "Painel administrativo do QAP IA — IA, RAG, sistema, API, monitoramento, logs, segurança e backup.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const tabs = [{ title: "Visão geral", url: "/admin" }, ...adminItems];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <ShieldCheck className="h-6 w-6 text-azure" />
            Administração
          </h1>
          <p className="text-sm text-muted-foreground">
            Ferramentas técnicas e operacionais da plataforma QAP IA.
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit gap-1.5 border-azure/40 bg-azure/10 text-azure-dark"
        >
          Acesso restrito · Nível 3
        </Badge>
      </div>

      <nav
        aria-label="Seções administrativas"
        className="mb-6 flex gap-1 overflow-x-auto border-b border-border/60 pb-px"
      >
        {tabs.map((tab) => {
          const active =
            tab.url === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.url);
          return (
            <Link
              key={tab.url}
              to={tab.url}
              className={cn(
                "-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-[13px] font-medium transition-colors",
                active
                  ? "border-azure text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {tab.title}
            </Link>
          );
        })}
      </nav>

      <Outlet />
    </div>
  );
}
