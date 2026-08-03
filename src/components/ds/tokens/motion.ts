/**
 * Design Tokens — Motion (Animações e Transições)
 */
export const motion = {
  durations: {
    instant: "80ms",
    fast: "140ms",
    normal: "220ms",
    slow: "360ms",
    ambient: "640ms",
  },
  easings: {
    standard: "cubic-bezier(0.22, 1, 0.36, 1)",
    emphasized: "cubic-bezier(0.16, 1, 0.3, 1)",
    exit: "cubic-bezier(0.4, 0, 1, 1)",
    ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    easeIn: "cubic-bezier(0.42, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.58, 1)",
    easeInOut: "cubic-bezier(0.42, 0, 0.58, 1)",
  },
} as const;
