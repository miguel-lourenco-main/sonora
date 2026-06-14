'use client';

import { AudioLines, Captions, Sparkles, Split } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageContainer } from '@/components/sonora';
import { useGsap } from '~/lib/landing/use-gsap';
import { ChapterMarker } from '../ui/chapter-marker';

const FEATURES = [
  {
    icon: AudioLines,
    titleKey: 'home.features.voices.title',
    title: 'Lifelike narration',
    bodyKey: 'home.features.voices.body',
    body: 'Every line is read aloud by warm, expressive AI voices — no flat robot reading, just storytime.',
  },
  {
    icon: Split,
    titleKey: 'home.features.branch.title',
    title: 'Your choices branch the tale',
    bodyKey: 'home.features.branch.body',
    body: 'Pick a path at every turn and the story rewrites itself around you. No two tellings are the same.',
  },
  {
    icon: Captions,
    titleKey: 'home.features.sync.title',
    title: 'Lights up word by word',
    bodyKey: 'home.features.sync.body',
    body: 'Each word glows the instant it is spoken, so young readers can follow along and learn as they listen.',
  },
] as const;

export function Features() {
  const { t } = useTranslation('custom');

  const rootRef = useGsap<HTMLDivElement>(({ gsap, ScrollTrigger, root, reduced }) => {
    const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-feature]'));
    if (reduced) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(cards, { opacity: 0, y: 48 });
    ScrollTrigger.batch(cards, {
      start: 'top 85%',
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }),
    });
  }, []);

  return (
    <section id="listen" className="relative scroll-mt-24 py-24 md:py-32">
      <PageContainer ref={rootRef}>
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <ChapterMarker index="01" label={t('home.features.chapter', 'Listen')} />
          <h2 className="mt-5 font-display-lg text-[32px] leading-[1.1] text-on-background md:text-[52px]">
            {t('home.features.headlineLead', 'The story hears you,')}{' '}
            <span className="italic text-tertiary">{t('home.features.headlineAccent', 'and answers.')}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg font-body-md text-body-md text-on-surface-variant">
            {t(
              'home.features.subtitle',
              'Sonora turns reading into an experience that talks back — spoken, interactive, and alive.',
            )}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                data-feature
                className="grain-overlay group relative flex flex-col gap-4 overflow-hidden rounded-[28px] border border-outline-variant/30 bg-surface-container-low/70 p-8 backdrop-blur-sm transition-all duration-300 ease-sonora hover:-translate-y-1.5 hover:border-tertiary-fixed/40 hover:shadow-card"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-container/25 text-primary shadow-glow transition-colors group-hover:bg-tertiary-container/30 group-hover:text-tertiary">
                  <Icon className="size-7" aria-hidden="true" />
                </span>
                <h3 className="font-headline-md text-headline-md text-on-background">
                  {t(feature.titleKey, feature.title)}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {t(feature.bodyKey, feature.body)}
                </p>
                <Sparkles
                  className="absolute right-5 top-5 size-4 text-tertiary/0 transition-colors duration-300 group-hover:text-tertiary/60"
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>
      </PageContainer>
    </section>
  );
}
