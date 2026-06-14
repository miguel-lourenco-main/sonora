'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@kit/ui/lib';
import { bookData } from '~/lib/data/sample-story';
import { prefersReducedMotion } from '~/lib/landing/capabilities';
import { useGsap } from '~/lib/landing/use-gsap';

/**
 * A ring of floating, leather-bound "tomes" that surround the hero's centred
 * headline. Each is a real story cover inlaid into a green-leather book cover
 * with a raised, gilt-banded spine and gold tooling. They drift gently and
 * parallax to the cursor over the golden atmosphere. Static under reduced motion.
 */
interface TomeConfig {
  id: string;
  left: number;
  top: number;
  /** responsive width via clamp(min, vw, max) */
  width: string;
  rotate: number;
  depth: number;
  z: number;
  hideMobile?: boolean;
}

// Arranged around the edges so the centre stays clear for the headline.
const TOMES: TomeConfig[] = [
  { id: '3', left: 2, top: 11, width: 'clamp(82px, 13vw, 200px)', rotate: -8, depth: 0.5, z: 12 },
  { id: '4', left: 82, top: 7, width: 'clamp(86px, 14vw, 212px)', rotate: 7, depth: 0.6, z: 14 },
  { id: '2', left: -3, top: 45, width: 'clamp(72px, 12vw, 184px)', rotate: -5, depth: 0.45, z: 10, hideMobile: true },
  { id: '8', left: 85, top: 44, width: 'clamp(74px, 12vw, 188px)', rotate: 6, depth: 0.7, z: 11, hideMobile: true },
  { id: '1', left: 7, top: 70, width: 'clamp(84px, 13vw, 202px)', rotate: 9, depth: 0.8, z: 13 },
  { id: '6', left: 74, top: 71, width: 'clamp(88px, 14vw, 216px)', rotate: -7, depth: 0.9, z: 15 },
];

function LeatherTome({ tome }: { tome: TomeConfig }) {
  const story = bookData.find((s) => s.id === tome.id);
  if (!story) return null;
  return (
    <div
      data-tome
      data-depth={tome.depth}
      className={cn(
        'pointer-events-none absolute transition-transform duration-300 ease-sonora will-change-transform',
        tome.hideMobile && 'hidden md:block',
      )}
      style={{ left: `${tome.left}%`, top: `${tome.top}%`, width: tome.width, zIndex: tome.z }}
    >
      <div data-drift>
        <Link
          href={`/story/${story.id}`}
          aria-label={story.title}
          className="group glow-focus pointer-events-auto block"
          style={{ transform: `rotate(${tome.rotate}deg)` }}
        >
          {/* leather cover — tooled, embossed, raised spine */}
          <div
            className="book-texture relative aspect-[3/4] rounded-[12px] p-[9%] pl-[17%] transition-transform duration-300 ease-sonora group-hover:scale-[1.05]"
            style={{
              background:
                'radial-gradient(120% 90% at 30% 12%, rgb(52 80 41), transparent 60%), linear-gradient(150deg, rgb(43 71 34), rgb(24 48 20) 48%, rgb(12 28 10))',
              boxShadow:
                '0 26px 52px -16px rgb(0 0 0 / 0.62), inset 0 2px 1px rgb(184 224 162 / 0.22), inset 0 -4px 8px rgb(0 0 0 / 0.55), inset 3px 0 7px rgb(0 0 0 / 0.4)',
            }}
          >
            {/* raised spine with gilt hubs */}
            <div
              className="absolute inset-y-[6%] left-[4%] w-[9%] rounded-[3px]"
              style={{
                background:
                  'linear-gradient(90deg, rgb(11 28 9), rgb(45 72 35) 55%, rgb(9 22 7))',
                boxShadow: 'inset -2px 0 3px rgb(0 0 0 / 0.55), inset 2px 0 1px rgb(184 224 162 / 0.18)',
              }}
              aria-hidden="true"
            >
              {[14, 36, 58, 80].map((y) => (
                <span
                  key={y}
                  className="absolute inset-x-[-1px] h-[3.5%] rounded-sm"
                  style={{
                    top: `${y}%`,
                    background: 'linear-gradient(180deg, rgb(255 231 150), rgb(198 150 18))',
                    boxShadow: '0 1px 1px rgb(0 0 0 / 0.5)',
                  }}
                />
              ))}
            </div>

            {/* inlaid cover art with gilt rule */}
            <div className="relative h-full w-full overflow-hidden rounded-[3px] shadow-[inset_0_0_10px_rgb(0_0_0/0.5)] ring-[1.5px] ring-tertiary-fixed/60">
              <Image
                src={story.coverUrl}
                alt=""
                fill
                sizes="(max-width: 1024px) 26vw, 220px"
                className="object-cover"
                priority={tome.id === '1'}
              />
              {/* warm reading-light sheen across the inlay */}
              <div
                className="pointer-events-none absolute inset-0 mix-blend-overlay"
                style={{ background: 'linear-gradient(120deg, rgb(255 225 109 / 0.3), transparent 55%)' }}
              />
            </div>

            {/* gilt tooling — double rule on the leather border */}
            <div className="pointer-events-none absolute inset-[6.5%] left-[15%] rounded-[6px] border-[1.5px] border-tertiary-fixed/55" />
            <div className="pointer-events-none absolute inset-[8.5%] left-[16.5%] rounded-[4px] border border-tertiary-fixed/25" />
            {/* gilt corner flourishes */}
            {[
              'left-[16%] top-[6.5%] border-l-2 border-t-2',
              'right-[6.5%] top-[6.5%] border-r-2 border-t-2',
              'left-[16%] bottom-[6.5%] border-l-2 border-b-2',
              'right-[6.5%] bottom-[6.5%] border-r-2 border-b-2',
            ].map((pos) => (
              <span
                key={pos}
                className={cn('pointer-events-none absolute size-[9%] border-tertiary-fixed/70', pos)}
                aria-hidden="true"
              />
            ))}
            {/* top-edge specular highlight for a bound, leathery sheen */}
            <div
              className="pointer-events-none absolute inset-x-[10%] top-[3%] h-[2px] rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgb(184 224 162 / 0.5), transparent)' }}
              aria-hidden="true"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}

export function FloatingTomes({ className }: { className?: string }) {
  const rootRef = useGsap<HTMLDivElement>(({ gsap, root, reduced }) => {
    if (reduced) return;
    const drifters = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-drift]'));
    drifters.forEach((el, i) => {
      gsap.to(el, {
        y: i % 2 === 0 ? '+=16' : '-=14',
        rotation: i % 2 === 0 ? 1.4 : -1.4,
        duration: 3.8 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.35,
      });
    });
  }, []);

  // Cursor parallax via a window listener — the container is pointer-events-none
  // (so it never blocks the centred headline), so React pointer events won't fire.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = root.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        root.querySelectorAll<HTMLElement>('[data-tome]').forEach((el) => {
          const depth = Number(el.dataset.depth) || 0.5;
          el.style.transform = `translate3d(${(-px * depth * 40).toFixed(1)}px, ${(-py * depth * 30).toFixed(1)}px, 0)`;
        });
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [rootRef]);

  return (
    <div ref={rootRef} className={cn('pointer-events-none absolute inset-0', className)}>
      {TOMES.map((tome) => (
        <LeatherTome key={tome.id} tome={tome} />
      ))}
    </div>
  );
}
