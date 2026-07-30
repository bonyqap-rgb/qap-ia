import { createFileRoute } from "@tanstack/react-router";
import { Layers, RefreshCw } from "lucide-react";

import { AdminCard, AdminPage, SettingRow } from "@/components/admin/admin-primitives";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/stat-card";
import { ApiOfflineNotice } from "@/components/common/page-primitives";
import { useDocumentStatistics, useDocuments, useDocumentMutations } from "@/hooks/use-documents";
import { ragConfig } from "@/lib/admin-config";

export const Route = createFileRoute("/admin/rag")({
  component: AdminRag,
});

function AdminRag() {
  const statistics = useDocumentStatistics();
  const documents = useDocuments();
  const { reindex } = useDocumentMutations();

  const reindexAll = () => {
    documents.data.forEach((doc) => reindex.mutate(doc.id));
  };

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
          onClick={reindexAll}
          disabled={reindex.isPending || documents.data.length === 0}
        >
          <RefreshCw className="mr-1.5 h-4 w-4" />
          Reindexar base
        </Button>
      }
    >
      {statistics.isDemo && <ApiOfflineNotice onRetry={statistics.refetch} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Documentos indexados"
          value={statistics.data.indexedDocuments}
          hint={`${statistics.data.totalDocuments} no total`}
          icon={Layers}
          loading={statistics.isLoading}
        />
        <StatCard
          label="Chunks totais"
          value={(statistics.data.totalChunks ?? 0).toLocaleString("pt-BR")}
          hint={ragConfig.vectorStore}
          icon={Layers}
          loading={statistics.isLoading}
        />
        <StatCard
          label="Tempo médio"
          value={`${Math.round(statistics.data.averageIndexingSeconds ?? 0)}s`}
          hint="Por documento indexado"
          icon={RefreshCw}
          loading={statistics.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminCard title="Segmentação" description="Como os documentos são divididos">
          <SettingRow label="Chunk size" value={`${ragConfig.chunkSize} tokens`} />
          <SettingRow label="Chunk overlap" value={`${ragConfig.chunkOverlap} tokens`} />
        </AdminCard>

        <AdminCard title="Recuperação" description="Busca vetorial e relevância">
          <SettingRow label="Embedding model" value={ragConfig.embeddingModel} />
          <SettingRow label="Similarity threshold" value={ragConfig.similarityThreshold} />
          <SettingRow label="Top K search" value={ragConfig.topKSearch} />
          <SettingRow label="Distância" value={ragConfig.distance} />
        </AdminCard>
      </div>
    </AdminPage>
  );
}
