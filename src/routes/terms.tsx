import { createFileRoute, Link } from "@tanstack/react-router";

import { MarketingLayout, PageHero } from "@/components/marketing/site-chrome";
import { LegalBody, LegalList, LegalSection } from "@/components/marketing/legal";

const TITLE = "Termos de Uso — QAP IA";
const DESCRIPTION =
  "Condições de uso da plataforma QAP IA, responsabilidades do usuário e limites do serviço.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://qap-ia.lovable.app/terms" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://qap-ia.lovable.app/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Legal"
        title="Termos de Uso"
        description="Ao utilizar o QAP IA você concorda com as condições descritas nesta página."
      />
      <LegalBody>
        <LegalSection title="1. Objeto">
          <p>
            O QAP IA disponibiliza um assistente de apoio à pesquisa jurídica e
            administrativa, além de ferramentas de gestão de documentos e base de
            conhecimento.
          </p>
        </LegalSection>

        <LegalSection title="2. Caráter informativo">
          <p>
            As respostas geradas têm caráter informativo e de apoio. Elas não
            constituem parecer jurídico, decisão administrativa ou orientação
            definitiva. Toda informação deve ser conferida na legislação vigente
            antes de qualquer decisão.
          </p>
        </LegalSection>

        <LegalSection title="3. Cadastro e conta">
          <LegalList
            items={[
              "As credenciais são pessoais e intransferíveis.",
              "Você é responsável pelas atividades realizadas na sua conta.",
              "Informações de cadastro devem ser verdadeiras e mantidas atualizadas.",
            ]}
          />
        </LegalSection>

        <LegalSection title="4. Uso aceitável">
          <LegalList
            items={[
              "Não utilizar a plataforma para fins ilícitos ou que violem direitos de terceiros.",
              "Não enviar documentos sigilosos sem autorização da autoridade competente.",
              "Não tentar burlar limites de uso, engenharia reversa ou acesso não autorizado.",
            ]}
          />
        </LegalSection>

        <LegalSection title="5. Conteúdo enviado">
          <p>
            Você mantém a titularidade dos documentos enviados. Concede ao QAP IA
            licença limitada para processar e indexar esse conteúdo com a
            finalidade exclusiva de prestar o serviço.
          </p>
        </LegalSection>

        <LegalSection title="6. Planos e pagamentos">
          <p>
            Os planos são contratados conforme as condições apresentadas na
            página de <Link to="/pricing" className="text-azure hover:underline">Planos</Link>.
            Alterações de preço serão comunicadas previamente.
          </p>
        </LegalSection>

        <LegalSection title="7. Disponibilidade">
          <p>
            Empregamos esforços para manter o serviço disponível, mas podem
            ocorrer interrupções para manutenção, atualização ou por fatores
            externos.
          </p>
        </LegalSection>

        <LegalSection title="8. Limitação de responsabilidade">
          <p>
            O QAP IA não se responsabiliza por decisões tomadas exclusivamente
            com base nas respostas do assistente sem a devida conferência na
            legislação oficial.
          </p>
        </LegalSection>

        <LegalSection title="9. Encerramento">
          <p>
            A conta pode ser encerrada por solicitação do usuário ou em caso de
            violação destes termos.
          </p>
        </LegalSection>

        <LegalSection title="10. Foro e contato">
          <p>
            Estes termos são regidos pela legislação brasileira. Dúvidas podem
            ser enviadas pela página de{" "}
            <Link to="/contact" className="text-azure hover:underline">Contato</Link>.
          </p>
        </LegalSection>
      </LegalBody>
    </MarketingLayout>
  );
}
