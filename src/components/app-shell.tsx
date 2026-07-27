import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center gap-2 border-b border-border/60 bg-card/70 px-3 backdrop-blur-md">
            <SidebarTrigger />
            <div className="h-4 w-px bg-border" />
            <span className="text-xs font-medium text-muted-foreground">
              QAP IA · Assistente Inteligente
            </span>
          </header>
          <main className="flex min-w-0 flex-1 flex-col">{children}</main>
        </div>
      </div>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
}
