'use client';

import { useEffect, useRef } from 'react';

import { prefersReducedMotion } from './capabilities';
import { gsap, registerGsap, ScrollTrigger } from './gsap';

interface GsapSetupArgs {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  /** The scoped root element (the returned ref's node). */
  root: HTMLElement;
  /** True when the user asked for reduced motion — set final state, skip scrubbing. */
  reduced: boolean;
}

/**
 * Scoped GSAP setup with automatic cleanup.
 *
 * Animations and ScrollTriggers created inside `setup` are collected by the
 * gsap.context bound to the returned ref, so `ctx.revert()` tears everything
 * down on unmount. Mirrors the official `useGSAP` hook without the extra dep.
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: (args: GsapSetupArgs) => void,
  deps: React.DependencyList = [],
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    registerGsap();
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      setup({ gsap, ScrollTrigger, root, reduced });
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
