// Centralized mock data for the corporate QAP IA MVP frontend.
// All data here is fictitious and is prepared to be replaced by API calls
// (Express backend, Supabase/PostgreSQL, pgvector, Google AI Studio, OpenRouter).

export type DocStatus = "aguardando" | "indexando" | "concluído" | "erro";

export type MockDocument = {
  id: string;
  name: string;
  category: string;
  size: string;
  pages: number;
  chunks: number;
  status: DocStatus;
  uploadedAt: string;
  uploadedBy: string;
};

export const mockDocuments: MockDocument[] = [
  {
    id: "doc-001",
    name: "Regulamento Disciplinar PMESP.pdf",
    category: "Disciplinar",
    size: "2.4 MB",
    pages: 148,
    chunks: 428,
    status: "concluído",
    uploadedAt: "2026-07-20",
    uploadedBy: "Cel. Andrade",
  },
  {
    id: "doc-002",
    name: "Código Penal Militar.pdf",
    category: "Penal Militar",
    size: "5.1 MB",
    pages: 312,
    chunks: 812,
    status: "concluído",
    uploadedAt: "2026-07-15",
    uploadedBy: "Maj. Ribeiro",
  },
  {
    id: "doc-003",
    name: "Portaria 001-2025.docx",
    category: "Portarias",
    size: "412 KB",
    pages: 12,
    chunks: 34,
    status: "indexando",
    uploadedAt: "2026-07-28",
    uploadedBy: "Ten. Souza",
  },
  {
    id: "doc-004",
    name: "Manual de Abordagem.pdf",
    category: "Operacional",
    size: "1.8 MB",
    pages: 96,
    chunks: 0,
    status: "aguardando",
    uploadedAt: "2026-07-28",
    uploadedBy: "Cap. Lima",
  },
  {
    id: "doc-005",
    name: "Lei Orgânica PM.pdf",
    category: "Legislação",
    size: "3.2 MB",
    pages: 220,
    chunks: 612,
    status: "concluído",
    uploadedAt: "2026-06-30",
    uploadedBy: "Cel. Andrade",
  },
  {
    id: "doc-006",
    name: "documento-corrompido.pdf",
    category: "Outros",
    size: "230 KB",
    pages: 0,
    chunks: 0,
    status: "erro",
    uploadedAt: "2026-07-27",
    uploadedBy: "Ten. Souza",
  },
  {
    id: "doc-007",
    name: "Instruções Trânsito Militar.pdf",
    category: "Trânsito",
    size: "1.1 MB",
    pages: 58,
    chunks: 172,
    status: "concluído",
    uploadedAt: "2026-06-12",
    uploadedBy: "Maj. Ribeiro",
  },
  {
    id: "doc-008",
    name: "Direitos e Deveres do Militar.pdf",
    category: "Direitos",
    size: "890 KB",
    pages: 42,
    chunks: 118,
    status: "concluído",
    uploadedAt: "2026-05-28",
    uploadedBy: "Cap. Lima",
  },
];

export const mockCategories = [
  { name: "Disciplinar", docs: 12, chunks: 1420, updatedAt: "há 2 dias" },
  { name: "Penal Militar", docs: 8, chunks: 2140, updatedAt: "há 5 dias" },
  { name: "Operacional", docs: 15, chunks: 1980, updatedAt: "há 1 dia" },
  { name: "Portarias", docs: 34, chunks: 812, updatedAt: "agora" },
  { name: "Trânsito", docs: 6, chunks: 640, updatedAt: "há 3 dias" },
  { name: "Direitos", docs: 4, chunks: 380, updatedAt: "há 1 semana" },
];

export type MockConversation = {
  id: string;
  title: string;
  updatedAt: string;
  favorite: boolean;
  preview: string;
  messages: number;
};

export const mockConversations: MockConversation[] = [
  {
    id: "c-001",
    title: "Procedimento de ocorrência administrativa",
    updatedAt: "há 12 min",
    favorite: true,
    preview: "Explique o rito completo do procedimento administrativo...",
    messages: 8,
  },
  {
    id: "c-002",
    title: "Prazos recursais no processo disciplinar",
    updatedAt: "há 2 horas",
    favorite: true,
    preview: "Quais os prazos para recurso administrativo...",
    messages: 4,
  },
  {
    id: "c-003",
    title: "Uso progressivo da força",
    updatedAt: "ontem",
    favorite: false,
    preview: "Explique os níveis do uso progressivo...",
    messages: 12,
  },
  {
    id: "c-004",
    title: "Regulamento disciplinar da PM",
    updatedAt: "há 2 dias",
    favorite: false,
    preview: "Fundamente as transgressões disciplinares...",
    messages: 6,
  },
  {
    id: "c-005",
    title: "Direitos constitucionais do preso",
    updatedAt: "há 3 dias",
    favorite: false,
    preview: "Detalhe os direitos garantidos ao preso...",
    messages: 10,
  },
  {
    id: "c-006",
    title: "Abordagem em veículos suspeitos",
    updatedAt: "há 5 dias",
    favorite: false,
    preview: "Procedimento operacional padrão para abordagem...",
    messages: 5,
  },
];

export const systemStatus = [
  { label: "Backend", status: "online" as const, detail: "API Express · 99.98%" },
  { label: "Banco de Dados", status: "online" as const, detail: "PostgreSQL 16 · 42 ms" },
  { label: "Modelo de IA", status: "online" as const, detail: "gemini-flash-latest" },
  { label: "Embeddings", status: "degraded" as const, detail: "pgvector · 0.6s p95" },
];
