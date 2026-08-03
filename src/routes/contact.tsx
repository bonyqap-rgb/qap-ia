import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";

import { MarketingLayout, PageHero } from "@/components/marketing/site-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TITLE = "Contato — QAP IA";
const DESCRIPTION =
  "Fale com a equipe do QAP IA para dúvidas, demonstrações e contratação corporativa.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://qap-ia.lovable.app/contact" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://qap-ia.lovable.app/contact" }],
  }),
  component: ContactPage,
});

const channels = [
  { icon: Mail, label: "E-mail", value: "contato@qapia.com.br" },
  { icon: Phone, label: "Telefone", value: "(00) 0000-0000" },
  { icon: MessageSquare, label: "Suporte", value: "suporte@qapia.com.br" },
  { icon: MapPin, label: "Atendimento", value: "Todo o território nacional" },
];

function ContactPage() {
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Mensagem registrada", {
        description: "Nossa equipe responderá no e-mail informado.",
      });
      (e.target as HTMLFormElement).reset();
    }, 700);
  };

  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Contato"
        title="Vamos conversar sobre a sua unidade"
        description="Demonstrações, dúvidas sobre planos e contratação corporativa — respondemos em até 1 dia útil."
      />

      <section className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_380px]">
        <form
          onSubmit={handleSubmit}
          className="surface-raised space-y-4 p-6"
          aria-label="Formulário de contato"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" name="name" required placeholder="Seu nome" autoComplete="name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="voce@instituicao.gov.br"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="org">Instituição / unidade</Label>
              <Input id="org" name="org" placeholder="Ex.: 1º BPM" autoComplete="organization" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Assunto</Label>
              <Select name="subject" defaultValue="demo">
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demo">Solicitar demonstração</SelectItem>
                  <SelectItem value="plans">Dúvida sobre planos</SelectItem>
                  <SelectItem value="support">Suporte técnico</SelectItem>
                  <SelectItem value="privacy">Privacidade e LGPD</SelectItem>
                  <SelectItem value="other">Outro assunto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              name="message"
              required
              rows={6}
              placeholder="Conte brevemente o contexto da sua unidade e o que precisa."
            />
          </div>

          <Button
            type="submit"
            disabled={sending}
            className="w-full bg-gradient-azure text-primary-foreground shadow-azure hover:brightness-110 sm:w-auto"
          >
            {sending ? "Enviando..." : "Enviar mensagem"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Ao enviar, você concorda com o tratamento dos dados conforme a nossa Política de
            Privacidade.
          </p>
        </form>

        <aside className="space-y-4">
          <div className="surface-panel p-5">
            <Building2 className="h-5 w-5 text-azure" />
            <h2 className="mt-3 font-display text-base font-semibold text-foreground">
              Canais de atendimento
            </h2>
            <ul className="mt-4 space-y-3.5">
              {channels.map((c) => (
                <li key={c.label} className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-azure/10 text-azure">
                    <c.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                      {c.label}
                    </span>
                    <span className="block truncate text-sm text-foreground">{c.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-azure/25 bg-azure/8 p-5">
            <h2 className="font-display text-sm font-semibold text-foreground">
              Contratação corporativa
            </h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
              Para batalhões e órgãos com governança própria, montamos uma proposta com ambiente
              dedicado, SSO e gerente de conta.
            </p>
          </div>
        </aside>
      </section>
    </MarketingLayout>
  );
}
