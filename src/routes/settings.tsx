import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  User,
  Palette,
  Sparkles,
  Lock,
  Shield,
  Bell,
  Cpu,
  Info,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Trash2,
  Download,
  History,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import {
  Container,
  Section,
  Card,
  Panel,
  Badge,
  Button,
  Divider,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
} from "@/components/ds";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand-logo";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Configurações — QAP IA" },
      {
        name: "description",
        content: "Central de preferências e configurações do seu assistente QAP IA.",
      },
      { property: "og:title", content: "Configurações — QAP IA" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: any;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0", className)}>
      <div className="flex items-start gap-3 min-w-0">
        <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-border/50 bg-muted/30 text-muted-foreground group-hover:border-azure/30 group-hover:text-azure transition-colors">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {description && <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [keepHistory, setKeepHistory] = useState(true);
  const [activeTab, setActiveTab] = useState("appearance");

  const navigation = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "appearance", label: "Aparência", icon: Palette },
    { id: "ai", label: "Inteligência Artificial", icon: Sparkles },
    { id: "privacy", label: "Privacidade", icon: Lock },
    { id: "security", label: "Segurança", icon: Shield },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "system", label: "Sistema", icon: Cpu },
    { id: "about", label: "Sobre", icon: Info },
  ];

  const handleExport = () => {
    toast.success("Preparando exportação de dados...", {
      description: "Você receberá um link de download em breve.",
    });
  };

  const handleClearHistory = () => {
    toast.error("Histórico limpo com sucesso", {
      description: "Todas as suas conversas locais foram removidas.",
    });
  };

  return (
    <Container className="py-8 md:py-12">
      <Section className="mb-8">
        <header className="flex flex-col gap-1">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Configurações
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Gerencie suas preferências de interface, segurança e o comportamento do seu assistente de inteligência.
          </p>
        </header>
      </Section>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        {/* Sidebar Interna */}
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                activeTab === item.id
                  ? "bg-azure/10 text-azure shadow-sm"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
              {activeTab === item.id && (
                <ChevronRight className="ml-auto size-3.5 opacity-60" />
              )}
            </button>
          ))}
        </nav>

        {/* Conteúdo Principal */}
        <div className="space-y-6">
          {activeTab === "appearance" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Panel title="Aparência">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { id: "light", label: "Claro", icon: Sun, preview: "bg-white border-border" },
                    { id: "dark", label: "Escuro", icon: Moon, preview: "bg-zinc-900 border-zinc-800" },
                    { id: "system", label: "Sistema", icon: Monitor, preview: "bg-linear-to-br from-white to-zinc-900 border-border" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setTheme(option.id as any)}
                      className={cn(
                        "group relative flex flex-col items-center gap-3 rounded-2xl border bg-card p-4 transition-all duration-300",
                        theme === option.id
                          ? "border-azure ring-1 ring-azure/30 shadow-azure"
                          : "border-border/60 hover:border-azure/40 hover:bg-muted/30"
                      )}
                    >
                      <div className={cn("h-20 w-full rounded-lg border shadow-xs overflow-hidden", option.preview)}>
                        <div className="p-2 space-y-1.5 opacity-40">
                          <div className={cn("h-2 w-1/2 rounded-full", option.id === 'dark' ? 'bg-zinc-700' : 'bg-zinc-200')} />
                          <div className={cn("h-2 w-3/4 rounded-full", option.id === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100')} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <option.icon className={cn("size-3.5", theme === option.id ? "text-azure" : "text-muted-foreground")} />
                        <span className="text-xs font-semibold">{option.label}</span>
                      </div>
                      {theme === option.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="size-4 text-azure fill-background" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </Panel>

              <Card className="p-6">
                <div className="divide-y divide-border/40">
                  <SettingRow
                    icon={Sparkles}
                    title="Animações suaves"
                    description="Ativa microinterações e transições elegantes em toda a plataforma."
                  >
                    <Switch checked={animations} onCheckedChange={setAnimations} />
                  </SettingRow>
                  <SettingRow
                    icon={History}
                    title="Histórico Local"
                    description="Mantém suas últimas conversas salvas para acesso rápido offline."
                  >
                    <Switch checked={keepHistory} onCheckedChange={setKeepHistory} />
                  </SettingRow>
                </div>
              </Card>

              <Panel title="Idioma" description="Defina o idioma global da interface.">
                <Select defaultValue="pt-BR">
                  <SelectTrigger className="w-full sm:w-[300px]">
                    <SelectValue placeholder="Selecione o idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en">Inglês (Estados Unidos)</SelectItem>
                    <SelectItem value="es">Espanhol (Espanha)</SelectItem>
                  </SelectContent>
                </Select>
              </Panel>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Panel title="Modelo de Linguagem">
                <Card padding="sm" className="bg-azure/5 border-azure/20">
                  <div className="flex items-center gap-4">
                    <div className="grid size-10 place-items-center rounded-xl bg-azure/10 text-azure shadow-sm">
                      <Sparkles className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">Groq Llama 3.1 70B</p>
                      <p className="text-xs text-muted-foreground">Provedor ativo via QAP IA Enterprise</p>
                    </div>
                    <Badge tone="accent">Ativo</Badge>
                  </div>
                </Card>
              </Panel>

              <Panel title="Configurações de Resposta" description="Personalize como o assistente interage com você.">
                <div className="space-y-4">
                  <div className="rounded-xl border border-border/60 p-4 bg-muted/20">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Comportamento Padrão</p>
                    <p className="text-sm text-foreground">O assistente prioriza objetividade, base legal brasileira e organização técnica em 3 partes.</p>
                  </div>
                  <Button variant="outline" size="sm" disabled className="opacity-50">
                    Editar System Prompt (Admin)
                  </Button>
                </div>
              </Panel>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Panel title="Gestão de Dados">
                <div className="space-y-4">
                  <div className="rounded-xl border border-border/60 p-5 space-y-4">
                    <div className="flex items-start gap-4">
                      <Download className="size-5 text-azure" />
                      <div>
                        <p className="text-sm font-semibold">Exportar meus dados</p>
                        <p className="text-xs text-muted-foreground mb-3">Baixe um arquivo contendo todas as suas interações e documentos favoritos.</p>
                        <Button variant="outline" size="sm" onClick={handleExport}>
                          Solicitar Exportação
                        </Button>
                      </div>
                    </div>
                    <Divider />
                    <div className="flex items-start gap-4 pt-2">
                      <Trash2 className="size-5 text-destructive" />
                      <div>
                        <p className="text-sm font-semibold">Excluir Histórico</p>
                        <p className="text-xs text-muted-foreground mb-3">Remova permanentemente todo o seu histórico de conversas deste dispositivo.</p>
                        <Button variant="destructive" size="sm" onClick={handleClearHistory}>
                          Limpar Tudo
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Panel title="Sessão Atual">
                <Card padding="sm" className="border-emerald-500/20 bg-emerald-500/5">
                  <div className="flex items-center gap-4">
                    <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
                      <ShieldCheck className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">Autenticado</p>
                      <p className="text-xs text-muted-foreground">Conectado via Token Corporativo PMESP</p>
                    </div>
                    <Badge tone="success">Seguro</Badge>
                  </div>
                </Card>
              </Panel>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Panel title="Central de Alertas">
                <Card className="p-6">
                  <div className="divide-y divide-border/40">
                    <SettingRow
                      icon={Bell}
                      title="Notificações de Sistema"
                      description="Alertas sobre novas legislações e atualizações da plataforma."
                    >
                      <Switch checked={notifications} onCheckedChange={setNotifications} />
                    </SettingRow>
                    <SettingRow
                      icon={Cpu}
                      title="Logs de Execução"
                      description="Mostrar notificações técnicas quando o RAG recupera contexto."
                    >
                      <Switch checked={false} disabled />
                    </SettingRow>
                  </div>
                </Card>
              </Panel>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Panel title="Sobre o QAP IA">
                <div className="flex flex-col items-center text-center p-8 bg-muted/20 rounded-2xl border border-border/40">
                  <BrandLogo size={80} className="mb-4 rounded-2xl shadow-azure" />
                  <h3 className="font-display text-xl font-bold">QAP IA Enterprise</h3>
                  <p className="text-sm text-muted-foreground mt-1">Versão 2.4.0 (Build 2026.08.04)</p>
                  
                  <div className="flex gap-2 mt-6">
                    <Badge tone="accent">Produção</Badge>
                    <Badge tone="info">API v1.2</Badge>
                  </div>

                  <p className="mt-8 text-xs text-muted-foreground max-w-sm">
                    Inteligência Artificial que apoia quem protege. Desenvolvido para agilizar a pesquisa jurídica e administrativa na segurança pública.
                  </p>
                </div>
              </Panel>
            </div>
          )}

          {/* Placeholder para as abas ainda não detalhadas no objetivo */}
          {["profile", "system"].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
              <div className="size-16 rounded-full bg-muted/40 grid place-items-center mb-4">
                <Info className="size-8 text-muted-foreground/60" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">Em desenvolvimento</h3>
              <p className="text-sm text-muted-foreground max-w-xs mt-1">
                A seção de {navigation.find(n => n.id === activeTab)?.label} está sendo preparada para a próxima versão.
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
