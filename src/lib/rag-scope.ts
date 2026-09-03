/**
 * Detecção de escopo documental nas perguntas do chat.
 *
 * Identifica qual documento legal/normativo o usuário citou na pergunta
 * (por sigla como CPM, RDPM, I-2-PM, CF88, ou por nome extenso como "Código Penal Militar")
 * para restringir a recuperação do RAG e evitar respostas que misturem
 * trechos de documentos diferentes.
 *
 * Módulo puro (sem I/O) para poder ser usado no servidor e em testes.
 */

export type ScopeDocument = { id?: string; name?: string };

/** Remove acentos, pontuação leve e normaliza para comparação. */
export function normalizeForMatch(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[_\s\-/]+/g, " ")
    .trim();
}

/**
 * Padrões de siglas conhecidas de documentos jurídicos/militares:
 * - Manuais/Instruções: I-2-PM, I 36 PM, M-1-PM, R-100...
 * - Regulamentos/Estatutos: RDPM, RISG, EPM, LPM...
 * - Códigos e Constituição: CPM, CPPM, CP, CPP, CF88, CF, CTB...
 */
const CODE_PATTERN =
  /\b[a-z]{1,4}\s*-?\s*\d{1,3}\s*-?\s*pm\b|\b[a-z]{2,8}pm\b|\bcpm\b|\bcppm\b|\bcf88\b|\bcf\b|\bctb\b|\brisg\b|\brdpm\b|\bepm\b|\blpm\b/g;

/** Mapeamento de expressões por extenso para siglas normalizadas. */
const FULL_NAME_MAPPINGS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\bc[oó]digo\s+penal\s+militar\b/i, key: "cpm" },
  { pattern: /\bcrime\s+militar(?:\s+em\s+tempo\s+de\s+paz)?\b/i, key: "cpm" },
  { pattern: /\bc[oó]digo\s+de?\s+processo\s+penal\s+militar\b/i, key: "cppm" },
  { pattern: /\bc[oó]digo\s+penal\b/i, key: "cp" },
  { pattern: /\bc[oó]digo\s+de?\s+processo\s+penal\b/i, key: "cpp" },
  { pattern: /\bcf\s*88\b|\bconstituic[aã]o\s+(?:federal|da\s+republica)?\b/i, key: "cf88" },
  { pattern: /\bc[oó]digo\s+de?\s+tr[aâ]nsito\b/i, key: "ctb" },
  { pattern: /\bregulamento\s+disciplinar\b/i, key: "rdpm" },
  { pattern: /\bregulamento\s+interno\b/i, key: "risg" },
  { pattern: /\bestatuto\s+dos?\s+policiais?\s+militares?\b/i, key: "epm" },
];

/** Chaves de identificação extraídas do nome de um documento. */
export function documentKeys(name: unknown): string[] {
  const normalized = normalizeForMatch(name).replace(/\.(pdf|docx?|txt)\b/g, "");
  const keys = new Set<string>();

  for (const match of normalized.matchAll(CODE_PATTERN)) {
    keys.add(match[0].replace(/[\s-]+/g, ""));
  }

  for (const mapping of FULL_NAME_MAPPINGS) {
    if (mapping.pattern.test(normalized)) {
      keys.add(mapping.key);
    }
  }

  return Array.from(keys);
}

/** Chaves candidatas presentes na pergunta do usuário. */
export function questionKeys(question: unknown): string[] {
  const normalized = normalizeForMatch(question);
  const keys = new Set<string>();

  for (const mapping of FULL_NAME_MAPPINGS) {
    if (mapping.pattern.test(normalized)) {
      keys.add(mapping.key);
    }
  }

  for (const match of normalized.matchAll(CODE_PATTERN)) {
    keys.add(match[0].replace(/[\s-]+/g, ""));
  }

  return Array.from(keys);
}

/** Exibe a chave normalizada no formato jurídico usual (ex.: cpm → CPM, i2pm → I-2-PM). */
export function formatDocumentKey(key: unknown): string {
  const normalized = String(key ?? "").toLowerCase();
  const numbered = normalized.match(/^([a-z]{1,4})(\d{1,3})pm$/);
  if (numbered) return `${numbered[1].toUpperCase()}-${numbered[2]}-PM`;
  if (normalized === "cf88" || normalized === "cf") return "CF/88";
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
 * Cruza as chaves e nomes citados na pergunta com os documentos indexados.
 * Retorna escopo vazio quando nada foi citado — o fluxo normal segue intacto.
 */
export function detectDocumentScope(question: unknown, documents: ScopeDocument[]): DetectedScope {
  const keys = questionKeys(question);
  const comparison = isComparisonQuestion(question);
  const questionNorm = normalizeForMatch(question);

  if (!keys.length && !documents.length) {
    return { documents: [], keys, comparison };
  }

  const matched: Array<{ id?: string; name?: string }> = [];

  for (const doc of documents) {
    if (!doc.name) continue;
    const docNorm = normalizeForMatch(doc.name);
    const docKeys = documentKeys(doc.name);

    const keyHit = keys.some((key) => docKeys.includes(key));
    const titleHit = docNorm.length > 4 && questionNorm.includes(docNorm);

    if (keyHit || titleHit) {
      matched.push({ id: doc.id, name: doc.name });
    }
  }

  return { documents: matched, keys, comparison };
}

/** Um chunk pertence ao escopo detectado? */
export function chunkInScope(
  chunk: { documentId?: string; documentName?: string; filename?: string },
  scope: DetectedScope,
): boolean {
  if (!scope.keys.length && !scope.documents.length) return true;

  const scopeIds = scope.documents.map((d) => d.id).filter((id): id is string => Boolean(id));

  if (scopeIds.length && chunk.documentId) {
    return scopeIds.includes(chunk.documentId);
  }

  const name = chunk.documentName ?? chunk.filename;
  if (!name) return false;

  const docKeys = documentKeys(name);
  return scope.keys.some((key) => docKeys.includes(key));
}
