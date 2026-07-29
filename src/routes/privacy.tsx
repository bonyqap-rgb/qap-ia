import { createFileRoute } from "@tanstack/react-router";

import { MarketingLayout, PageHero } from "@/components/marketing/site-chrome";
import { LegalBody, LegalList, LegalSection } from "@/components/marketing/legal";

const TITLE = "Política de Privacidade — QAP IA";
const DESCRIPTION =
  "Como o QAP IA coleta, utiliza, armazena e protege os dados pessoais dos seus usuários.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://qap-ia.lovable.app/privacy" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://qap-ia.lovable.app/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Legal"
        title="Política de Privacidade"
        description="Esta página é mantida pela equipe do QAP IA e descreve as práticas de tratamento de dados da plataforma."
      />
      <LegalBody>
        <LegalSection title="1. Quem somos">
          <p>
            O QAP IA é uma plataforma de apoio à pesquisa jurídica e
            administrativa. Esta política explica quais dados tratamos, com qual
            finalidade e quais são os seus direitos.
          </p>
        </LegalSection>

        <LegalSection title="2. Dados que coletamos">
          <LegalList
            items={[
              "Dados de cadastro informados por você, como nome, e-mail e unidade de lotação.",
              "Conteúdo das consultas enviadas ao assistente e dos documentos que você faz upload.",
              "Dados técnicos de uso, como data e hora de acesso e páginas visitadas, para segurança e melhoria do serviço.",
            ]}
          />
        </LegalSection>

        <LegalSection title="3. Como utilizamos os dados">
          <LegalList
            items={[
              "Operar o assistente e retornar respostas às suas consultas.",
              "Indexar e pesquisar documentos enviados pela sua organização.",
              "Prestar suporte, comunicar mudanças relevantes e manter registros de auditoria.",
              "Prevenir fraudes, abusos e uso indevido da plataforma.",
            ]}
          />
        </LegalSection>

        <LegalSection title="4. Compartilhamento">
          <p>
            Não vendemos dados pessoais. Compartilhamos informações apenas com
            provedores de infraestrutura e de modelos de inteligência artificial
            estritamente necessários para operar o serviço, ou quando houver
            obrigação legal.
          </p>
        </LegalSection>

        <LegalSection title="5. Isolamento por organização">
          <p>
            Documentos enviados a uma base de conhecimento ficam restritos aos
            usuários autorizados daquela conta e não são disponibilizados a
            outras organizações.
          </p>
        </LegalSection>

        <LegalSection title="6. Retenção e exclusão">
          <p>
            Mantemos os dados enquanto a conta estiver ativa ou pelo prazo
            necessário ao cumprimento de obrigações legais. A exclusão pode ser
            solicitada pelos canais de contato.
          </p>
        </LegalSection>

        <LegalSection title="7. Segurança">
          <p>
            Adotamos controles de acesso, autenticação e registro de atividades.
            Nenhum sistema é totalmente imune a incidentes; comunicaremos os
            titulares e as autoridades quando exigido.
          </p>
        </LegalSection>

        <LegalSection title="8. Seus direitos">
          <p>
            Você pode solicitar confirmação de tratamento, acesso, correção,
            portabilidade, anonimização e exclusão dos seus dados. Consulte a
            página de LGPD para detalhes sobre como exercer esses direitos.
          </p>
        </LegalSection>

        <LegalSection title="9. Contato">
          <p>
            Dúvidas sobre esta política podem ser enviadas para
            contato@qapia.com.br.
          </p>
        </LegalSection>
      </LegalBody>
    </MarketingLayout>
  );
}
