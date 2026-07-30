import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sun, Moon, Monitor, Bell, Sparkles, History, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Preferências — QAP IA" },
      {
        name: "description",
        content: "Ajuste tema, idioma, notificações, animações e histórico de conversas no QAP IA.",
      },
      { property: "og:title", content: "Preferências — QAP IA" },
      {
        property: "og:description",
        content: "Ajuste tema, idioma, notificações, animações e histórico de conversas no QAP IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

const themes = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
] as const;

function PreferenceRow({
  icon: Icon,
  title,
  description,
  checked,
  onCheckedChange,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/50 py-4 last:border-0">
      <div className="flex min-w-0 gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-azure/10 text-azure">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <Label className="text-sm font-medium text-foreground">{title}</Label>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [keepHistory, setKeepHistory] = useState(true);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 md:px-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Preferências
        </h1>
        <p className="text-sm text-muted-foreground">
          Personalize a aparência e o comportamento da plataforma para o seu uso.
        </p>
      </div>

      <div className="space-y-4">
        <Card className="surface-panel">
          <CardHeader>
            <CardTitle className="text-[15px]">Aparência</CardTitle>
            <CardDescription>Tema da interface</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {themes.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition-all hover-lift",
                  theme === option.value
                    ? "border-azure bg-azure/5 shadow-azure"
                    : "border-border/70 hover:border-border",
                )}
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-foreground">
                  <option.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="surface-panel">
          <CardHeader>
            <CardTitle className="text-[15px]">Idioma</CardTitle>
            <CardDescription>Idioma da interface e das respostas</CardDescription>
          </CardHeader>
          <CardContent>
            <Select defaultValue="pt-BR">
              <SelectTrigger className="sm:w-72">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="es">Espanhol</SelectItem>
                <SelectItem value="en">Inglês</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="surface-panel">
          <CardHeader>
            <CardTitle className="text-[15px]">Notificações e experiência</CardTitle>
            <CardDescription>Alertas, animações e histórico</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <PreferenceRow
              icon={Bell}
              title="Notificações na plataforma"
              description="Avisos sobre indexações, respostas e atualizações da base."
              checked={notifications}
              onCheckedChange={setNotifications}
            />
            <PreferenceRow
              icon={Bell}
              title="Resumo por e-mail"
              description="Receba um resumo semanal das suas consultas."
              checked={emailDigest}
              onCheckedChange={setEmailDigest}
            />
            <PreferenceRow
              icon={Sparkles}
              title="Animações da interface"
              description="Transições e microinterações suaves."
              checked={animations}
              onCheckedChange={setAnimations}
            />
            <PreferenceRow
              icon={History}
              title="Salvar histórico de conversas"
              description="Mantenha suas consultas disponíveis para consulta posterior."
              checked={keepHistory}
              onCheckedChange={setKeepHistory}
            />
          </CardContent>
        </Card>

        <Card className="surface-panel">
          <CardHeader>
            <CardTitle className="text-[15px]">Histórico de conversas</CardTitle>
            <CardDescription>Exporte ou remova suas conversas</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => toast.success("Exportação das conversas iniciada.")}
            >
              <Download className="mr-1.5 h-4 w-4" />
              Exportar conversas
            </Button>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => toast.success("Conversas removidas deste dispositivo.")}
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Limpar conversas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
