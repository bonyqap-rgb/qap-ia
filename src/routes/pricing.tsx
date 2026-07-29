import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";

import { MarketingLayout, PageHero } from "@/components/marketing/site-chrome";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { comparison, plans } from "@/lib/marketing-data";
import { cn } from "@/lib/utils";

const TITLE = "Planos e preços — QAP IA";
const DESCRIPTION =
  "Compare os planos Gratuito, Starter, Professional e Enterprise do QAP IA e escolha o ideal para o seu efetivo.";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://qap-ia.lovable.app/pricing" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://qap-ia.lovable.app/pricing" }],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Planos"
        title="Um plano para cada estágio da sua operação"
        description="Comece gratuitamente e evolua para base própria, indicadores e governança quando a unidade precisar."
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <div
              key={p.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-6 shadow-soft transition-all",
                p.highlight
                  ? "border-azure/60 shadow-azure lg:-translate-y-2"
                  : "border-border/70 hover:border-azure/40",
              )}
            >
              {p.badge && (
                <Badge className="absolute -top-2.5 left-6 bg-gradient-azure text-[10px] font-semibold text-primary-foreground">
                  {p.badge}
                </Badge>
              )}
              <h2 className="font-display text-lg font-bold text-foreground">{p.name}</h2>
              <div className="mt-2 flex items-end gap-1">
                <span className="font-display text-3xl font-bold tracking-tight text-foreground">
                  {p.price}
                </span>
                <span className="pb-1.5 text-xs text-muted-foreground">{p.period}</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                {p.description}
              </p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-azure" />
                    <span className="leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={p.highlight ? "default" : "outline"}
                className={cn(
                  "mt-6 w-full",
                  p.highlight &&
                    "bg-gradient-azure text-primary-foreground shadow-azure hover:brightness-110",
                )}
              >
                <Link to={p.id === "enterprise" ? "/contact" : "/signup"}>{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Comparativo de recursos
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Todos os planos incluem base legal citada nas respostas e aviso de
            conferência na legislação oficial.
          </p>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-border/70 bg-card shadow-soft">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[180px]">Recurso</TableHead>
                  {plans.map((p) => (
                    <TableHead key={p.id} className="whitespace-nowrap text-center">
                      {p.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparison.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="font-medium text-foreground">
                      {row.label}
                    </TableCell>
                    {row.values.map((v, i) => (
                      <TableCell key={i} className="text-center text-sm text-muted-foreground">
                        {v === "—" ? (
                          <Minus className="mx-auto h-3.5 w-3.5 text-muted-foreground/60" aria-label="Não incluso" />
                        ) : v === "Sim" ? (
                          <Check className="mx-auto h-4 w-4 text-azure" aria-label="Incluso" />
                        ) : (
                          v
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
