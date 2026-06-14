'use client';

import { useRef } from 'react';

import { cn } from '@kit/ui/lib';
import { useGsap } from '~/lib/landing/use-gsap';

/**
 * An illuminated, leather-bound open book — the page's "old, mysterious stories"
 * centrepiece. Hand-authored SVG (aged parchment, gold filigree, an illuminated
 * drop-cap, handwritten ink). On scroll-in the covers open, the gold ink writes
 * itself, candlelight breathes and embers drift up. Tilts to the cursor on
 * desktop. Fully static + final-state under reduced motion.
 */
export function AncientBook({ className }: { className?: string }) {
  const tiltRef = useRef<HTMLDivElement>(null);

  const rootRef = useGsap<HTMLDivElement>(({ gsap, ScrollTrigger, root, reduced }) => {
    const leftCover = root.querySelector<SVGElement>('[data-cover-left]');
    const rightCover = root.querySelector<SVGElement>('[data-cover-right]');
    const pages = root.querySelectorAll<SVGElement>('[data-page]');
    const ink = root.querySelectorAll<SVGPathElement>('[data-ink]');
    const drop = root.querySelector<SVGElement>('[data-dropcap]');
    const embers = root.querySelectorAll<SVGElement>('[data-ember]');
    const glow = root.querySelector<SVGElement>('[data-glow]');

    // Prepare ink strokes for a draw-on reveal.
    ink.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });

    if (reduced) {
      gsap.set([leftCover, rightCover], { scaleX: 1 });
      gsap.set(pages, { opacity: 1 });
      gsap.set(ink, { strokeDashoffset: 0 });
      gsap.set(drop, { opacity: 1, scale: 1 });
      return;
    }

    // Candlelight breathing + drifting embers — infinite tweens, but paused while
    // the prologue is offscreen so they cost nothing when not visible.
    const ambient: gsap.core.Tween[] = [];
    if (glow) {
      ambient.push(
        gsap.to(glow, { opacity: 0.85, scale: 1.06, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: 'center' }),
      );
    }
    embers.forEach((e, i) => {
      gsap.set(e, { opacity: 0 });
      ambient.push(
        gsap.to(e, {
          y: -70 - i * 6,
          x: `+=${(i % 2 === 0 ? 1 : -1) * (8 + i * 2)}`,
          keyframes: { opacity: [0, 0.9, 0] },
          duration: 4 + (i % 3),
          repeat: -1,
          delay: i * 0.5,
          ease: 'sine.inOut',
        }),
      );
    });
    ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => ambient.forEach((tw) => (self.isActive ? tw.play() : tw.pause())),
    });

    // The opening: book reveals as it scrolls into view.
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: { trigger: root, start: 'top 78%', once: true },
    });
    // SVG groups can't do real 3D, so the covers "open" by unfolding from the
    // spine (scaleX about the centre gutter). The 3D feel comes from the HTML
    // wrapper's cursor tilt.
    tl.from([leftCover, rightCover], { scaleX: 0, svgOrigin: '300 230', duration: 1.1, ease: 'power3.out' })
      .from(pages, { opacity: 0, scaleX: 0.55, svgOrigin: '300 230', duration: 0.7, stagger: 0.05 }, '-=0.65')
      .from(drop, { opacity: 0, scale: 0.6, duration: 0.6, transformOrigin: 'center', ease: 'back.out(2)' }, '-=0.25')
      .to(ink, { strokeDashoffset: 0, duration: 1.1, stagger: 0.1, ease: 'power2.inOut' }, '-=0.3');
  }, []);

  // Cursor tilt (desktop, fine pointer only).
  const onPointerMove = (e: React.PointerEvent) => {
    const el = tiltRef.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1400px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg)`;
  };
  const onPointerLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div
      ref={rootRef}
      className={cn('relative mx-auto w-full max-w-[640px]', className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div
        ref={tiltRef}
        className="transition-transform duration-300 ease-sonora [transform-style:preserve-3d] motion-reduce:!transform-none"
      >
        <svg viewBox="0 0 600 440" className="w-full overflow-visible" role="img" aria-label="An open illuminated storybook">
          <defs>
            <radialGradient id="ab-glow" cx="50%" cy="42%" r="55%">
              <stop offset="0%" stopColor="rgb(255 225 109)" stopOpacity="0.9" />
              <stop offset="45%" stopColor="rgb(233 196 0)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="rgb(233 196 0)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ab-parch" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(253 248 241)" />
              <stop offset="100%" stopColor="rgb(238 226 205)" />
            </linearGradient>
            <linearGradient id="ab-parch-r" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(251 244 233)" />
              <stop offset="100%" stopColor="rgb(233 219 196)" />
            </linearGradient>
            <linearGradient id="ab-leather" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgb(36 72 30)" />
              <stop offset="55%" stopColor="rgb(21 50 18)" />
              <stop offset="100%" stopColor="rgb(13 33 11)" />
            </linearGradient>
            <linearGradient id="ab-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgb(255 231 150)" />
              <stop offset="50%" stopColor="rgb(233 196 0)" />
              <stop offset="100%" stopColor="rgb(176 132 0)" />
            </linearGradient>
            <linearGradient id="ab-gutter" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgb(0 0 0)" stopOpacity="0" />
              <stop offset="50%" stopColor="rgb(60 40 10)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="rgb(0 0 0)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* candlelight */}
          <ellipse data-glow cx="300" cy="180" rx="250" ry="170" fill="url(#ab-glow)" style={{ opacity: 0.55 }} />

          {/* leather covers (open) */}
          <g data-cover-left>
            <path d="M300 70 L70 96 Q40 100 40 132 L40 360 Q40 392 72 388 L300 360 Z" fill="url(#ab-leather)" />
            <path d="M300 70 L70 96 Q40 100 40 132 L40 360 Q40 392 72 388 L300 360 Z" fill="none" stroke="url(#ab-gold)" strokeWidth="2" strokeOpacity="0.5" />
          </g>
          <g data-cover-right>
            <path d="M300 70 L530 96 Q560 100 560 132 L560 360 Q560 392 528 388 L300 360 Z" fill="url(#ab-leather)" />
            <path d="M300 70 L530 96 Q560 100 560 132 L560 360 Q560 392 528 388 L300 360 Z" fill="none" stroke="url(#ab-gold)" strokeWidth="2" strokeOpacity="0.5" />
          </g>

          {/* parchment pages */}
          <g data-page>
            <path d="M300 86 L92 110 Q72 113 72 134 L72 346 Q72 366 92 363 L300 344 Z" fill="url(#ab-parch)" />
            {/* page-stack edge */}
            <path d="M92 110 Q72 113 72 134 L72 346 Q72 366 92 363" fill="none" stroke="rgb(210 196 170)" strokeWidth="3" strokeOpacity="0.7" />
          </g>
          <g data-page>
            <path d="M300 86 L508 110 Q528 113 528 134 L528 346 Q528 366 508 363 L300 344 Z" fill="url(#ab-parch-r)" />
            <path d="M508 110 Q528 113 528 134 L528 346 Q528 366 508 363" fill="none" stroke="rgb(205 190 162)" strokeWidth="3" strokeOpacity="0.7" />
          </g>

          {/* centre gutter shadow */}
          <rect x="276" y="86" width="48" height="262" fill="url(#ab-gutter)" />

          {/* gold filigree frames */}
          <g data-page stroke="url(#ab-gold)" fill="none" strokeOpacity="0.65">
            <path d="M110 130 L268 116 L268 330 L110 340 Z" strokeWidth="1.4" />
            <path d="M118 150 q6 -8 14 -2 M252 124 q6 8 0 14" strokeWidth="1.4" strokeLinecap="round" />
          </g>
          <g data-page stroke="url(#ab-gold)" fill="none" strokeOpacity="0.65">
            <path d="M332 116 L490 130 L490 340 L332 330 Z" strokeWidth="1.4" />
            <path d="M348 124 q-6 8 0 14 M482 150 q-6 -8 -14 -2" strokeWidth="1.4" strokeLinecap="round" />
          </g>

          {/* illuminated drop-cap on the left page */}
          <g data-dropcap>
            <circle cx="150" cy="168" r="26" fill="url(#ab-gold)" fillOpacity="0.16" stroke="url(#ab-gold)" strokeWidth="1.5" />
            <text x="150" y="182" textAnchor="middle" fontFamily="var(--font-display), Georgia, serif" fontSize="40" fontStyle="italic" fill="url(#ab-gold)">S</text>
          </g>

          {/* handwritten ink lines (draw on) */}
          <g stroke="rgb(60 52 40)" strokeOpacity="0.55" fill="none" strokeWidth="2.2" strokeLinecap="round">
            <path data-ink d="M190 165 q34 -6 68 -2" />
            <path data-ink d="M120 210 q70 -8 142 -3" />
            <path data-ink d="M120 240 q60 8 142 0" />
            <path data-ink d="M120 270 q80 -6 130 -2" />
            <path data-ink d="M120 300 q50 6 110 1" />
          </g>
          <g stroke="rgb(60 52 40)" strokeOpacity="0.5" fill="none" strokeWidth="2.2" strokeLinecap="round">
            <path data-ink d="M344 150 q70 -6 132 0" />
            <path data-ink d="M344 182 q60 8 132 2" />
            <path data-ink d="M344 214 q80 -8 120 -2" />
            <path data-ink d="M344 246 q50 8 130 2" />
            <path data-ink d="M344 300 q60 -6 96 0" />
          </g>

          {/* bookmark ribbon */}
          <path d="M408 86 L408 150 L420 138 L432 150 L432 86 Z" fill="rgb(233 85 155)" fillOpacity="0.85" />

          {/* embers */}
          <g fill="rgb(255 225 109)">
            {[...Array(8)].map((_, i) => (
              <circle
                key={i}
                data-ember
                cx={210 + i * 24}
                cy={170 + (i % 3) * 18}
                r={1.6 + (i % 3) * 0.6}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
