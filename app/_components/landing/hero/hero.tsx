'use client';

import { AnimatePresence, motion } from 'motion/react';
import { AudioLines, Pause, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { SonoraButton } from '@/components/sonora';
import { useGsap } from '~/lib/landing/use-gsap';
import { FEATURED_STORY_ID } from '~/lib/data/mock-engagement';
import { cn } from '@kit/ui/lib';

import { HeroBackdrop } from './hero-backdrop';
import { useHeroWhisper } from './use-hero-whisper';
import { useSmoothScroll } from '../smooth-scroll';

/**
 * Cinematic landing hero — the "Listening Aurora". A WebGL aurora/firefly
 * backdrop sits behind an oversized editorial headline. "Hear a whisper" plays
 * the real narration: the aurora breathes to the audio and the sentence lights
 * up word by word, proving "Stories that listen back".
 */
export function Hero() {
  const { t } = useTranslation('custom');
  const { scrollTo } = useSmoothScroll();
  const { playing, activeIndex, words, toggle } = useHeroWhisper();

  const rootRef = useGsap<HTMLElement>(({ gsap, reduced, root }) => {
    const lines = root.querySelectorAll<HTMLElement>('[data-hero-line]');
    const fades = root.querySelectorAll<HTMLElement>('[data-hero-fade]');
    if (reduced) {
      gsap.set([...lines, ...fades], { opacity: 1, y: 0, yPercent: 0 });
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(lines, { yPercent: 120, opacity: 0, duration: 1.1, stagger: 0.12, delay: 0.2 }).from(
      fades,
      { y: 24, opacity: 0, duration: 0.9, stagger: 0.1 },
      '-=0.6',
    );
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-container-margin-mobile pb-24 pt-28 text-center md:px-container-margin-desktop"
    >
      <HeroBackdrop />
      <div className="hero-scrim pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-6">
        <span
          data-hero-fade
          className="inline-flex items-center gap-2 rounded-full border border-tertiary-fixed/40 bg-surface/40 px-4 py-1.5 font-label-lg text-label-lg text-tertiary backdrop-blur-md"
        >
          <AudioLines className="size-4" aria-hidden="true" />
          {t('home.hero.eyebrow', 'An interactive AI audiobook')}
        </span>

        <h1 className="font-display-lg text-on-background">
          <span className="block overflow-hidden pb-1">
            <span
              data-hero-line
              className="block text-[14vw] leading-[0.95] md:text-[8.5vw] lg:text-[116px]"
            >
              {t('home.hero.titleLead', 'Stories that')}
            </span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span
              data-hero-line
              className="text-gradient-gold block text-[14vw] italic leading-[1.05] md:text-[8.5vw] lg:text-[116px]"
            >
              {t('home.hero.titleAccent', 'listen back')}
            </span>
          </span>
        </h1>

        <p data-hero-fade className="max-w-xl font-body-lg text-body-lg text-on-surface-variant">
          {t(
            'home.hero.subtitle',
            'Step into enchanted worlds where your choices shape the tale — narrated aloud, in any voice you can imagine.',
          )}
        </p>

        {/* Signature gesture */}
        <button
          type="button"
          data-hero-fade
          onClick={toggle}
          aria-pressed={playing}
          className={cn(
            'glow-focus group relative mt-1 inline-flex items-center gap-3 rounded-full border px-5 py-3 font-label-lg text-label-lg backdrop-blur-md transition-all',
            playing
              ? 'border-tertiary-fixed bg-tertiary-container/40 text-on-tertiary-fixed shadow-glow-strong'
              : 'border-tertiary-fixed/50 bg-surface/40 text-tertiary hover:border-tertiary-fixed hover:bg-tertiary-container/25',
          )}
        >
          <span className="relative flex size-6 items-center justify-center">
            {playing ? (
              <Pause className="size-4 fill-current" aria-hidden="true" />
            ) : (
              <AudioLines className="size-5 transition-transform group-hover:scale-110" aria-hidden="true" />
            )}
          </span>
          {playing
            ? t('home.hero.whisperStop', 'Listening…')
            : t('home.hero.whisper', 'Hear a whisper')}
        </button>

        {/* Word-synced narration caption */}
        <div className="flex min-h-[3.5rem] max-w-2xl items-center justify-center">
          <AnimatePresence mode="wait">
            {playing && (
              <motion.p
                key="whisper-caption"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="font-display text-balance text-lg italic leading-relaxed text-on-surface-variant md:text-xl"
                aria-live="polite"
              >
                {words.map((w, i) => (
                  <span
                    key={i}
                    className={cn(
                      'transition-colors duration-150',
                      i <= activeIndex ? 'text-on-background' : 'text-on-surface-variant/45',
                      i === activeIndex && 'narration-word-active text-tertiary',
                    )}
                  >
                    {w.word}{' '}
                  </span>
                ))}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div data-hero-fade className="flex flex-wrap items-center justify-center gap-4">
          <SonoraButton size="lg" href={`/story/${FEATURED_STORY_ID}`}>
            <Play className="size-5 fill-current" aria-hidden="true" />
            {t('home.hero.ctaPrimary', 'Start your first story')}
          </SonoraButton>
          <SonoraButton
            variant="ghost"
            size="lg"
            onClick={() => scrollTo('#library', { offset: -80 })}
          >
            {t('home.hero.ctaBrowse', 'Browse the library')}
          </SonoraButton>
        </div>
      </div>

      <button
        type="button"
        data-hero-fade
        onClick={() => scrollTo('#listen', { offset: -40 })}
        className="glow-focus absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-on-surface-variant/70 transition-colors hover:text-tertiary"
        aria-label={t('home.hero.scrollCue', 'Scroll to explore')}
      >
        <span className="font-label-lg text-xs uppercase tracking-[0.2em]">
          {t('home.hero.scrollCueLabel', 'Scroll')}
        </span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-current p-1">
          <span className="animate-float-gentle size-1.5 rounded-full bg-current" />
        </span>
      </button>
    </section>
  );
}
