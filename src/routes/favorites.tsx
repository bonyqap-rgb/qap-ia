import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, MessageSquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container, EmptyState, Panel, Section } from "@/components/ds";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favoritos — QAP IA" },
      {
        name: "description",
        content: "Consultas e normas marcadas como favoritas no QAP IA.",
      },
      { property: "og:title", content: "Favoritos — QAP IA" },
      {
        property: "og:description",
        content: "Consultas e normas marcadas como favoritas no QAP IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  return (
    <Container size="wide" className="py-6 sm:py-8">
      <Section
        title="Favoritos"
        description="Consultas e normas que você marcou para acesso rápido"
      >
        <Panel title="Itens favoritados" description="Nenhum item marcado até o momento">
          <EmptyState
            icon={Star}
            title="Sua lista de favoritos está vazia"
            description="Marque consultas e normas relevantes para encontrá-las rapidamente aqui."
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
