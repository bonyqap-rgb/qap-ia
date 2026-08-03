import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";

import { MarketingLayout } from "@/components/marketing/site-chrome";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  benefits,
  demoConversation,
  differentials,
  howItWorks,
  metrics,
  screenshots,
  faq,
  features,
  plans,
  trustSignals,
} from "@/lib/marketing-data";
import { cn } from "@/lib/utils";

const TITLE = "QAP IA — Pesquisa jurídica e administrativa para quem protege";
const DESCRIPTION =
  "Assistente inteligente de pesquisa jurídica e administrativa para policiais militares: respostas objetivas, base legal citada e sua própria base de documentos.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://qap-ia.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://qap-ia.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "QAP IA",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description: DESCRIPTION,
          url: "https://qap-ia.lovable.app/",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "BRL",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <MarketingLayout>
      <Hero />
      <Metrics />
      <Demo />
      <HowItWorks />
      <Features />
      <Screenshots />
      <Benefits />
      <Differentials />
      <PlansPreview />
      <Faq />
      <FinalCta />
    </MarketingLayout>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-azure/12 via-transparent to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-azure/20 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <BrandLogo
            size={72}
            className="mb-6 rounded-2xl shadow-azure animate-in fade-in zoom-in-95 duration-500"
          />
          <Badge
            variant="outline"
            className="mb-4 gap-1.5 border-azure/30 bg-azure/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-azure-dark"
          >
            <ShieldCheck className="h-3 w-3" />
            Inteligência que apoia quem protege
          </Badge>
          <h1 className="text-balance font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            Pesquisa jurídica e administrativa <span className="text-azure">em segundos</span>, com
            base legal citada
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            O QAP IA responde dúvidas de legislação e rotina administrativa com objetividade, indica
            a norma correspondente e consulta a base de documentos da sua unidade.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-gradient-azure text-primary-foreground shadow-azure transition-all hover:brightness-110"
            >
              <Link to="/chat">
                Fazer uma consulta agora
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <a href="#demo">
                <PlayCircle className="h-4 w-4" />
                Ver demonstração
              </a>
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {trustSignals.map((t) => (
              <li
                key={t.label}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
              >
                <t.icon className="h-3.5 w-3.5 text-azure" />
                {t.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Demo() {
  return (
    <section id="demo" className="scroll-mt-20 border-b border-border/60 bg-muted/30">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Veja como uma consulta acontece
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            Resposta direta, base legal e convite para aprofundar — sem textos longos e sem rodeios.
          </p>
        </div>

        <div className="surface-raised mx-auto mt-9 max-w-3xl overflow-hidden p-0">
          <div className="flex items-center gap-2 border-b border-border/60 bg-card/80 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-azure/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
            <span className="ml-2 truncate text-[11px] font-medium text-muted-foreground">
              QAP IA · Chat Jurídico
            </span>
          </div>
          <div className="space-y-5 p-4 sm:p-6">
            {demoConversation.map((m, i) => (
              <div
                key={i}
                className={cn("flex items-start gap-3", m.role === "user" && "flex-row-reverse")}
              >
                {m.role === "user" ? (
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground ring-1 ring-border">
                    PM
                  </div>
                ) : (
                  <BrandLogo size={36} className="rounded-full" />
                )}
                <div
                  className={cn(
                    "min-w-0 rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    m.role === "user"
                      ? "max-w-[85%] bg-primary text-primary-foreground shadow-azure"
                      : "w-full border border-border/70 bg-card text-foreground shadow-soft",
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border/60 bg-card/60 px-4 py-3 text-center text-[11px] text-muted-foreground">
            As respostas possuem caráter informativo e devem ser conferidas na legislação oficial.
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="recursos" className="scroll-mt-20 border-b border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-azure">
            Recursos
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Tudo o que a unidade precisa em um só lugar
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            Da consulta rápida no plantão à gestão da base documental da seção.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="interactive-card group rounded-2xl border border-border/70 bg-card p-5 shadow-soft"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-azure/10 text-azure transition-colors group-hover:bg-gradient-azure group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-[15px] font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="border-b border-border/60 bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft"
            >
              <b.icon className="h-5 w-5 text-azure" />
              <div className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground">
                {b.metric}
              </div>
              <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                {b.metricLabel}
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-foreground">{b.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlansPreview() {
  return (
    <section id="planos" className="scroll-mt-20 border-b border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-azure">
            Planos
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Comece grátis, evolua conforme a demanda
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            Do uso individual à corporação inteira, com governança e auditoria.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <div
              key={p.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-5 shadow-soft transition-all",
                p.highlight
                  ? "border-azure/60 shadow-azure lg:-translate-y-2"
                  : "border-border/70 hover:border-azure/40",
              )}
            >
              {p.badge && (
                <Badge className="absolute -top-2.5 left-5 bg-gradient-azure text-[10px] font-semibold text-primary-foreground">
                  {p.badge}
                </Badge>
              )}
              <h3 className="font-display text-base font-bold text-foreground">{p.name}</h3>
              <div className="mt-2 flex items-end gap-1">
                <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                  {p.price}
                </span>
                <span className="pb-1 text-xs text-muted-foreground">{p.period}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.description}</p>
              <ul className="mt-4 flex-1 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-azure" />
                    <span className="leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={cn(
                  "mt-5 w-full",
                  p.highlight
                    ? "bg-gradient-azure text-primary-foreground shadow-azure hover:brightness-110"
                    : "",
                )}
                variant={p.highlight ? "default" : "outline"}
              >
                <Link to="/pricing">{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-azure hover:underline"
          >
            Ver comparativo completo de recursos
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-b border-border/60 bg-muted/30">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-azure">
            Dúvidas frequentes
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Perguntas que sempre recebemos
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-8 space-y-2">
          {faq.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`item-${i}`}
              className="rounded-xl border border-border/70 bg-card px-4 shadow-soft"
            >
              <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ChevronDown className="h-3.5 w-3.5" />
          Não encontrou sua dúvida?{" "}
          <Link to="/contact" className="font-medium text-azure hover:underline">
            Fale com a equipe
          </Link>
        </p>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-azure/12 via-transparent to-navy/10"
      />
      <div className="relative mx-auto w-full max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <Sparkles className="mx-auto h-6 w-6 text-azure" />
        <h2 className="mt-4 text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Leve o QAP IA para o seu turno de serviço
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Crie sua conta gratuita e faça a primeira consulta em menos de um minuto. Sem cartão de
          crédito.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="gap-2 bg-gradient-azure text-primary-foreground shadow-azure hover:brightness-110"
          >
            <Link to="/signup">
              Criar conta gratuita
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/contact">Falar com especialista</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  return (
    <section className="border-b border-border/60 bg-muted/30">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-4 px-4 py-10 sm:px-6 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="text-center">
            <div className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {m.value}
            </div>
            <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 border-b border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-azure">
            Como funciona
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Da dúvida à base legal em quatro passos
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((s) => (
            <div
              key={s.step}
              className="hover-lift relative rounded-2xl border border-border/70 bg-card p-5 shadow-soft"
            >
              <span className="font-display text-3xl font-bold tracking-tight text-azure/25">
                {s.step}
              </span>
              <h3 className="mt-2 font-display text-[15px] font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Screenshots() {
  return (
    <section className="border-b border-border/60 bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-azure">
            A plataforma
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Um ambiente completo para a unidade
          </h2>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {screenshots.map((s) => (
            <article
              key={s.title}
              className="hover-lift overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft"
            >
              <div
                className={cn(
                  "relative h-40 bg-grid-subtle",
                  s.tone === "azure" && "bg-azure/8",
                  s.tone === "navy" && "bg-navy/8",
                  s.tone === "steel" && "bg-muted",
                )}
              >
                <div className="absolute inset-0 grid place-items-center">
                  <BrandLogo size={44} className="rounded-xl shadow-azure" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-[15px] font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Differentials() {
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-azure">
            Diferenciais
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Por que o QAP IA e não um chatbot genérico
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {differentials.map((d) => (
            <div
              key={d.title}
              className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-colors hover:border-azure/40"
            >
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-azure/10 text-azure">
                <Check className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold text-foreground">{d.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {d.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
