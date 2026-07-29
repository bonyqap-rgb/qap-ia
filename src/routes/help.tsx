import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy, MessageCircle, Mail } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Ajuda — QAP IA" },
      { name: "description", content: "Central de ajuda e suporte do QAP IA." },
      { property: "og:title", content: "Ajuda — QAP IA" },
      { property: "og:description", content: "Central de ajuda e suporte do QAP IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  {
    q: "O QAP IA substitui a consulta oficial à legislação?",
    a: "Não. As respostas têm caráter informativo e devem ser conferidas na legislação vigente e com áreas jurídicas competentes.",
  },
  {
    q: "Como funciona a Base de Conhecimento?",
    a: "Você pode enviar PDFs, DOCX e TXT. Os documentos são indexados em pequenos trechos (chunks) e utilizados para enriquecer as respostas do assistente.",
  },
  {
    q: "Meus dados estão seguros?",
    a: "Sim. As chamadas ao provedor de IA acontecem em ambiente servidor, e a API Key nunca é exposta ao navegador.",
  },
  {
    q: "Posso pedir mais detalhes em uma resposta?",
    a: "Sim. Basta responder 'quero mais detalhes' ou pedir o texto legal correspondente. O assistente irá aprofundar o tema.",
  },
];

function HelpPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 md:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Central de Ajuda
        </h1>
        <p className="text-sm text-muted-foreground">
          Encontre respostas para as dúvidas mais comuns.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { icon: LifeBuoy, title: "Suporte", desc: "Central de atendimento" },
          { icon: MessageCircle, title: "Chat", desc: "Fale com a equipe" },
          { icon: Mail, title: "E-mail", desc: "contato@qapia.com" },
        ].map((c) => (
          <Card key={c.title} className="transition hover:border-azure hover:shadow-azure">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-navy/5 text-navy">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{c.title}</div>
                <div className="text-xs text-muted-foreground">{c.desc}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Perguntas frequentes</CardTitle>
          <CardDescription>As dúvidas mais comuns dos usuários.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-sm">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
