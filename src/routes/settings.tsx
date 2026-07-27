import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Configurações — QAP IA" },
      { name: "description", content: "Configurações e preferências do QAP IA." },
      { property: "og:title", content: "Configurações — QAP IA" },
      { property: "og:description", content: "Configurações e preferências do QAP IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 md:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground">
          Personalize a experiência do QAP IA.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Perfil</CardTitle>
          <CardDescription>Informações da sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" defaultValue="Policial Militar" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" defaultValue="contato@qapia.com" />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Preferências</CardTitle>
          <CardDescription>Ajustes de comportamento do assistente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label>Respostas detalhadas por padrão</Label>
              <p className="text-xs text-muted-foreground">Ignora o limite de 150 palavras.</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label>Notificações por e-mail</Label>
              <p className="text-xs text-muted-foreground">Receba atualizações importantes.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label>Sugestões automáticas</Label>
              <p className="text-xs text-muted-foreground">Exibir prompts sugeridos no início do chat.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={() => toast.success("Configurações salvas")}
          className="bg-navy text-primary-foreground hover:bg-navy-light"
        >
          Salvar alterações
        </Button>
      </div>
    </div>
  );
}
