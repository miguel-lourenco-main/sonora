'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight, Clock5, Footprints } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { SonoraBadge, SonoraButton, SonoraCard } from '@/components/sonora';

import { SparkleBorder } from '~/components/ui/magic-ui/sparkle-border';
import { getStoryCategory } from '~/lib/data/story-categories';
import type { Story } from '~/lib/types';
import { hasPreRecordedAudio } from '~/lib/utils/audio-availability';
import {
  countStorySteps,
  estimateMinutesFromSteps,
  getStoryDescription,
} from '~/lib/utils/story-meta';

interface FeaturedStoryProps {
  story: Story;
}

export function FeaturedStory({ story }: FeaturedStoryProps) {
  const { t } = useTranslation('custom');
  const [hovered, setHovered] = useState(false);

  const steps = countStorySteps(story);
  const minutes = estimateMinutesFromSteps(steps);
  const description = getStoryDescription(story, 220);
  const category = getStoryCategory(story);
  const hasPreRecorded = hasPreRecordedAudio(story.label);

  return (
    <SparkleBorder isSelected={hovered} className="rounded-[32px]">
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <SonoraCard
          hover={false}
          interactive
          className="bg-gradient-to-br from-primary-container/20 via-surface-container-low to-tertiary-container/15 p-6 md:p-10"
        >
          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[300px,1fr] lg:gap-12">
            <div className="book-frame relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-2xl lg:max-w-none">
              <div className="book-spine absolute inset-y-0 left-0 z-10 w-8" />
              <Image
                src={story.coverUrl}
                alt={story.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 280px, 300px"
              />
            </div>
            <div className="flex flex-col items-start gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-label-lg text-label-lg uppercase tracking-widest text-tertiary">
                  {t('home.featured.eyebrow', 'Featured tale')}
                </span>
                <SonoraBadge variant={hasPreRecorded ? 'pre-recorded' : 'ai-live'} />
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile text-primary md:text-headline-lg">
                {story.title}
              </h2>
              <p className="font-body-md text-body-md italic text-on-surface-variant">
                {description}
              </p>
              <div className="flex items-center gap-4 font-label-lg text-label-lg text-on-surface-variant">
                <span className="flex items-center gap-1.5">
                  <Footprints className="size-[18px]" aria-hidden="true" />
                  {steps} steps
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock5 className="size-[18px]" aria-hidden="true" />
                  {minutes} min
                </span>
                <span className="rounded-full bg-secondary-fixed px-3 py-1 text-xs font-bold text-on-secondary-fixed">
                  {category}
                </span>
              </div>
              <SonoraButton href={`/story/${story.id}`} className="mt-2">
                {t('home.featured.cta', 'Read the story')}
                <ArrowRight className="size-5" aria-hidden="true" />
              </SonoraButton>
            </div>
          </div>
        </SonoraCard>
      </div>
    </SparkleBorder>
  );
}
