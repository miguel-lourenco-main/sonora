'use client';

import Image from 'next/image';
import { ArrowLeft, BookOpen, Clock5, Footprints, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  PageContainer,
  SectionHeading,
  SonoraBadge,
  SonoraButton,
  StaggerGroup,
  StaggerItem,
} from '@/components/sonora';

import { AudiobookCard } from '~/app/_components/custom/audiobook-card';
import { getStoryCategory } from '~/lib/data/story-categories';
import { useListeningProgress } from '~/lib/hooks/use-listening-progress';
import type { Story } from '~/lib/types';
import { hasPreRecordedAudio } from '~/lib/utils/audio-availability';
import {
  countStorySteps,
  estimateMinutesFromSteps,
  getStoryDescription,
} from '~/lib/utils/story-meta';

import { ChoiceMap } from './choice-map';

interface StoryDetailClientProps {
  story: Story;
  related: Story[];
}

export function StoryDetailClient({ story, related }: StoryDetailClientProps) {
  const { t } = useTranslation('custom');
  const { entries, mounted } = useListeningProgress();

  const steps = countStorySteps(story);
  const minutes = estimateMinutesFromSteps(steps);
  const synopsis = getStoryDescription(story, 280);
  const category = getStoryCategory(story);
  const hasPreRecorded = hasPreRecordedAudio(story.label);
  const progress = mounted ? entries.find((entry) => entry.storyId === story.id) : undefined;

  const stats = [
    { icon: Footprints, label: t('storyDetail.steps', { count: steps, defaultValue: '{{count}} steps' }) },
    { icon: Clock5, label: t('storyDetail.minutes', { count: minutes, defaultValue: '{{count}} min' }) },
    {
      icon: BookOpen,
      label: t('storyDetail.chapters', {
        count: story.totalChapters,
        defaultValue: '{{count}} chapters',
      }),
    },
  ];

  return (
    <div className="relative flex flex-1 flex-col">
      {/* Backdrop band — blurred cover, static so the blur cost is paid once */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[480px] overflow-hidden" aria-hidden="true">
        <Image
          src={story.coverUrl}
          alt=""
          fill
          priority
          className="scale-110 object-cover opacity-40 blur-2xl saturate-150 dark:opacity-25"
          sizes="100vw"
        />
        <div className="aurora-bg absolute inset-0 opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background" />
      </div>

      <PageContainer className="flex flex-col gap-16 py-10 md:py-14">
        <StaggerGroup
          inView={false}
          stagger={0.08}
          className="grid items-start gap-10 lg:grid-cols-[340px,1fr] lg:gap-14"
        >
          <StaggerItem variant="scaleIn" className="mx-auto w-full max-w-[300px] lg:max-w-none">
            <div className="book-frame magical-shadow relative aspect-[3/4] overflow-hidden rounded-2xl">
              <div className="book-spine absolute inset-y-0 left-0 z-10 w-8" />
              <Image
                src={story.coverUrl}
                alt={story.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 300px, 340px"
              />
            </div>
          </StaggerItem>

          <div className="flex flex-col items-start gap-5">
            <StaggerItem>
              <div className="flex flex-wrap items-center gap-3">
                <SonoraBadge variant={hasPreRecorded ? 'pre-recorded' : 'ai-live'} />
                <span className="rounded-full bg-secondary-fixed px-3 py-1 text-xs font-bold text-on-secondary-fixed">
                  {category}
                </span>
              </div>
            </StaggerItem>
            <StaggerItem>
              <h1 className="font-display-lg text-headline-lg-mobile text-primary md:text-display-lg">
                {story.title}
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="font-body-md text-body-md italic text-on-surface-variant">
                {story.author}
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-wrap gap-3">
                {stats.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-surface-container px-4 py-2 font-label-lg text-label-lg text-on-surface-variant"
                  >
                    <Icon className="size-4 text-tertiary" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </StaggerItem>
            <StaggerItem>
              <p className="max-w-2xl font-body-lg text-body-lg text-on-surface">{synopsis}</p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <SonoraButton size="lg" href={`/player/${story.id}`}>
                  <Play className="size-5 fill-current" aria-hidden="true" />
                  {progress
                    ? t('storyDetail.resume', {
                        chapter: progress.chapterLabel,
                        defaultValue: 'Resume — {{chapter}}',
                      })
                    : t('storyDetail.start', 'Start listening')}
                </SonoraButton>
                <SonoraButton variant="ghost" size="lg" href="/">
                  <ArrowLeft className="size-5" aria-hidden="true" />
                  {t('storyDetail.back', 'Back to library')}
                </SonoraButton>
              </div>
            </StaggerItem>
          </div>
        </StaggerGroup>

        <ChoiceMap story={story} />

        {related.length > 0 ? (
          <section aria-label={t('storyDetail.moreLikeThis', 'More like this')}>
            <SectionHeading title={t('storyDetail.moreLikeThis', 'More like this')} />
            <StaggerGroup className="grid grid-cols-1 place-items-center gap-10 md:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedStory) => (
                <StaggerItem key={relatedStory.id} className="size-full max-w-md">
                  <AudiobookCard story={relatedStory} className="w-full" />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </section>
        ) : null}
      </PageContainer>
    </div>
  );
}
