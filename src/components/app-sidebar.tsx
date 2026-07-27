import { Link, useRouterState } from "@tanstack/react-router";
import {
  MessageSquarePlus,
  History,
  BookOpen,
  Settings,
  HelpCircle,
  LayoutDashboard,
  ShieldCheck,
  MessageSquare,
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

const primaryItems = [
  { title: "Nova conversa", url: "/", icon: MessageSquarePlus },
  { title: "Base de Conhecimento", url: "/knowledge", icon: BookOpen },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

const bottomItems = [
  { title: "Configurações", url: "/settings", icon: Settings },
  { title: "Ajuda", url: "/help", icon: HelpCircle },
];

const mockHistory = [
  { id: "1", title: "Procedimento de ocorrência administrativa" },
  { id: "2", title: "Prazos recursais no processo disciplinar" },
  { id: "3", title: "Uso progressivo da força" },
  { id: "4", title: "Regulamento disciplinar da PM" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({
    select: (r) => r.location.pathname,
  });
  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

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
                Consultor Jurídico
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

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Navegação</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryItems.slice(1).map((item) => (
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
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>
              <History className="mr-1.5 inline h-3.5 w-3.5" />
              Histórico
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mockHistory.map((h) => (
                  <SidebarMenuItem key={h.id}>
                    <SidebarMenuButton className="text-muted-foreground">
                      <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate text-xs">{h.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
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
      </SidebarFooter>
    </Sidebar>
  );
}
