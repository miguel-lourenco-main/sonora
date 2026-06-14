'use client';

import { Mic, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageContainer, SonoraButton } from '@/components/sonora';
import { useGsap } from '~/lib/landing/use-gsap';
import { ChapterMarker } from '../ui/chapter-marker';

const VOICES = [
  'Grandma’s voice',
  'a wise old owl',
  'a starship’s AI',
  'your own voice',
  'a gentle giant',
  'the narrator of your dreams',
  'a mischievous pixie',
  'a bedtime hush',
];

export function VoicesCta() {
  const { t } = useTranslation('custom');

  const rootRef = useGsap<HTMLDivElement>(({ gsap, root, reduced }) => {
    const track = root.querySelector<HTMLElement>('[data-marquee]');
    if (!track || reduced) return;
    // Seamless loop: the track holds two identical halves, so -50% is one cycle.
    const loop = gsap.to(track, { xPercent: -50, duration: 32, ease: 'none', repeat: -1 });
    const slowDown = () => gsap.to(loop, { timeScale: 0, duration: 0.6 });
    const speedUp = () => gsap.to(loop, { timeScale: 1, duration: 0.6 });
    track.addEventListener('pointerenter', slowDown);
    track.addEventListener('pointerleave', speedUp);

    const cta = root.querySelector('[data-cta]');
    if (cta)
      gsap.from(cta, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: cta, start: 'top 85%', once: true },
      });
  }, []);

  return (
    <section id="voices" className="relative scroll-mt-24 overflow-hidden py-20 md:py-28">
      <PageContainer ref={rootRef}>
        <div className="mb-10 text-center">
          <ChapterMarker index="04" label={t('home.voices.chapter', 'Voices')} />
        </div>
      </PageContainer>

      {/* Edge-to-edge marquee */}
      <div className="relative flex w-full select-none overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div data-marquee className="flex shrink-0 items-center gap-8 pr-8">
          {[...VOICES, ...VOICES].map((voice, i) => (
            <span key={i} className="flex items-center gap-8 whitespace-nowrap">
              <span className="font-display text-2xl italic text-on-surface-variant md:text-4xl">
                {voice}
              </span>
              <Sparkles className="size-4 shrink-0 text-tertiary/60" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>

      <PageContainer>
        <div
          data-cta
          className="grain-overlay relative mx-auto mt-14 max-w-3xl overflow-hidden rounded-[32px] border border-tertiary-fixed/30 bg-gradient-to-br from-primary-container/20 via-surface-container-low to-tertiary-container/20 p-10 text-center md:p-14"
        >
          <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-tertiary-container/30 text-tertiary shadow-glow">
            <Mic className="size-7" aria-hidden="true" />
          </span>
          <h2 className="font-display-lg text-[30px] leading-tight text-on-background md:text-[46px]">
            {t('home.voices.headlineLead', 'Read it in')}{' '}
            <span className="italic text-tertiary">{t('home.voices.headlineAccent', 'your')}</span>{' '}
            {t('home.voices.headlineTail', 'voice.')}
          </h2>
          <p className="mx-auto mt-4 max-w-md font-body-md text-body-md text-on-surface-variant">
            {t(
              'home.voices.body',
              'Clone a voice you love — a parent, a character, your own — and let it narrate every branch of every tale.',
            )}
          </p>
          <div className="mt-8 flex justify-center">
            <SonoraButton href="/voices" size="lg">
              <Mic className="size-5" aria-hidden="true" />
              {t('home.voices.cta', 'Create a voice')}
            </SonoraButton>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
