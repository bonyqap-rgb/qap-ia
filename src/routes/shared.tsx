import { createFileRoute, Link } from "@tanstack/react-router";
import { Share2, MessageSquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container, EmptyState, Panel, Section } from "@/components/ds";

export const Route = createFileRoute("/shared")({
  head: () => ({
    meta: [
      { title: "Compartilhados — QAP IA" },
      {
        name: "description",
        content: "Consultas compartilhadas entre integrantes da equipe no QAP IA.",
      },
      { property: "og:title", content: "Compartilhados — QAP IA" },
      {
        property: "og:description",
        content: "Consultas compartilhadas entre integrantes da equipe no QAP IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SharedPage,
});

function SharedPage() {
  return (
    <Container size="wide" className="py-6 sm:py-8">
      <Section
        title="Compartilhados"
        description="Consultas e pareceres compartilhados com a sua equipe"
      >
        <Panel title="Compartilhamentos" description="Nenhum compartilhamento disponível">
          <EmptyState
            icon={Share2}
            title="Nada compartilhado ainda"
            description="As consultas compartilhadas com você aparecerão nesta área."
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
