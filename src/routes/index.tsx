import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
      <QuickSearch />
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

/** Dashboard-like search field integrated into landing page for quick access. */
function QuickSearch() {
  const navigate = useNavigate();

  return (
    <div className="relative mx-auto w-full max-w-4xl space-y-8 text-center py-20 animate-rise">
      <div className="space-y-3">
        <Badge tone="accent" className="px-3 py-1">Acesso Global</Badge>
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground leading-tight sm:text-4xl">
          Pesquisa <span className="text-gradient-azure">Inteligente</span>
        </h2>
        <p className="mx-auto max-w-xl text-muted-foreground text-[15px]">
          Busca unificada em toda a plataforma. Encontre leis, documentos e consultas anteriores instantaneamente.
        </p>
      </div>

      <div className="relative mx-auto max-w-3xl px-6">
        <div className="group relative flex h-16 items-center rounded-2xl border border-border/80 bg-card px-5 shadow-medium transition-all duration-300 ease-[var(--ease-standard)] focus-within:border-azure/70 focus-within:ring-azure/20 focus-within:ring-4 focus-within:shadow-elevated hover:border-border/100">
          <div className="flex items-center gap-2 absolute left-5">
            <Search
              className="size-6 text-muted-foreground transition-colors duration-200 group-focus-within:text-azure"
              aria-hidden
            />
            <Badge tone="info" className="hidden sm:inline-flex bg-azure/5 text-azure border-azure/20 text-[9px] uppercase tracking-wider font-bold h-5">Global</Badge>
          </div>
          <input
            type="search"
            placeholder="Pesquise em todo o workspace (leis, arquivos, histórico)..."
            className="h-full w-full min-w-0 bg-transparent pl-24 pr-16 text-[16px] text-foreground outline-none placeholder:text-muted-foreground/60 transition-all duration-200"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                navigate({ to: "/chat", search: { q: e.currentTarget.value.trim() } });
              }
            }}
          />
          <kbd className="pointer-events-none absolute right-5 hidden select-none rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1 font-mono text-[11px] font-bold text-muted-foreground/80 sm:block shadow-sm">
            ENTER
          </kbd>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2.5 px-6 text-[12px] text-muted-foreground">
        <span className="font-bold text-muted-foreground/40 uppercase tracking-[0.15em] text-[10px] mr-2">
          Sugestões:
        </span>
        {[
          "Níveis de uso da força",
          "Prazos de sindicância",
          "Abordagem de suspeito",
          "Crimes militares",
        ].map((q) => (
          <Link
            key={q}
            to={`/chat?q=${encodeURIComponent(q)}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-4 py-2 font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-azure/40 hover:bg-azure/5 hover:text-foreground hover:shadow-subtle"
          >
            <Sparkles className="size-3 text-azure animate-pulse" />
            {q}
          </Link>
        ))}
      </div>
    </div>
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

// Benefits moved below, cleanup.


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
    <section className="border-b border-border/40 bg-muted/20 py-12">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 px-6 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="text-center">
            <div className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {m.value}
            </div>
            <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
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
    <section id="como-funciona" className="scroll-mt-20 border-b border-border/40 py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge tone="accent" className="mb-4">Fluxo Inteligente</Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Da dúvida à fundamentação legal em segundos
          </h2>
          <p className="mt-4 text-muted-foreground">
            O QAP IA processa sua linguagem natural e cruza com a base normativa corporativa.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((s) => (
            <div
              key={s.step}
              className="group relative rounded-2xl border border-border/60 bg-card p-7 shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:border-azure/40"
            >
              <div className="absolute -top-3 -right-3 grid size-8 place-items-center rounded-lg bg-azure text-[12px] font-bold text-primary-foreground shadow-azure">
                {s.step}
              </div>
              <h3 className="font-display text-[16px] font-bold tracking-tight text-foreground">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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
    <section className="border-b border-border/40 bg-muted/20 py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge tone="info" className="mb-4">Experiência Premium</Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Um ecossistema completo para a unidade
          </h2>
          <p className="mt-4 text-muted-foreground">
            Interface minimalista focada na produtividade e precisão técnica.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {screenshots.map((s) => (
            <article
              key={s.title}
              className="interactive-card overflow-hidden rounded-2xl border border-border/60 bg-card shadow-subtle"
            >
              <div
                className={cn(
                  "relative h-48 bg-grid-subtle",
                  s.tone === "azure" && "bg-azure/8",
                  s.tone === "navy" && "bg-navy/8",
                  s.tone === "steel" && "bg-muted",
                )}
              >
                <div className="absolute inset-0 grid place-items-center">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-full bg-azure/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <BrandLogo size={48} className="relative rounded-xl shadow-azure" />
                  </div>
                </div>
              </div>
              <div className="p-7">
                <h3 className="font-display text-[17px] font-bold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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

function Benefits() {
  return (
    <section className="border-b border-border/40 py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-border/60 bg-card/40 p-8 shadow-subtle transition-all duration-300 hover:border-azure/30 hover:bg-card"
            >
              <div className="grid size-10 place-items-center rounded-lg bg-azure/10 text-azure shadow-sm mb-6">
                <b.icon className="h-5 w-5" />
              </div>
              <div className="font-display text-4xl font-bold tracking-tight text-foreground">
                {b.metric}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-azure/70 mt-1">
                {b.metricLabel}
              </div>
              <h3 className="mt-6 text-[17px] font-bold text-foreground">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Differentials() {
  return (
    <section className="border-b border-border/40 py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge tone="success" className="mb-4">Superioridade Técnica</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Por que o QAP IA e não um assistente genérico?
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-muted-foreground">
              Nossa arquitetura foi desenhada especificamente para a segurança pública e rotina militar, 
              garantindo precisão onde modelos comuns falham.
            </p>
            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-azure/10 text-azure shadow-sm">
                  <ShieldCheck className="size-5" />
                </div>
                <span className="text-[15px] font-semibold">Certificação de Base Legal PMESP</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-azure/10 text-azure shadow-sm">
                  <Lock className="size-5" />
                </div>
                <span className="text-[15px] font-semibold">Privacidade de Dados Corporativos Stricto Sensu</span>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-1">
            {differentials.map((d) => (
              <div
                key={d.title}
                className="flex items-start gap-5 rounded-2xl border border-border/60 bg-card/40 p-6 shadow-subtle transition-all duration-300 hover:border-azure/30 hover:bg-card"
              >
                <div className="mt-1 grid size-8 shrink-0 place-items-center rounded-lg bg-azure text-primary-foreground shadow-azure">
                  <Check className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-[16px] font-bold text-foreground">{d.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {d.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
