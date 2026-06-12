'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { SectionHeading, SonoraSkeleton } from '@/components/sonora';

import { useListeningProgress } from '~/lib/hooks/use-listening-progress';
import type { Story } from '~/lib/types';

interface ContinueRailProps {
  stories: Story[];
}

export function ContinueRail({ stories }: ContinueRailProps) {
  const { t } = useTranslation('custom');
  const { entries, mounted } = useListeningProgress();

  const items = entries
    .map((entry) => {
      const story = stories.find((s) => s.id === entry.storyId);
      return story ? { entry, story } : null;
    })
    .filter(Boolean) as Array<{ entry: (typeof entries)[number]; story: Story }>;

  if (mounted && items.length === 0) {
    return null;
  }

  return (
    <section aria-label={t('home.continue.title', 'Continue listening')}>
      <SectionHeading title={t('home.continue.title', 'Continue listening')} />
      <div className="hide-scrollbar -mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
        {!mounted
          ? [0, 1].map((i) => <SonoraSkeleton key={i} className="h-28 w-72 shrink-0" />)
          : items.map(({ entry, story }) => (
              <Link
                key={story.id}
                href={`/player/${story.id}`}
                className="glow-focus group flex w-72 shrink-0 snap-start items-center gap-4 rounded-[24px] bg-surface-container-low p-4 story-card-shadow transition-all duration-300 ease-sonora hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={story.coverUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="truncate font-headline-md text-base font-semibold text-on-surface">
                    {story.title}
                  </span>
                  <span className="font-label-lg text-xs text-on-surface-variant">
                    {entry.chapterLabel}
                  </span>
                  <div
                    className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high"
                    role="progressbar"
                    aria-valuenow={Math.round(entry.percent)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="magical-glow h-full rounded-full bg-tertiary-fixed"
                      style={{ width: `${Math.max(entry.percent, 4)}%` }}
                    />
                  </div>
                </div>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary transition-transform group-hover:scale-110">
                  <Play className="size-4 fill-current" aria-hidden="true" />
                  <span className="sr-only">{t('home.continue.resume', 'Resume')}</span>
                </span>
              </Link>
            ))}
      </div>
    </section>
  );
}
