'use client';

import { useTranslation } from 'react-i18next';

import { FeaturedStory } from '~/app/_components/home/featured-story';
import { PageContainer } from '@/components/sonora';
import { useGsap } from '~/lib/landing/use-gsap';
import type { Story } from '~/lib/types';
import { ChapterMarker } from '../ui/chapter-marker';

/**
 * Spotlight on the featured story, revealed with a soft book-page wipe as it
 * scrolls into view. Reuses the existing FeaturedStory card.
 */
export function FeaturedTale({ story }: { story: Story }) {
  const { t } = useTranslation('custom');

  const rootRef = useGsap<HTMLDivElement>(({ gsap, ScrollTrigger, root, reduced }) => {
    const head = root.querySelector('[data-reveal]');
    const card = root.querySelector('[data-card]');
    if (reduced) return;
    if (head) gsap.from(head, { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 80%', once: true } });
    if (card)
      gsap.from(card, {
        opacity: 0,
        y: 60,
        clipPath: 'inset(0 100% 0 0)',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 82%', once: true },
      });
  }, []);

  return (
    <section className="relative py-12 md:py-16">
      <PageContainer ref={rootRef}>
        <div data-reveal className="mb-8 text-center">
          <ChapterMarker index="03" label={t('home.featured.chapter', 'Tonight’s tale')} />
        </div>
        <div data-card>
          <FeaturedStory story={story} />
        </div>
      </PageContainer>
    </section>
  );
}
