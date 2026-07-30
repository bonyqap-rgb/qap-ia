import { createFileRoute } from "@tanstack/react-router";
import { Brain } from "lucide-react";

import { AdminCard, AdminPage, SettingRow } from "@/components/admin/admin-primitives";
import { DataGap } from "@/components/common/page-primitives";
import { AI_DEFAULT_MODEL, AI_PROVIDER, AI_SYSTEM_PROMPT } from "@/lib/ai-config";

export const Route = createFileRoute("/admin/ia")({
  component: AdminIa,
});

function AdminIa() {
  return (
    <AdminPage
      title="Inteligência Artificial"
      description="Parâmetros do modelo generativo utilizado nas respostas do QAP IA."
      icon={Brain}
      readOnly
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminCard title="Modelo" description="Provedor e geração de respostas" contentClassName="pt-0">
          <SettingRow label="Provedor" value={AI_PROVIDER} />
          <SettingRow
            label="Modelo padrão"
            hint="Sobrescrito pela variável GEMINI_MODEL no servidor"
            value={AI_DEFAULT_MODEL}
          />
        </AdminCard>

        <AdminCard title="Amostragem" description="Controle de criatividade e diversidade">
          <DataGap
            compact
            title="Parâmetros de amostragem"
            endpoint="GET /config/ai"
            description="Temperature, top-p, top-k e limite de tokens usam os padrões do provedor; nenhum endpoint expõe os valores efetivos."
          />
        </AdminCard>
      </div>

      <AdminCard
        title="Prompt do sistema"
        description="Instrução permanente aplicada a todas as consultas"
      >
        <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-border/60 bg-muted/40 p-4 font-mono text-[12.5px] leading-relaxed text-foreground">
          {AI_SYSTEM_PROMPT}
        </pre>
      </AdminCard>

      <AdminCard
        title="Safety settings"
        description="Filtros de conteúdo aplicados pelo provedor"
      >
        <DataGap
          compact
          title="Filtros de conteúdo"
          endpoint="GET /config/ai"
          description="Os limiares aplicados são os padrões do Google AI Studio."
        />
      </AdminCard>
    </AdminPage>
  );
}
