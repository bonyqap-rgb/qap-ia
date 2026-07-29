import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sun, Moon, Info, Cpu, Database, FileText } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Configurações — QAP IA" },
      { name: "description", content: "Configurações, preferências e informações do QAP IA." },
      { property: "og:title", content: "Configurações — QAP IA" },
      { property: "og:description", content: "Configurações, preferências e informações do QAP IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 md:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground">
          Personalize a experiência e visualize informações da plataforma.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="ai">Modelo de IA</TabsTrigger>
          <TabsTrigger value="rag">RAG</TabsTrigger>
          <TabsTrigger value="about">Sobre</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Perfil</CardTitle>
              <CardDescription>Informações da sua conta institucional.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" defaultValue="Policial Militar" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rg">RG / Matrícula</Label>
                  <Input id="rg" defaultValue="00.000.000-0" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail institucional</Label>
                <Input id="email" type="email" defaultValue="contato@qapia.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unidade / Batalhão</Label>
                <Input id="unit" defaultValue="—" placeholder="Ex.: 1º BPM/M" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preferências</CardTitle>
              <CardDescription>Ajustes de comportamento do assistente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Respostas detalhadas por padrão", desc: "Ignora o limite de 150 palavras.", def: false },
                { label: "Notificações por e-mail", desc: "Receba atualizações importantes.", def: true },
                { label: "Sugestões automáticas", desc: "Exibir prompts sugeridos no início do chat.", def: true },
                { label: "Modo compacto", desc: "Reduz espaçamento em listas e tabelas.", def: false },
              ].map((p, i, arr) => (
                <div key={p.label}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <Label>{p.label}</Label>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                    <Switch defaultChecked={p.def} />
                  </div>
                  {i < arr.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aparência</CardTitle>
              <CardDescription>Escolha o tema da interface.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { id: "light", label: "Claro", icon: Sun },
                    { id: "dark", label: "Escuro", icon: Moon },
                  ] as const
                ).map((opt) => {
                  const active = theme === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setTheme(opt.id)}
                      className={cn(
                        "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition",
                        active
                          ? "border-azure bg-azure/5 shadow-azure"
                          : "border-border hover:border-azure/60 hover:bg-muted/40",
                      )}
                    >
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-navy/5 text-navy">
                        <opt.icon className="h-4 w-4" />
                      </div>
                      <div className="text-sm font-semibold">{opt.label}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {opt.id === "light" ? "Interface institucional clara" : "Ideal para uso noturno"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Cpu className="h-4 w-4 text-navy" />
                Modelo de IA
              </CardTitle>
              <CardDescription>
                Placeholder — configurações serão aplicadas quando o painel de administração for
                integrado ao backend.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Provedor</Label>
                <Select defaultValue="google">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google AI Studio</SelectItem>
                    <SelectItem value="openrouter">OpenRouter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Modelo</Label>
                <Select defaultValue="gemini-flash-latest">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-flash-latest">gemini-flash-latest</SelectItem>
                    <SelectItem value="gemini-pro-latest">gemini-pro-latest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Temperatura</Label>
                <Input type="number" defaultValue={0.3} step={0.1} min={0} max={1} />
                <p className="text-[11px] text-muted-foreground">
                  Valores baixos deixam respostas mais objetivas e determinísticas.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rag" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Database className="h-4 w-4 text-navy" />
                RAG (Retrieval-Augmented Generation)
              </CardTitle>
              <CardDescription>
                Placeholder — parâmetros de recuperação aplicados após integração do pgvector.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Top K</Label>
                  <Input type="number" defaultValue={6} />
                </div>
                <div className="grid gap-2">
                  <Label>Chunk size</Label>
                  <Input type="number" defaultValue={800} />
                </div>
                <div className="grid gap-2">
                  <Label>Overlap</Label>
                  <Input type="number" defaultValue={120} />
                </div>
                <div className="grid gap-2">
                  <Label>Modelo de embeddings</Label>
                  <Select defaultValue="text-embedding-004">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text-embedding-004">text-embedding-004</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Prompt de sistema (auxiliar)</Label>
                <Textarea rows={4} placeholder="Instruções adicionais para o retriever..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="h-4 w-4 text-navy" />
                Sobre a aplicação
              </CardTitle>
              <CardDescription>Informações técnicas e institucionais.</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Versão</dt>
                  <dd className="font-medium">0.9.0 — MVP</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Ambiente</dt>
                  <dd>
                    <Badge variant="outline" className="border-azure/40 bg-azure/10 text-azure-dark">
                      Preview
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Modelo padrão</dt>
                  <dd className="font-medium">gemini-flash-latest</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Última atualização</dt>
                  <dd className="font-medium">28/07/2026</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Suporte</dt>
                  <dd className="font-medium">contato@qapia.com</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Licença</dt>
                  <dd className="font-medium">Uso institucional</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-navy" />
                Logs recentes
              </CardTitle>
              <CardDescription>Eventos técnicos da sessão atual.</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="max-h-56 overflow-auto rounded-lg border border-border/60 bg-muted/30 p-3 text-[11px] leading-relaxed text-muted-foreground">
{`[10:14:22] ✓ Sessão iniciada
[10:14:23] ✓ Modelo carregado: gemini-flash-latest
[10:14:25] ✓ Base de conhecimento sincronizada (4821 chunks)
[10:15:01] → Consulta: "prazos recursais no PAD"
[10:15:02] ← Resposta gerada em 1.2s
[10:16:45] ✓ Upload: Portaria 001-2025.docx
[10:16:52] → Indexação iniciada
[10:17:08] ✓ Indexação concluída (34 chunks)`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
