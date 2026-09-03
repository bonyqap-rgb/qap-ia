/**
 * Detecção de escopo documental nas perguntas do chat.
 *
 * O backend /chat recupera sobre toda a base indexada, o que fazia respostas
 * misturarem artigos de documentos diferentes. Aqui identificamos qual documento
 * o usuário citou explicitamente e, para perguntas claramente conceituais sobre
 * crime militar, inferimos CPM quando nenhum outro documento foi citado.
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

/**
 * Aliases semânticos: códigos jurídicos cujos nomes de arquivo não trazem sigla
 * (ex.: "Código Penal Militar.pdf" → cpm). A ordem importa: processo penal
 * militar (cppm) é avaliado antes do penal militar (cpm).
 */
const NAME_ALIASES: Array<{ key: string; test: (name: string) => boolean }> = [
  {
    key: "cppm",
    test: (n) => /codigo de processo penal militar|processo penal militar/.test(n) || /\bcppm\b/.test(n),
  },
  {
    key: "cpm",
    test: (n) =>
      (/codigo penal militar/.test(n) && !/processo/.test(n)) || /\bcpm\b/.test(n),
  },
  { key: "cf88", test: (n) => /constituicao (federal|da republica)/.test(n) || /\bcf ?88\b/.test(n) },
];

