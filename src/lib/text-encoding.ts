/**
 * Corrige nomes de arquivo que chegam do backend com bytes UTF-8 lidos como
 * Latin-1 (ex.: "3Âª ediÃ§Ã£o" → "3ª edição"). Puramente de apresentação:
 * nenhum dado é inventado, apenas a decodificação é refeita.
 */
export function fixMojibake(value: string): string {
  if (!value || !/[ÂÃ][\u0080-\u00bf\u00c0-\u00ff]/.test(value)) return value;
  try {
    const bytes = Uint8Array.from(Array.from(value, (c) => c.charCodeAt(0) & 0xff));
    const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return decoded.includes("\uFFFD") ? value : decoded;
  } catch {
    return value;
  }
}
