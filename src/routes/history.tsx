import { createFileRoute, Link } from "@tanstack/react-router";
import { History, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataGap, PageHeader } from "@/components/common/page-primitives";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Histórico — QAP IA" },
      {
        name: "description",
        content: "Histórico de conversas com o assistente jurídico QAP IA.",
      },
      { property: "og:title", content: "Histórico — QAP IA" },
      {
        property: "og:description",
        content: "Histórico de conversas com o assistente jurídico QAP IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 md:px-8">
      <PageHeader
        title="Histórico"
        description="Conversas anteriores com o assistente QAP IA."
        actions={
          <Button asChild className="gap-1.5 bg-gradient-azure text-primary-foreground">
            <Link to="/chat">
              <MessageSquare className="h-4 w-4" />
              Abrir chat
            </Link>
          </Button>
        }
      />

      <Card className="surface-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4 text-azure" aria-hidden />
            Conversas salvas
          </CardTitle>
          <CardDescription>
            As perguntas da sessão atual ficam disponíveis na barra lateral do chat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataGap
            title="Histórico persistente de conversas"
            endpoint="GET /conversations"
            description="O backend ainda não persiste conversas; nada é armazenado entre sessões."
          />
        </CardContent>
      </Card>
    </div>
  );
}
