'use client';

import dynamic from 'next/dynamic';

// `three` is heavy and browser-only — load the WebGL scene lazily, never on the server.
const HeroCanvas = dynamic(() => import('./hero-canvas'), { ssr: false });

/**
 * The hero's full-bleed background: an animated CSS aurora as the always-present
 * base, with the Three.js scene layered on top when WebGL is available. If WebGL
 * is missing or the context is lost, HeroCanvas renders nothing and the CSS
 * aurora remains a graceful fallback.
 */
export function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="aurora-bg aurora-bg-animated absolute inset-0" />
      <HeroCanvas />
    </div>
  );
}
