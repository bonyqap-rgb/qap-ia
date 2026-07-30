/**
 * Parâmetros operacionais exibidos no painel administrativo.
 * São valores de referência da configuração do backend QAP RAG — exibidos em
 * modo somente leitura enquanto a API de configuração não estiver disponível.
 */

export const aiConfig = {
  model: "gemini-flash-latest",
  provider: "Google AI Studio",
  temperature: 0.2,
  topP: 0.9,
  topK: 40,
  maxTokens: 2048,
  systemPrompt:
    "Você é o QAP IA, consultor técnico em legislação brasileira aplicada à atividade policial militar. " +
    "Responda em até 150 palavras, com resposta direta, base legal e uma pergunta de aprofundamento. " +
    "Nunca invente normas; sempre cite a fonte legal correspondente.",
  safety: [
    { category: "Assédio", threshold: "Bloquear médio e acima" },
    { category: "Discurso de ódio", threshold: "Bloquear médio e acima" },
    { category: "Conteúdo sexual", threshold: "Bloquear médio e acima" },
    { category: "Conteúdo perigoso", threshold: "Bloquear apenas alto" },
  ],
};

export const ragConfig = {
  chunkSize: 1000,
  chunkOverlap: 200,
  embeddingModel: "text-embedding-004",
  similarityThreshold: 0.75,
  topKSearch: 5,
  vectorStore: "Supabase pgvector",
  distance: "cosine",
};

export const apiConfig = {
  timeoutMs: 20000,
  retries: 2,
  retryBackoff: "Exponencial (300ms · 2^n)",
  circuitBreaker: "Aberto após 5 falhas consecutivas · 30s",
  rateLimit: "120 req/min por IP",
};

export const apiEndpoints = [
  { method: "GET", path: "/health", description: "Saúde geral do serviço" },
  { method: "GET", path: "/ready", description: "Prontidão para receber tráfego" },
  { method: "GET", path: "/metrics", description: "Métricas agregadas" },
  { method: "GET", path: "/documents", description: "Lista de documentos" },
  { method: "GET", path: "/documents/statistics", description: "Estatísticas da base" },
  { method: "POST", path: "/upload", description: "Upload e indexação" },
  { method: "POST", path: "/search", description: "Busca semântica (pgvector)" },
  { method: "POST", path: "/chat", description: "Consulta RAG com citações" },
  { method: "GET", path: "/indexing/history", description: "Histórico de indexações" },
];

export type AdminLogLevel = "info" | "warn" | "error";

export const adminLogs: Array<{
  id: string;
  at: string;
  level: AdminLogLevel;
  scope: string;
  message: string;
}> = [
  { id: "l1", at: "2026-07-30T11:42:10.000Z", level: "info", scope: "chat", message: "Consulta RAG concluída em 1.240 ms (5 citações)." },
  { id: "l2", at: "2026-07-30T11:38:02.000Z", level: "warn", scope: "rag", message: "Similaridade abaixo do limite em 2 chunks recuperados." },
  { id: "l3", at: "2026-07-30T11:20:55.000Z", level: "error", scope: "upload", message: "Falha ao extrair texto de documento protegido por senha." },
  { id: "l4", at: "2026-07-30T10:59:31.000Z", level: "info", scope: "indexing", message: "Documento indexado: 812 chunks gerados." },
  { id: "l5", at: "2026-07-30T10:31:12.000Z", level: "info", scope: "api", message: "Health check OK · latência 82 ms." },
  { id: "l6", at: "2026-07-30T09:47:44.000Z", level: "warn", scope: "api", message: "Rate limit atingido para 200.155.10.4." },
  { id: "l7", at: "2026-07-30T09:12:03.000Z", level: "error", scope: "ai", message: "Resposta vazia do provedor — nova tentativa aplicada." },
  { id: "l8", at: "2026-07-29T22:04:19.000Z", level: "info", scope: "system", message: "Rotina noturna de embeddings finalizada." },
];

export const monitoringSeries = [
  { day: "Seg", consultas: 214, latencia: 1180, erros: 3, uploads: 6, indexacoes: 5 },
  { day: "Ter", consultas: 268, latencia: 1240, erros: 2, uploads: 4, indexacoes: 4 },
  { day: "Qua", consultas: 312, latencia: 1105, erros: 5, uploads: 9, indexacoes: 8 },
  { day: "Qui", consultas: 289, latencia: 1320, erros: 1, uploads: 3, indexacoes: 3 },
  { day: "Sex", consultas: 356, latencia: 1090, erros: 4, uploads: 11, indexacoes: 10 },
  { day: "Sáb", consultas: 142, latencia: 980, erros: 0, uploads: 1, indexacoes: 1 },
  { day: "Dom", consultas: 118, latencia: 1020, erros: 1, uploads: 2, indexacoes: 2 },
];
