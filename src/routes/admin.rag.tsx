import { createFileRoute } from "@tanstack/react-router";
import { Layers, RefreshCw } from "lucide-react";

import { AdminCard, AdminPage } from "@/components/admin/admin-primitives";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/stat-card";
import { ApiErrorNotice, DataGap } from "@/components/common/page-primitives";
import { useDocumentStatistics, useDocuments, useDocumentMutations } from "@/hooks/use-documents";

export const Route = createFileRoute("/admin/rag")({
  component: AdminRag,
});

function AdminRag() {
  const statistics = useDocumentStatistics();
  const documents = useDocuments();
  const { reindex } = useDocumentMutations();

  const docs = documents.data ?? [];
  const stats = statistics.data;

  return (
    <AdminPage
      title="RAG"
      description="Segmentação, embeddings e recuperação semântica da base vetorial."
      icon={Layers}
      readOnly
      actions={
        <Button
          size="sm"
          variant="outline"
          onClick={() => docs.forEach((doc) => reindex.mutate(doc.id))}
          disabled={reindex.isPending || docs.length === 0}
        >
          <RefreshCw className="mr-1.5 h-4 w-4" />
          Reindexar base
        </Button>
      }
    >
      {statistics.isUnavailable && (
        <ApiErrorNotice error={statistics.error} onRetry={statistics.refetch} />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Documentos indexados"
          value={stats?.indexedDocuments}
          hint={stats ? `${stats.totalDocuments} no total` : undefined}
          icon={Layers}
          loading={statistics.isLoading}
        />
        <StatCard
          label="Chunks totais"
          value={stats?.totalChunks?.toLocaleString("pt-BR")}
          hint="Trechos vetorizados"
          icon={Layers}
          loading={statistics.isLoading}
        />
        <StatCard
          label="Tempo médio"
          value={
            stats?.averageIndexingSeconds != null
              ? `${Math.round(stats.averageIndexingSeconds)}s`
              : undefined
          }
          hint="Por documento indexado"
          icon={RefreshCw}
          loading={statistics.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminCard title="Segmentação" description="Como os documentos são divididos">
          <DataGap
            compact
            title="Chunk size e overlap"
            endpoint="GET /config/rag"
            description="A API ainda não expõe os parâmetros de segmentação aplicados na indexação."
          />
        </AdminCard>

        <AdminCard title="Recuperação" description="Busca vetorial e relevância">
          <DataGap
            compact
            title="Modelo de embeddings e limiar de similaridade"
            endpoint="GET /config/rag"
            description="Sem endpoint de configuração, esses valores não podem ser exibidos com fidelidade."
          />
        </AdminCard>
      </div>
    </AdminPage>
  );
}
