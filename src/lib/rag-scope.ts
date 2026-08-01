/**
 * Detecção de escopo documental nas perguntas do chat.
 *
 * O backend /chat recupera sobre toda a base indexada, o que fazia respostas
 * misturarem artigos de documentos diferentes (ex.: "Artigo 31" do I-2-PM,
 * do RDPM e do I-36-PM na mesma resposta). Aqui identificamos qual documento
 * o usuário citou explicitamente para restringir a recuperação.
 *
 * Módulo puro (sem I/O) para poder ser usado no servidor e testado isolado.
 */

export type ScopeDocument = { id?: string; name?: string };

/** Remove acentos, pontuação leve e normaliza para comparação. */
export function normalizeForMatch(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[_\s]+/g, " ")
    .trim();
}

/** Códigos de manuais/regulamentos: I-2-PM, I 36 PM, M-1-PM, RDPM, RISG... */
const CODE_PATTERN = /\b[a-z]{1,4}\s*-?\s*\d{1,3}\s*-?\s*pm\b|\b[a-z]{2,8}pm\b/g;

/** Chaves de identificação extraídas do nome de um documento. */
export function documentKeys(name: unknown): string[] {
  const normalized = normalizeForMatch(name).replace(/\.(pdf|docx?|txt)\b/g, "");
  const keys = new Set<string>();
  for (const match of normalized.matchAll(CODE_PATTERN)) {
    keys.add(match[0].replace(/[\s-]+/g, ""));
  }
  return Array.from(keys);
}

/** Chaves candidatas presentes na pergunta do usuário. */
export function questionKeys(question: unknown): string[] {
  const normalized = normalizeForMatch(question);
  const keys = new Set<string>();
  for (const match of normalized.matchAll(CODE_PATTERN)) {
    keys.add(match[0].replace(/[\s-]+/g, ""));
  }
  return Array.from(keys);
}

/** Exibe a chave normalizada no formato jurídico usual (ex.: i2pm → I-2-PM). */
export function formatDocumentKey(key: unknown): string {
  const normalized = String(key ?? "").toLowerCase();
  const numbered = normalized.match(/^([a-z]{1,4})(\d{1,3})pm$/);
  if (numbered) return `${numbered[1].toUpperCase()}-${numbered[2]}-PM`;
  return normalized.toUpperCase();
}

const COMPARISON_TERMS = [
  "compare",
  "comparar",
  "comparacao",
  "comparativo",
  "diferenca",
  "diferencas",
  "divergencia",
  "versus",
  " vs ",
  "em relacao a",
  "confronto entre",
];

/** true quando o usuário pediu explicitamente comparação entre documentos. */
export function isComparisonQuestion(question: unknown): boolean {
  const normalized = ` ${normalizeForMatch(question)} `;
  return COMPARISON_TERMS.some((term) => normalized.includes(term));
}

export type DetectedScope = {
  /** Documentos citados explicitamente na pergunta. */
  documents: Array<{ id?: string; name?: string }>;
  /** Chaves normalizadas citadas (mesmo sem documento correspondente na base). */
  keys: string[];
  comparison: boolean;
};

/**
 * Cruza as chaves citadas na pergunta com os documentos indexados.
 * Retorna escopo vazio quando nada foi citado — o fluxo normal segue intacto.
 */
export function detectDocumentScope(
  question: unknown,
  documents: ScopeDocument[],
): DetectedScope {
  const keys = questionKeys(question);
  const comparison = isComparisonQuestion(question);
  if (!keys.length) return { documents: [], keys, comparison };

  const matched: Array<{ id?: string; name?: string }> = [];
  for (const doc of documents) {
    const docKeys = documentKeys(doc.name);
    const hit = keys.some((key) => docKeys.some((docKey) => docKey === key));
    if (hit) matched.push({ id: doc.id, name: doc.name });
  }

  return { documents: matched, keys, comparison };
}

/** Um chunk pertence ao escopo detectado? */
export function chunkInScope(
  chunk: { documentId?: string; documentName?: string; filename?: string },
  scope: DetectedScope,
): boolean {
  if (!scope.keys.length) return true;
  const scopeIds = scope.documents.map((document) => document.id).filter(Boolean);
  // Quando ambos os lados têm ID, ele é autoritativo: um ID diferente nunca
  // pode ser admitido por semelhança do nome do arquivo.
  if (scopeIds.length && chunk.documentId) return scopeIds.includes(chunk.documentId);
  const name = chunk.documentName ?? chunk.filename;
  if (!name) return false;
  const docKeys = documentKeys(name);
  return scope.keys.some((key) => docKeys.some((docKey) => docKey === key));
}
