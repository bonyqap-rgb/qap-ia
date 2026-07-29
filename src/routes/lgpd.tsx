import { createFileRoute, Link } from "@tanstack/react-router";
import { FileCheck2, Mail, ShieldCheck, UserCheck } from "lucide-react";

import { MarketingLayout, PageHero } from "@/components/marketing/site-chrome";
import { LegalBody, LegalList, LegalSection } from "@/components/marketing/legal";

const TITLE = "LGPD — QAP IA";
const DESCRIPTION =
  "Como o QAP IA se organiza para atender à Lei Geral de Proteção de Dados e como exercer os direitos do titular.";

export const Route = createFileRoute("/lgpd")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://qap-ia.lovable.app/lgpd" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://qap-ia.lovable.app/lgpd" }],
  }),
  component: LgpdPage,
});

const pillars = [
  {
    icon: ShieldCheck,
    title: "Minimização",
    text: "Coletamos apenas os dados necessários para operar a plataforma.",
  },
  {
    icon: UserCheck,
    title: "Finalidade",
    text: "Cada dado tratado tem finalidade declarada nesta página e na Política de Privacidade.",
  },
  {
    icon: FileCheck2,
    title: "Transparência",
    text: "Informamos práticas, canais e prazos para atendimento aos titulares.",
  },
  {
    icon: Mail,
    title: "Canal do titular",
    text: "Solicitações podem ser feitas a qualquer momento pelos nossos canais oficiais.",
  },
];

function LgpdPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Proteção de dados"
        title="LGPD no QAP IA"
        description="Conteúdo mantido pela equipe do QAP IA. Não constitui certificação nem parecer jurídico."
      />
      <LegalBody>
        <div className="grid gap-3 sm:grid-cols-2">
          {pillars.map((p) => (
            <div key={p.title} className="surface-panel p-4">
              <p.icon className="h-5 w-5 text-azure" />
              <h2 className="mt-2.5 text-sm font-semibold text-foreground">{p.title}</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                {p.text}
              </p>
            </div>
          ))}
        </div>

        <LegalSection title="Bases legais utilizadas">
          <LegalList
            items={[
              "Execução de contrato, para operar a conta e prestar o serviço contratado.",
              "Legítimo interesse, para segurança, prevenção a fraudes e melhoria da plataforma.",
              "Cumprimento de obrigação legal ou regulatória, quando aplicável.",
              "Consentimento, quando houver tratamento que dependa exclusivamente da sua autorização.",
            ]}
          />
        </LegalSection>

        <LegalSection title="Direitos do titular">
          <LegalList
            items={[
              "Confirmação da existência de tratamento.",
              "Acesso aos dados e correção de informações incompletas ou desatualizadas.",
              "Anonimização, bloqueio ou eliminação de dados desnecessários.",
              "Portabilidade e informação sobre compartilhamentos.",
              "Revogação do consentimento, quando essa for a base legal aplicável.",
            ]}
          />
        </LegalSection>

        <LegalSection title="Como exercer">
          <p>
            Envie a solicitação para privacidade@qapia.com.br informando o nome
            completo, o e-mail cadastrado e o direito que deseja exercer.
            Responderemos dentro do prazo legal aplicável.
          </p>
        </LegalSection>

        <LegalSection title="Documentos relacionados">
          <p>
            Consulte também a{" "}
            <Link to="/privacy" className="text-azure hover:underline">
              Política de Privacidade
            </Link>{" "}
            e os{" "}
            <Link to="/terms" className="text-azure hover:underline">
              Termos de Uso
            </Link>
            .
          </p>
        </LegalSection>
      </LegalBody>
    </MarketingLayout>
  );
}
