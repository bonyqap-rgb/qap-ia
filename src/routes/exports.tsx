import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, MessageSquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container, EmptyState, Panel, Section } from "@/components/ds";

export const Route = createFileRoute("/exports")({
  head: () => ({
    meta: [
      { title: "Exportações — QAP IA" },
      {
        name: "description",
        content: "Relatórios e consultas exportadas a partir do QAP IA.",
      },
      { property: "og:title", content: "Exportações — QAP IA" },
      {
        property: "og:description",
        content: "Relatórios e consultas exportadas a partir do QAP IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ExportsPage,
});

function ExportsPage() {
  return (
    <Container size="wide" className="py-6 sm:py-8">
      <Section title="Exportações" description="Arquivos gerados a partir das suas consultas">
        <Panel title="Arquivos exportados" description="Nenhuma exportação registrada">
          <EmptyState
            icon={Download}
            title="Nenhuma exportação disponível"
            description="Ao exportar uma consulta, o arquivo gerado ficará listado aqui."
            action={
              <Button asChild size="sm" className="gap-2">
                <Link to="/chat">
                  <MessageSquarePlus className="size-4" />
                  Nova Consulta
                </Link>
              </Button>
            }
            className="border-0 bg-transparent py-10"
          />
        </Panel>
      </Section>
    </Container>
  );
}
