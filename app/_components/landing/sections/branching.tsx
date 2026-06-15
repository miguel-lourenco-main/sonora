'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageContainer, SonoraButton } from '@/components/sonora';
import { cn } from '@kit/ui/lib';
import { useGsap } from '~/lib/landing/use-gsap';
import { FEATURED_STORY_ID } from '~/lib/data/mock-engagement';
import { ChapterMarker } from '../ui/chapter-marker';

type Path = 'shadow' | 'sun';

const NODE_TEXT =
  'The forest path divides before you. To your left, shadows dance invitingly beneath ancient boughs. To your right, golden sunlight streams through a canopy of emerald leaves.';

const CHOICES: Record<
  Path,
  { icon: typeof Moon; label: string; consequence: string; hue: string; glow: string }
> = {
  shadow: {
    icon: Moon,
    label: 'Take the shadowy path',
    consequence:
      'You venture down the shadowy path, where moss-covered trees loom like silent guardians. Glowing mushrooms cast an otherworldly blue light, and the whispers of the forest grow stronger…',
    hue: 'rgb(138 43 226 / 0.18)',
    glow: 'rgb(180 140 255)',
  },
  sun: {
    icon: Sun,
    label: 'Choose the sunlit path',
    consequence:
      'The sunlit path welcomes you with a warm embrace. Butterflies with wings like stained glass dance among wildflowers, while pixies tend luminous blooms and forest spirits play in the golden light…',
    hue: 'rgb(255 205 70 / 0.2)',
    glow: 'rgb(233 196 0)',
  },
};

export function Branching() {
  const { t } = useTranslation('custom');
  const [path, setPath] = useState<Path | null>(null);
  const active = path ? CHOICES[path] : null;

  const rootRef = useGsap<HTMLDivElement>(({ gsap, ScrollTrigger, root, reduced }) => {
    const reveal = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-reveal]'));
    const fork = root.querySelector<SVGPathElement>('[data-fork-left]');
    const forkR = root.querySelector<SVGPathElement>('[data-fork-right]');
    if (reduced) {
      gsap.set(reveal, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(reveal, { opacity: 0, y: 36 });
    ScrollTrigger.create({
      trigger: root,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        gsap.to(reveal, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
        [fork, forkR].forEach((p) => {
          if (!p) return;
          const len = p.getTotalLength();
          gsap.fromTo(
            p,
            { strokeDasharray: len, strokeDashoffset: len },
            { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', delay: 0.3 },
          );
        });
      },
    });
  }, []);

  return (
    <section id="branch" className="relative scroll-mt-24 overflow-hidden py-24 md:py-32">
      {/* Aurora tint that shifts with the chosen path */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={{
          background: active
            ? `radial-gradient(60% 60% at 50% 35%, ${active.hue}, transparent 75%)`
            : 'radial-gradient(60% 60% at 50% 35%, rgb(21 66 18 / 0.06), transparent 75%)',
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      <PageContainer ref={rootRef} className="relative">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <ChapterMarker index="02" label={t('home.branch.chapter', 'Branch')} />
          <h2 data-reveal className="mt-5 font-display-lg text-[32px] leading-[1.1] text-on-background md:text-[52px]">
            {t('home.branch.headlineLead', 'Your choice,')}{' '}
            <span className="italic text-tertiary">{t('home.branch.headlineAccent', 'your story.')}</span>
          </h2>
        </div>

        <div data-reveal className="mx-auto max-w-3xl">
          <p className="text-center font-display text-xl italic leading-relaxed text-on-surface md:text-2xl">
            “{NODE_TEXT}”
          </p>

          {/* Diverging fork */}
          <svg
            viewBox="0 0 400 80"
            className="mx-auto my-6 h-16 w-full max-w-md text-tertiary/50"
            fill="none"
            aria-hidden="true"
          >
            <path data-fork-left d="M200 0 C200 40, 80 40, 60 78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path data-fork-right d="M200 0 C200 40, 320 40, 340 78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>

          <div className="grid gap-4 sm:grid-cols-2">
            {(Object.keys(CHOICES) as Path[]).map((key) => {
              const choice = CHOICES[key];
              const Icon = choice.icon;
              const selected = path === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPath(key)}
                  aria-pressed={selected}
                  className={cn(
                    'glow-focus group flex items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ease-sonora',
                    selected
                      ? 'border-tertiary-fixed bg-tertiary-container/20 shadow-glow-strong'
                      : 'border-outline-variant/40 bg-surface-container-low/70 hover:-translate-y-1 hover:border-tertiary-fixed/50',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors',
                      selected ? 'bg-tertiary-container/40 text-tertiary' : 'bg-surface-container-high text-on-surface-variant group-hover:text-tertiary',
                    )}
                  >
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="font-headline-md text-base font-semibold text-on-background">
                    {t(`home.branch.choice.${key}`, choice.label)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 min-h-[7rem]">
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-2xl border border-outline-variant/30 bg-surface-container-low/80 p-6 backdrop-blur-sm"
                >
                  <p className="font-display text-lg italic leading-relaxed text-on-surface-variant md:text-xl">
                    {active.consequence}
                  </p>
                </motion.div>
              ) : (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center font-body-md text-body-md text-on-surface-variant/70"
                >
                  {t('home.branch.hint', 'Pick a path — see how the tale changes.')}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div data-reveal className="mt-10 flex justify-center">
            <SonoraButton href={`/story/${FEATURED_STORY_ID}`} size="lg">
              {t('home.branch.cta', 'Step into the forest')}
              <ArrowRight className="size-5" aria-hidden="true" />
            </SonoraButton>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
