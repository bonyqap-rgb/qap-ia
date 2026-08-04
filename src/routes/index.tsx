import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronDown,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Search,
  BookOpen,
  History,
  Scale,
  MessagesSquare,
  FileText,
  Lock,
} from "lucide-react";

import { MarketingLayout } from "@/components/marketing/site-chrome";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ds";
import { Badge } from "@/components/ds";
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

const TITLE = "QAP IA — Inteligência que apoia quem protege";
const DESCRIPTION =
  "Plataforma avançada de pesquisa jurídica e administrativa para policiais militares. Respostas fundamentadas, base legal citada e gestão documental corporativa.";

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
    <section className="relative overflow-hidden border-b border-border/40 bg-background pt-16 sm:pt-24 lg:pt-32">
      {/* Background visual effects */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--color-azure-light),transparent_60%)] opacity-[0.15]"
      />
      <div
        aria-hidden
        className="bg-grid-subtle pointer-events-none absolute inset-0 opacity-[0.03]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="mb-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-azure/20 blur-2xl animate-pulse" />
              <BrandLogo size={84} className="relative rounded-2xl shadow-elevated" />
            </div>
          </div>

          <Badge
            tone="accent"
            className="mb-6 gap-2 border-azure/30 bg-azure/8 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-azure-dark dark:text-azure-light shadow-sm"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Inteligência que apoia quem protege
          </Badge>

          <h1 className="text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Pesquisa jurídica <span className="text-gradient-azure">em segundos</span>, com base legal
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-xl lg:text-lg">
            O QAP IA responde dúvidas de legislação e rotina administrativa com objetividade, indica
            a norma correspondente e consulta a base de documentos corporativos.
          </p>

          <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full gap-2 text-[15px] font-semibold tracking-tight shadow-azure transition-all hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
            >
              <Link to="/chat">
                Acessar Plataforma
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full gap-2 text-[15px] font-medium border-border/80 hover:bg-muted/50 sm:w-auto"
            >
              <a href="#demo">
                <PlayCircle className="h-4.5 w-4.5" />
                Ver Demonstração
              </a>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {trustSignals.map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60"
              >
                <t.icon className="h-4 w-4 text-azure/70" />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Demo() {
  return (
    <section id="demo" className="scroll-mt-20 border-b border-border/40 bg-muted/20 py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge tone="info" className="mb-4">
            Interface Real
          </Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simplicidade operacional
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
            Resposta direta, fundamentação legal exata e sugestões para aprofundar — sem textos
            longos, sem alucinações e sem perda de tempo.
          </p>
        </div>

        <div className="surface-raised mx-auto mt-12 max-w-4xl overflow-hidden p-0 shadow-large ring-1 ring-border/50">
          <div className="flex items-center justify-between border-b border-border/50 bg-card/80 px-5 py-3.5 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
              <div className="ml-4 h-4 w-px bg-border/60" />
              <span className="ml-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                <ShieldCheck className="h-3 w-3 text-azure" />
                QAP IA • TERMINAL DE CONSULTA
              </span>
            </div>
            <Badge tone="accent" className="text-[9px]">
              V1.2.0
            </Badge>
          </div>

          <div className="space-y-8 bg-card/40 p-6 sm:p-10">
            {demoConversation.map((m, i) => (
              <div
                key={i}
                className={cn("flex items-start gap-4", m.role === "user" && "flex-row-reverse")}
              >
                <div className="flex shrink-0 flex-col items-center gap-2">
                  {m.role === "user" ? (
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-[11px] font-bold text-secondary-foreground ring-1 ring-border shadow-sm">
                      PM
                    </div>
                  ) : (
                    <BrandLogo size={40} className="rounded-xl shadow-soft ring-1 ring-azure/20" />
                  )}
                </div>
                <div
                  className={cn(
                    "min-w-0 flex-1 space-y-2 rounded-2xl px-5 py-4 text-sm leading-relaxed",
                    m.role === "user"
                      ? "max-w-[85%] bg-gradient-azure text-primary-foreground shadow-azure"
                      : "border border-border/60 bg-card text-foreground shadow-soft",
                  )}
                >
                  <p className="whitespace-pre-wrap font-medium">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border/50 bg-muted/40 px-6 py-4 text-center text-[11px] font-medium text-muted-foreground/70 italic">
            As respostas possuem caráter informativo e devem ser conferidas na legislação oficial.
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="recursos" className="scroll-mt-20 border-b border-border/40 bg-background py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <Badge tone="accent" className="mb-4">
            Recursos Enterprise
          </Badge>
          <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tudo o que a corporação precisa em uma plataforma única
          </h2>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
            Da consulta rápida no plantão à gestão estratégica da base documental de toda a unidade.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <article
              key={f.title}
              className="interactive-card group flex flex-col items-start rounded-2xl border border-border/60 bg-card/50 p-7 shadow-subtle hover:bg-card"
            >
              <div className="grid size-12 place-items-center rounded-xl bg-azure/10 text-azure transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-azure group-hover:text-primary-foreground shadow-sm">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-[17px] font-bold tracking-tight text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
              <div className="mt-auto pt-6">
                <div className="h-px w-8 bg-azure/30 transition-all duration-300 group-hover:w-full" />
              </div>
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
                <Badge tone="accent" className="absolute -top-2.5 left-5 bg-gradient-azure text-[10px] font-semibold text-primary-foreground">
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
                variant={p.highlight ? "primary" : "outline"}
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
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,var(--color-azure-light),transparent_70%)] opacity-[0.12]"
      />
      <div className="relative mx-auto w-full max-w-4xl px-6 text-center">
        <div className="mb-6 flex justify-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-azure/10 text-azure shadow-azure animate-bounce">
            <Sparkles className="size-7" />
          </div>
        </div>
        <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          Leve o QAP IA para o <span className="text-gradient-azure">seu turno de serviço</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
          Crie sua conta corporativa e faça a primeira consulta em menos de um minuto. 
          Experimente a excelência da inteligência jurídica militar.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 gap-2 px-8 text-[15px] font-bold tracking-tight shadow-azure transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Link to="/signup">
              Criar Conta Gratuita
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </Button>
          <Button 
            asChild 
            size="lg" 
            variant="outline"
            className="h-12 px-8 text-[15px] font-medium border-border/80 hover:bg-muted/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Link to="/contact">Falar com Especialista</Link>
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
