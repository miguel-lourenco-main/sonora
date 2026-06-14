'use client';

/**
 * Runtime capability + performance heuristics for the landing page.
 *
 * The WebGL hero and heavy scroll choreography degrade gracefully on weak
 * devices, when WebGL is unavailable, or when the user prefers reduced motion.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function supportsWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

export type PerfTier = 'low' | 'mid' | 'high';

/**
 * Coarse device tier used to scale particle counts, DPR and effects.
 * Conservative on purpose — a beautiful low tier beats a janky high one.
 */
export function getPerfTier(): PerfTier {
  if (typeof window === 'undefined') return 'mid';
  const nav = navigator as Navigator & { deviceMemory?: number };
  const mem = nav.deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;

  if ((coarse && small) || mem <= 3 || cores <= 4) return 'low';
  if (mem >= 8 && cores >= 8 && !coarse) return 'high';
  return 'mid';
}

/** Clamp device pixel ratio so the WebGL surface never over-renders. */
export function cappedDpr(max = 2): number {
  if (typeof window === 'undefined') return 1;
  return Math.min(window.devicePixelRatio || 1, max);
}
