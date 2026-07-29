import { useEffect, useState } from "react";

/**
 * Revela o texto progressivamente (efeito de digitação).
 * Apenas visual: o conteúdo recebido não é alterado.
 */
export function useTypewriter(text: string, enabled: boolean, speed = 12) {
  const [shown, setShown] = useState(enabled ? "" : text);

  useEffect(() => {
    if (!enabled) {
      setShown(text);
      return;
    }
    setShown("");
    let i = 0;
    const step = Math.max(1, Math.ceil(text.length / 220));
    const timer = setInterval(() => {
      i += step;
      if (i >= text.length) {
        setShown(text);
        clearInterval(timer);
        return;
      }
      setShown(text.slice(0, i));
    }, speed);
    return () => clearInterval(timer);
  }, [text, enabled, speed]);

  return { shown, done: shown.length >= text.length };
}
