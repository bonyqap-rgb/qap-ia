/**
 * Parâmetros operacionais exibidos no painel administrativo.
 *
 * Contém apenas valores que existem de fato no código do frontend/serviço
 * (endpoints consumidos e configuração do cliente HTTP). Nenhum número
 * fictício de backend é declarado aqui: o que a API não fornece é exibido
 * como lacuna explícita nas telas.
 */

export const httpClientConfig = {
  timeoutMs: 20000,
  retries: 2,
  retryBackoff: "Exponencial (300ms · 2^n)",
};

export const apiEndpoints = [
  { method: "GET", path: "/health", description: "Saúde geral do serviço" },
  { method: "GET", path: "/ready", description: "Prontidão para receber tráfego" },
  { method: "GET", path: "/metrics", description: "Métricas agregadas" },
  { method: "GET", path: "/documents", description: "Lista de documentos" },
  { method: "GET", path: "/documents/statistics", description: "Estatísticas da base" },
  { method: "POST", path: "/upload", description: "Upload e indexação" },
  { method: "POST", path: "/search", description: "Busca semântica" },
  { method: "POST", path: "/chat", description: "Consulta RAG com citações" },
  { method: "GET", path: "/indexing/history", description: "Histórico de indexações" },
];

export type AdminLogLevel = "info" | "warn" | "error";
