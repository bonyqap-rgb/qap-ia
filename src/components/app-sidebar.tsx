import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  MessageSquarePlus,
  BookOpen,
  SlidersHorizontal,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  FileText,
  History,
  ShieldCheck,
  UserRound,
  Brain,
  Layers,
  Server,
  Plug,
  Activity,
  ScrollText,
  Lock,
  ChevronRight,
  DatabaseBackup,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";


type NavItem = { title: string; url: string; icon: typeof BookOpen; badge?: string };

const platformItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Chat", url: "/chat", icon: MessageSquare },
  { title: "Histórico", url: "/history", icon: History },
  { title: "Base de Conhecimento", url: "/knowledge", icon: BookOpen },
  { title: "Documentos", url: "/documents", icon: FileText },
];

const accountItems: NavItem[] = [
  { title: "Minha Conta", url: "/profile", icon: UserRound },
  { title: "Preferências", url: "/settings", icon: SlidersHorizontal },
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
                "relative rounded-lg transition-colors",
                nested && !collapsed && "h-8",
                active &&
                  "nav-active before:absolute before:left-0 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-azure",
              )}
            >
              <Link to={item.url} className="flex items-center gap-2.5">
                <item.icon
                  className={cn(
                    "shrink-0",
                    nested ? "h-3.5 w-3.5" : "h-4 w-4",
                    active ? "text-azure" : "text-muted-foreground",
                  )}
                />
                {!collapsed && (
                  <>
                    <span
                      className={cn(
                        "flex-1 truncate",
                        nested ? "text-[12.5px]" : "text-[13px]",
                      )}
                    >
                      {item.title}
                    </span>
                    {item.badge && (
                      <Badge
                        variant="outline"
                        className="h-5 border-azure/40 bg-azure/10 px-1.5 text-[10px] font-semibold text-azure-dark"
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
      <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
        {label}
      </SidebarGroupLabel>
    );

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="border-b border-border/60 bg-gradient-navy">
        <div className="flex items-center gap-2.5 px-1 py-1.5">
          <BrandLogo size={36} className="shadow-azure" />
          {!collapsed && (
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate font-display text-sm font-bold tracking-tight text-primary-foreground">
                QAP <span className="text-azure-light">IA</span>
              </span>
              <span className="truncate text-[10px] font-medium uppercase tracking-[0.08em] text-steel-light/70">
                Inteligência que protege
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="px-2 pt-2">
              <Button
                asChild
                className="w-full justify-start gap-2 bg-gradient-azure text-primary-foreground shadow-azure transition-all hover:brightness-110"
                size={collapsed ? "icon" : "default"}
              >
                <Link to="/chat">
                  <MessageSquarePlus className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>Nova conversa</span>}
                </Link>
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {groupLabel("Plataforma")}
          <SidebarGroupContent>{renderItems(platformItems)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {groupLabel("Conta")}
          <SidebarGroupContent>{renderItems(accountItems)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {groupLabel("Administração")}
          <SidebarGroupContent className="space-y-1">
            {renderItems([
              {
                title: "Visão geral",
                url: "/admin",
                icon: ShieldCheck,
                badge: "Admin",
              },
            ])}
            {!collapsed && (
              <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
                <CollapsibleTrigger className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/80 transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <ChevronRight
                    className={cn(
                      "h-3 w-3 shrink-0 transition-transform duration-200",
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

      </SidebarContent>

      <SidebarFooter className="border-t border-border/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/help")} tooltip="Ajuda">
              <Link to="/help" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Ajuda</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {!collapsed && (
          <div className="px-2 pb-2 pt-1 text-[10px] font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Sistema operacional · v0.9.0
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
