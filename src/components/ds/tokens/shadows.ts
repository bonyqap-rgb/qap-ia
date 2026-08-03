/**
 * Design Tokens — Shadows Scale
 */
export const shadows = {
  subtle: "0 1px 2px oklch(0.2 0.03 258 / 0.04), 0 4px 12px -8px oklch(0.2 0.03 258 / 0.15)",
  small: "0 1px 2px oklch(0.2 0.03 258 / 0.05), 0 8px 24px -18px oklch(0.2 0.03 258 / 0.35)",
  medium: "0 2px 4px oklch(0.2 0.03 258 / 0.06), 0 12px 32px -16px oklch(0.2 0.03 258 / 0.25)",
  large: "0 4px 12px oklch(0.2 0.03 258 / 0.08), 0 24px 48px -28px oklch(0.2 0.03 258 / 0.4)",
  focus: "0 0 0 3px color-mix(in oklab, var(--primary) 32%, transparent)",
  overlay: "0 12px 36px oklch(0.2 0.03 258 / 0.12), 0 32px 64px -16px oklch(0.2 0.03 258 / 0.3)",
} as const;
