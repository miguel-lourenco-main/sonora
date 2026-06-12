'use client';

import { Play, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageContainer, SonoraButton, StaggerGroup, StaggerItem } from '@/components/sonora';

import { FEATURED_STORY_ID } from '~/lib/data/mock-engagement';

export function HeroSection() {
  const { t } = useTranslation('custom');

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="aurora-bg aurora-bg-animated absolute inset-0" aria-hidden="true" />
      <div className="hero-scrim absolute inset-0" aria-hidden="true" />
      <PageContainer className="relative z-10 text-center">
        <StaggerGroup stagger={0.08} inView={false} className="flex flex-col items-center gap-6">
          <StaggerItem>
            <span className="animate-float-gentle inline-flex items-center gap-2 rounded-full border border-tertiary-fixed/40 bg-tertiary-container/20 px-4 py-1.5 font-label-lg text-label-lg text-tertiary backdrop-blur-sm">
              <Sparkles className="size-4" aria-hidden="true" />
              {t('home.hero.eyebrow', 'Interactive AI audiobooks')}
            </span>
          </StaggerItem>
          <StaggerItem>
            <h1 className="mx-auto max-w-3xl font-display-lg text-display-lg text-on-background md:text-[64px] md:leading-[1.05]">
              {t('home.hero.titleLead', 'Stories that')}{' '}
              <span className="text-gradient-gold">
                {t('home.hero.titleAccent', 'listen back')}
              </span>
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mx-auto max-w-xl font-body-lg text-body-lg text-on-surface-variant">
              {t(
                'home.hero.subtitle',
                'Step into enchanted worlds where your voice shapes the tale. Choose your path, and let the story unfold around you.',
              )}
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <SonoraButton size="lg" href={`/story/${FEATURED_STORY_ID}`}>
                <Play className="size-5 fill-current" aria-hidden="true" />
                {t('home.hero.ctaPrimary', 'Start your first story')}
              </SonoraButton>
              <SonoraButton variant="ghost" size="lg" href="#library">
                {t('home.hero.ctaBrowse', 'Browse the library')}
              </SonoraButton>
            </div>
          </StaggerItem>
        </StaggerGroup>
      </PageContainer>
    </section>
  );
}
