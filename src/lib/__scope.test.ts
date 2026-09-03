import { expect, test } from "vitest";
import { inferPriorityArticles, explicitArticles, prioritizeByArticles, articlesInText } from "@/lib/rag-scope";
import { wantsLiteralText, isLiteralArticleRequest } from "@/lib/rag.server";

const Q = "Quais são as condições para que um crime seja considerado militar em tempo de paz?";
test("prioriza art 9", () => {
  expect(inferPriorityArticles(Q)).toEqual(["9"]);
  expect(inferPriorityArticles("crimes militares em tempo de guerra")).toEqual(["10"]);
  expect(inferPriorityArticles("como funciona a licença?")).toEqual([]);
  expect(explicitArticles("Artigo 31 do I-2-PM")).toEqual(["31"]);
  expect(articlesInText("Art. 10. Consideram-se crimes militares, em tempo de guerra")).toEqual(["10"]);
});
test("remove art 10 e duplicados", () => {
  const chunks = [
    { chunkId: "a", snippet: "Art. 10. Consideram-se crimes militares, em tempo de guerra..." },
    { chunkId: "b", snippet: "Art. 9º Consideram-se crimes militares, em tempo de paz: I - ..." },
    { chunkId: "b", snippet: "Art. 9º Consideram-se crimes militares, em tempo de paz: I - ..." },
    { chunkId: "c", snippet: "Sumário do código" },
  ];
  const out = prioritizeByArticles(chunks, inferPriorityArticles(Q));
  expect(out.map((c) => c.chunkId)).toEqual(["b", "c"]);
});
test("fidelidade literal", () => {
  expect(wantsLiteralText("Qual é o conteúdo do artigo 9 do CPM?")).toBe(true);
  expect(wantsLiteralText("Explique o conteúdo do art. 9º do CPM")).toBe(true);
  expect(isLiteralArticleRequest("Explique o conteúdo do art. 9º do CPM")).toBe(false);
  expect(wantsLiteralText(Q)).toBe(false);
});
