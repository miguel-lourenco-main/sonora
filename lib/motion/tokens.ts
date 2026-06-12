/**
 * Sonora motion tokens — shared durations, easings, and springs so every
 * animation in the app moves to the same rhythm.
 */

export const DUR = {
  fast: 0.15,
  base: 0.2,
  gentle: 0.3,
  slow: 0.5,
  entrance: 0.6,
} as const;

export const EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const SPRING = {
  gentle: { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 },
  bouncy: { type: 'spring', stiffness: 400, damping: 18 },
  press: { type: 'spring', stiffness: 500, damping: 30 },
} as const;
