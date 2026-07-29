import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  FileText,
  LifeBuoy,
  Mail,
  MessageCircle,
  PlayCircle,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Central de Ajuda — QAP IA" },
      {
        name: "description",
        content:
          "Guias rápidos, tutoriais e perguntas frequentes sobre o uso do QAP IA.",
      },
      { property: "og:title", content: "Central de Ajuda — QAP IA" },
      {
        property: "og:description",
        content: "Guias rápidos, tutoriais e perguntas frequentes do QAP IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HelpPage,
});

const guides = [
  {
    icon: Sparkles,
    title: "Primeiros passos",
    desc: "Como fazer sua primeira consulta e interpretar a estrutura da resposta.",
    tag: "3 min",
  },
  {
    icon: BookOpen,
    title: "Base de conhecimento",
    desc: "Organize categorias, envie normas internas e acompanhe a indexação.",
    tag: "5 min",
  },
  {
    icon: FileText,
    title: "Gestão de documentos",
    desc: "Formatos aceitos, limites de tamanho e status de processamento.",
    tag: "4 min",
  },
  {
    icon: ShieldCheck,
    title: "Segurança e privacidade",
    desc: "Como os dados da unidade são isolados e quem pode acessá-los.",
    tag: "2 min",
  },
];

const faqs = [
  {
    q: "O QAP IA substitui a consulta oficial à legislação?",
    a: "Não. As respostas têm caráter informativo e devem ser conferidas na legislação vigente e com as áreas jurídicas competentes.",
  },
  {
    q: "Como funciona a Base de Conhecimento?",
    a: "Você pode enviar PDFs, DOCX e TXT. Os documentos são indexados em pequenos trechos (chunks) e utilizados para enriquecer as respostas do assistente.",
  },
  {
    q: "Meus dados estão seguros?",
    a: "Sim. As chamadas ao provedor de IA acontecem em ambiente servidor, e a chave de API nunca é exposta ao navegador.",
  },
  {
    q: "Posso pedir mais detalhes em uma resposta?",
    a: "Sim. Basta responder 'quero mais detalhes' ou pedir o texto legal correspondente. O assistente irá aprofundar o tema.",
  },
  {
    q: "Consigo exportar uma conversa?",
    a: "Sim. No Histórico, cada conversa pode ser renomeada, favoritada ou exportada para arquivo.",
  },
  {
    q: "Funciona no celular durante o serviço?",
    a: "Sim. A interface é responsiva e pode ser adicionada à tela inicial do celular, funcionando como um aplicativo.",
  },
];

const channels = [
  {
    icon: LifeBuoy,
    title: "Suporte técnico",
    desc: "Seg. a sex., das 8h às 18h",
    action: "Abrir chamado",
    to: "/contact" as const,
  },
  {
    icon: MessageCircle,
    title: "Perguntar ao assistente",
    desc: "Tire dúvidas direto no chat jurídico",
    action: "Ir para o chat",
    to: "/chat" as const,
  },
  {
    icon: Mail,
    title: "E-mail",
    desc: "contato@qapia.com.br",
    action: "Enviar mensagem",
    to: "/contact" as const,
  },
];

function HelpPage() {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();
  const filteredFaqs = term
    ? faqs.filter(
        (f) =>
          f.q.toLowerCase().includes(term) || f.a.toLowerCase().includes(term),
      )
    : faqs;
  const filteredGuides = term
    ? guides.filter(
        (g) =>
          g.title.toLowerCase().includes(term) ||
          g.desc.toLowerCase().includes(term),
      )
    : guides;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:px-8">
      <header className="surface-raised bg-gradient-navy px-5 py-8 text-center sm:px-8">
        <h1 className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl">
          Como podemos ajudar?
        </h1>
        <p className="mx-auto mt-1.5 max-w-xl text-sm text-steel-light/80">
          Busque por um tema, consulte os guias rápidos ou fale com a equipe.
        </p>
        <div className="relative mx-auto mt-5 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex.: exportar conversa, upload de PDF, prazos"
            aria-label="Buscar na central de ajuda"
            className="h-11 rounded-xl bg-card pl-9"
          />
        </div>
      </header>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Guias rápidos
        </h2>
        {filteredGuides.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
            Nenhum guia encontrado para “{query}”.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredGuides.map((g) => (
              <Card key={g.title} className="surface-panel interactive-card">
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-azure/10 text-azure">
                    <g.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {g.title}
                      </span>
                      <Badge
                        variant="outline"
                        className="h-5 shrink-0 px-1.5 text-[10px] font-semibold text-muted-foreground"
                      >
                        <PlayCircle className="mr-1 h-3 w-3" />
                        {g.tag}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {g.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card className="surface-panel">
          <CardHeader>
            <CardTitle className="text-base">Perguntas frequentes</CardTitle>
            <CardDescription>
              {filteredFaqs.length} resultado(s) disponível(is).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredFaqs.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                Não encontramos respostas para “{query}”. Fale com o suporte.
              </p>
            ) : (
              <Accordion type="single" collapsible>
                {filteredFaqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`item-${i}`}>
                    <AccordionTrigger className="text-left text-sm">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          {channels.map((c) => (
            <Card key={c.title} className="surface-panel interactive-card">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy/5 text-navy">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-foreground">
                    {c.title}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {c.desc}
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm" className="shrink-0 gap-1">
                  <Link to={c.to}>
                    <span className="hidden sm:inline">{c.action}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