/** Chaves de identificação extraídas do nome de um documento. */
export function documentKeys(name: unknown): string[] {
  const normalized = normalizeForMatch(name).replace(/\.(pdf|docx?|txt)\b/g, "");
  const keys = new Set<string>();
  for (const match of normalized.matchAll(CODE_PATTERN)) {
    keys.add(match[0].replace(/[\s-]+/g, ""));
  }
  for (const alias of NAME_ALIASES) {
    if (alias.test(normalized)) {
      keys.add(alias.key);
      break;
    }
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
  for (const alias of NAME_ALIASES) {
    if (alias.test(normalized)) {
      keys.add(alias.key);
      break;
    }
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

/** Tema material do Código Penal Militar: crime militar e tempo de paz/guerra. */
const CPM_INTENT = [
  /\bcrime militar\b/,
  /\bcrimes militares\b/,
  /\bcrime propriamente militar\b/,
  /\bcrime impropriamente militar\b/,
  /\btempo de paz\b/,
  /\btempo de guerra\b/,
];

/**
 * Inferência conservadora: perguntas conceituais/analíticas sobre crime militar
 * ou sobre tempo de paz/guerra são consultas ao Código Penal Militar, mesmo
 * quando o documento não é citado. Só se aplica quando nenhum documento foi
 * citado explicitamente (ver detectDocumentScope).
 */
export function inferLegalScope(question: unknown): string[] {
  const normalized = ` ${normalizeForMatch(question)} `;
  if (CPM_INTENT.some((pattern) => pattern.test(normalized))) return ["cpm"];
  return [];
}

export type DetectedScope = {
  /** Documentos citados explicitamente na pergunta. */
  documents: Array<{ id?: string; name?: string }>;
  /** Chaves normalizadas citadas ou inferidas. */
  keys: string[];
  comparison: boolean;
  /** true quando o escopo veio de inferência temática, não de citação explícita. */
  inferred: boolean;
};

/**
 * Cruza as chaves citadas na pergunta com os documentos indexados.
 * Quando não há documento citado explicitamente, aplica apenas inferências
 * jurídicas conservadoras para evitar mistura de fontes.
 */
export function detectDocumentScope(question: unknown, documents: ScopeDocument[]): DetectedScope {
  const explicitKeys = questionKeys(question);
  const comparison = isComparisonQuestion(question);
  if (explicitKeys.length) {
    const matched: Array<{ id?: string; name?: string }> = [];
    for (const doc of documents) {
      const docKeys = documentKeys(doc.name);
      const hit = explicitKeys.some((key) => docKeys.some((docKey) => docKey === key));
      if (hit) matched.push({ id: doc.id, name: doc.name });
    }
    return { documents: matched, keys: explicitKeys, comparison, inferred: false };
  }

  if (comparison) return { documents: [], keys: [], comparison, inferred: false };

  const inferredKeys = inferLegalScope(question);
  if (!inferredKeys.length) return { documents: [], keys: [], comparison, inferred: false };

  const matched = documents.filter((doc) =>
    documentKeys(doc.name).some((docKey) => inferredKeys.includes(docKey)),
  );

  return { documents: matched, keys: inferredKeys, comparison, inferred: true };
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

/* ------------------------------------------------------------------------- *
 * Relevância por dispositivo legal (artigo)
 * ------------------------------------------------------------------------- */

/**
 * Artigos prioritários inferidos do tema jurídico da pergunta.
 *
 * Ex.: condições/hipóteses de crime militar em tempo de paz são tratadas no
 * Art. 9º do CPM; tempo de guerra, no Art. 10. Assim evitamos trazer o Art. 10
 * como referência quando ele não é necessário para responder.
 */
export function inferPriorityArticles(question: unknown): string[] {
  const q = ` ${normalizeForMatch(question)} `;
  const crimeMilitar = /crime[s]? (propriamente |impropriamente )?militar/.test(q);
  const guerra = /tempo de guerra/.test(q);
  const paz = /tempo de paz/.test(q);
  if (crimeMilitar || paz || guerra) {
    if (guerra && !paz) return ["10"];
    if (paz || crimeMilitar) return ["9"];
  }
  return [];
}

/** Artigos citados explicitamente na pergunta (ex.: "artigo 31" → ["31"]). */
export function explicitArticles(question: unknown): string[] {
  const q = normalizeForMatch(question);
  const found = new Set<string>();
  for (const m of q.matchAll(/\bart(?:igo|\.)?s?\.?\s*(?:n[o°º]?\.?\s*)?(\d{1,4})/g)) {
    if (m[1]) found.add(m[1]);
  }
  return Array.from(found);
}

/** Números de artigo mencionados em um trecho recuperado. */
export function articlesInText(text: unknown): string[] {
  const normalized = normalizeForMatch(text);
  const found = new Set<string>();
  for (const m of normalized.matchAll(/\bart(?:igo|\.)?s?\.?\s*(?:n[o°º]?\.?\s*)?(\d{1,4})/g)) {
    if (m[1]) found.add(m[1]);
  }
  return Array.from(found);
}

type RankableChunk = {
  chunkId?: string;
  chunkIndex?: number;
  documentId?: string;
  snippet?: string;
  text?: string;
  score?: number;
};

/** Remove trechos duplicados (mesmo id/índice ou mesmo conteúdo). */
export function dedupeChunks<T extends RankableChunk>(chunks: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const chunk of chunks) {
    const body = normalizeForMatch(chunk.snippet ?? chunk.text ?? "").slice(0, 400);
    const key = `${chunk.documentId ?? ""}|${chunk.chunkId ?? chunk.chunkIndex ?? ""}|${body}`;
    if (!body && !chunk.chunkId && chunk.chunkIndex == null) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(chunk);
  }
  return out;
}

/**
 * Ordena e filtra os trechos pelos artigos relevantes à pergunta.
 *
 * Quando há artigos prioritários e existem trechos que os contêm, trechos cujo
 * único dispositivo é outro artigo são descartados — eliminando referências
 * irrelevantes (ex.: Art. 10 em pergunta sobre tempo de paz).
 */
export function prioritizeByArticles<T extends RankableChunk>(
  chunks: T[],
  articles: string[],
): T[] {
  const unique = dedupeChunks(chunks);
  if (!articles.length) return unique;

  const relevant: T[] = [];
  const neutral: T[] = [];
  for (const chunk of unique) {
    const found = articlesInText(chunk.snippet ?? chunk.text ?? "");
    if (found.some((a) => articles.includes(a))) relevant.push(chunk);
    else if (!found.length) neutral.push(chunk);
  }

  if (!relevant.length) return unique;
  return [...relevant, ...neutral];
}
