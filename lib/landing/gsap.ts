'use client';

/**
 * Centralised GSAP + ScrollTrigger access for the landing experience.
 *
 * GSAP 3.13+ ships every plugin (including ScrollTrigger and SplitText) in the
 * public npm package, so no club membership is required. Registration is
 * idempotent and only runs in the browser.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function registerGsap() {
  if (typeof window === 'undefined') return { gsap, ScrollTrigger };
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    // Award-site feel: a single, expensive ease shared across the experience.
    gsap.config({ nullTargetWarn: false });
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export { gsap, ScrollTrigger };
