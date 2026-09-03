import { expect, test, describe } from "bun:test";
import {
  detectDocumentScope,
  documentKeys,
  questionKeys,
  chunkInScope,
  formatDocumentKey,
} from "./rag-scope";

describe("rag-scope tests", () => {
  const documents = [
    { id: "doc-cpm", name: "Código Penal Militar - CPM (Decreto-Lei nº 1.001/1969)" },
    { id: "doc-cppm", name: "Código de Processo Penal Militar - CPPM" },
    { id: "doc-cf88", name: "Constituição Federal - CF/88" },
    { id: "doc-rdpm", name: "Regulamento Disciplinar da Polícia Militar - RDPM" },
    { id: "doc-i2pm", name: "Instrução I-2-PM - Procedimentos Operacionais Padrão" },
  ];

  test("extracts keys from question", () => {
    expect(questionKeys("Qual o Artigo 1º do Código Penal Militar?")).toContain("cpm");
    expect(questionKeys("O que diz a CF/88 sobre segurança pública?")).toContain("cf88");
    expect(questionKeys("Artigo 13 do RDPM")).toContain("rdpm");
    expect(questionKeys("Normas da I-2-PM")).toContain("i2pm");
  });

  test("detects document scope for CPM", () => {
    const scope = detectDocumentScope("O que é considerado crime militar em tempo de paz?", documents);
    expect(scope.keys).toContain("cpm");
    expect(scope.documents).toHaveLength(1);
    expect(scope.documents[0].id).toBe("doc-cpm");
  });

  test("detects document scope for I-2-PM", () => {
    const scope = detectDocumentScope("Artigo 31 do I-2-PM", documents);
    expect(scope.keys).toContain("i2pm");
    expect(scope.documents[0].id).toBe("doc-i2pm");
  });

  test("filters chunk in scope", () => {
    const scope = detectDocumentScope("Artigo 1 do CPM", documents);
    const validChunk = { documentId: "doc-cpm", documentName: "Código Penal Militar" };
    const invalidChunk = { documentId: "doc-rdpm", documentName: "RDPM" };

    expect(chunkInScope(validChunk, scope)).toBe(true);
    expect(chunkInScope(invalidChunk, scope)).toBe(false);
  });

  test("formats document keys nicely", () => {
    expect(formatDocumentKey("cpm")).toBe("CPM");
    expect(formatDocumentKey("cf88")).toBe("CF/88");
    expect(formatDocumentKey("i2pm")).toBe("I-2-PM");
  });
});
