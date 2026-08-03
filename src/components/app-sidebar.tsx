import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  MessageSquarePlus,
  Scale,
  History,
  Star,
  Share2,
  Download,
  SlidersHorizontal,
  ShieldCheck,
  Brain,
  Layers,
  Server,
  Plug,
  Activity,
  ScrollText,
  Lock,
  DatabaseBackup,
  BookOpen,
  ChevronRight,
  HelpCircle,
  Sparkle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

type NavItem = { title: string; url: string; icon: typeof BookOpen; badge?: string };

const primaryItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Nova Consulta", url: "/chat", icon: MessageSquarePlus },
  { title: "Base Legal", url: "/knowledge", icon: Scale },
  { title: "Histórico", url: "/history", icon: History },
];

const workspaceItems: NavItem[] = [
  { title: "Favoritos", url: "/favorites", icon: Star },
  { title: "Compartilhados", url: "/shared", icon: Share2 },
  { title: "Exportações", url: "/exports", icon: Download },
  { title: "Configurações", url: "/settings", icon: SlidersHorizontal },
];

export const adminItems: NavItem[] = [
  { title: "IA", url: "/admin/ia", icon: Brain },
  { title: "RAG", url: "/admin/rag", icon: Layers },
  { title: "Sistema", url: "/admin/sistema", icon: Server },
  { title: "API", url: "/admin/api", icon: Plug },
  { title: "Monitoramento", url: "/admin/monitoramento", icon: Activity },
  { title: "Logs", url: "/admin/logs", icon: ScrollText },
  { title: "Base de Conhecimento", url: "/admin/base", icon: BookOpen },
  { title: "Segurança", url: "/admin/seguranca", icon: Lock },
  { title: "Backup", url: "/admin/backup", icon: DatabaseBackup },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const inAdmin = currentPath.startsWith("/admin/");
  const [adminOpen, setAdminOpen] = useState(inAdmin);

  useEffect(() => {
    if (inAdmin) setAdminOpen(true);
  }, [inAdmin]);

  const isActive = (path: string) =>
    path === "/" || path === "/admin"
      ? currentPath === path
      : currentPath === path || currentPath.startsWith(`${path}/`);

  const renderItems = (items: NavItem[], nested?: boolean) => (
    <SidebarMenu>
      {items.map((item) => {
        const active = isActive(item.url);
        return (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton
              asChild
              isActive={active}
              tooltip={item.title}
              className={cn(
                "relative rounded-xl transition-[background-color,color,transform] duration-200 ease-[var(--ease-standard)]",
                nested && !collapsed && "h-8",
                active
                  ? "bg-azure/10 font-semibold text-azure-dark before:absolute before:left-0 before:top-1/2 before:h-4 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-azure dark:text-azure-light"
                  : "hover:bg-muted/70",
              )}
            >
              <Link to={item.url} className="flex items-center gap-2.5">
                <item.icon
                  className={cn(
                    "shrink-0 transition-colors",
                    nested ? "size-3.5" : "size-4",
                    active ? "text-azure" : "text-muted-foreground",
                  )}
                />
                {!collapsed && (
                  <>
                    <span
                      className={cn("flex-1 truncate", nested ? "text-[12.5px]" : "text-footnote")}
                    >
                      {item.title}
                    </span>
                    {item.badge && (
                      <Badge
                        variant="outline"
                        className="h-5 border-azure/30 bg-azure/10 px-1.5 text-[10px] font-semibold text-azure-dark dark:text-azure-light"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );

  const groupLabel = (label: string) =>
    !collapsed && (
      <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
        {label}
      </SidebarGroupLabel>
    );

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="border-b border-border/50">
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 rounded-xl px-1 py-1.5 outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <BrandLogo size={34} />
          {!collapsed && (
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate font-display text-sm font-bold tracking-tight text-foreground">
                QAP <span className="text-azure">IA</span>
              </span>
              <span className="truncate text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                Inteligência jurídica
              </span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-1">
        <SidebarGroup>
          {groupLabel("Plataforma")}
          <SidebarGroupContent>{renderItems(primaryItems)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {groupLabel("Workspace")}
          <SidebarGroupContent>{renderItems(workspaceItems)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {groupLabel("Administração")}
          <SidebarGroupContent className="space-y-1">
            {renderItems([
              { title: "Visão geral", url: "/admin", icon: ShieldCheck, badge: "Admin" },
            ])}
            {!collapsed && (
              <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
                <CollapsibleTrigger className="flex w-full items-center gap-1.5 rounded-xl px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/80 transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <ChevronRight
                    className={cn(
                      "size-3 shrink-0 transition-transform duration-200",
                      adminOpen && "rotate-90",
                    )}
                    aria-hidden
                  />
                  Seções técnicas
                  <span className="ml-auto text-[10px] font-medium normal-case tracking-normal text-muted-foreground/70">
                    {adminItems.length}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <div className="ml-3 mt-1 border-l border-border/60 pl-1.5">
                    {renderItems(adminItems, true)}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
            {collapsed && renderItems(adminItems, true)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            {renderItems([{ title: "Ajuda", url: "/help", icon: HelpCircle }])}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2 border-t border-border/50">
        {!collapsed && (
          <div className="rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5">
            <div className="flex items-center gap-1.5">
              <Sparkle className="size-3.5 text-azure" aria-hidden />
              <span className="text-caption font-semibold text-foreground">Plano Profissional</span>
            </div>
            <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
              Consultas ilimitadas · Base legal completa
            </p>
          </div>
        )}
        <Link
          to="/profile"
          className={cn(
            "flex items-center gap-2.5 rounded-xl px-1.5 py-1.5 outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring",
            collapsed && "justify-center px-0",
          )}
        >
          <Avatar className="size-8 border border-border/70">
            <AvatarFallback className="bg-navy text-[11px] font-semibold text-primary-foreground">
              PM
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-footnote font-medium text-foreground">
                Agente QAP IA
              </span>
              <span className="truncate text-[10px] text-muted-foreground">Minha conta</span>
            </span>
          )}
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
