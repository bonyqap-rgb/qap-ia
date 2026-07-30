import { createFileRoute } from "@tanstack/react-router";
import { Brain, ShieldAlert } from "lucide-react";

import { AdminCard, AdminPage, SettingRow } from "@/components/admin/admin-primitives";
import { Badge } from "@/components/ui/badge";
import { aiConfig } from "@/lib/admin-config";

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
          <SettingRow label="Modelo" value={aiConfig.model} />
          <SettingRow label="Provedor" value={aiConfig.provider} />
          <SettingRow label="Max tokens" value={aiConfig.maxTokens} />
        </AdminCard>

        <AdminCard title="Amostragem" description="Controle de criatividade e diversidade">
          <SettingRow label="Temperature" hint="Menor = respostas mais determinísticas" value={aiConfig.temperature} />
          <SettingRow label="Top P" value={aiConfig.topP} />
          <SettingRow label="Top K" value={aiConfig.topK} />
        </AdminCard>
      </div>

      <AdminCard
        title="Prompt do sistema"
        description="Instrução permanente aplicada a todas as consultas"
      >
        <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-border/60 bg-muted/40 p-4 font-mono text-[12.5px] leading-relaxed text-foreground">
          {aiConfig.systemPrompt}
        </pre>
      </AdminCard>

      <AdminCard
        title="Safety settings"
        description="Filtros de conteúdo aplicados pelo provedor"
        actions={<ShieldAlert className="h-4 w-4 text-muted-foreground" />}
      >
        {aiConfig.safety.map((s) => (
          <SettingRow key={s.category} label={s.category}>
            <Badge variant="outline" className="border-border/70 bg-muted/50 font-normal">
              {s.threshold}
            </Badge>
          </SettingRow>
        ))}
      </AdminCard>
    </AdminPage>
  );
}
