import { Link, useRouterState } from "@tanstack/react-router";
import {
  MessageSquarePlus,
  BookOpen,
  Settings,
  HelpCircle,
  LayoutDashboard,
  ShieldCheck,
  MessageSquare,
  FileText,
  History,
  ShieldAlert,
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type NavItem = { title: string; url: string; icon: typeof BookOpen; badge?: string };

const workspaceItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Chat Jurídico", url: "/", icon: MessageSquare },
  { title: "Histórico", url: "/history", icon: History },
];

const knowledgeItems: NavItem[] = [
  { title: "Base de Conhecimento", url: "/knowledge", icon: BookOpen },
  { title: "Documentos", url: "/documents", icon: FileText },
];

const adminItems: NavItem[] = [
  { title: "Administração", url: "/admin", icon: ShieldAlert, badge: "Admin" },
];

const bottomItems: NavItem[] = [
  { title: "Configurações", url: "/settings", icon: Settings },
  { title: "Ajuda", url: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  const renderGroup = (label: string, items: NavItem[]) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.url)}
                tooltip={item.title}
              >
                <Link to={item.url} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant="outline"
                          className="h-5 border-gold/40 bg-gold/10 px-1.5 text-[10px] font-semibold text-gold-dark"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="border-b border-border/60 bg-gradient-navy">
        <div className="flex items-center gap-2.5 px-1 py-1.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold text-gold-dark shadow-gold">
            <ShieldCheck className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-bold tracking-tight text-primary-foreground">
                QAP IA
              </span>
              <span className="truncate text-[10px] font-medium uppercase tracking-wider text-gold-light/80">
                Inteligência Jurídica
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
                className="w-full justify-start gap-2 bg-navy text-primary-foreground shadow-gold hover:bg-navy-light"
                size={collapsed ? "icon" : "default"}
              >
                <Link to="/">
                  <MessageSquarePlus className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>Nova conversa</span>}
                </Link>
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {renderGroup("Espaço de trabalho", workspaceItems)}
        {renderGroup("Conhecimento", knowledgeItems)}
        {renderGroup("Gestão", adminItems)}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/60">
        <SidebarMenu>
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.url)}
                tooltip={item.title}
              >
                <Link to={item.url} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
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
