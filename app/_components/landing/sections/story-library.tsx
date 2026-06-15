'use client';

import { useMemo, useState } from 'react';
import { BookOpenText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { AudiobookCard } from '~/app/_components/custom/audiobook-card';
import { CategoryPills } from '~/app/_components/custom/category-pills';
import { CatalogSearch } from '~/app/_components/home/catalog-search';
import { ContinueRail } from '~/app/_components/home/continue-rail';
import {
  EmptyState,
  PageContainer,
  SonoraButton,
  StaggerGroup,
  StaggerItem,
} from '@/components/sonora';
import {
  CATALOG_CATEGORIES,
  filterStoriesByCategory,
  getStoryCategory,
} from '~/lib/data/story-categories';
import type { Story } from '~/lib/types';

interface StoryLibraryProps {
  stories: Story[];
}

/**
 * The functional heart of the landing page: resume-listening rail plus a
 * searchable, filterable catalog of every story. Cards reveal in a GSAP batch
 * as they scroll into view (instant for reduced-motion users).
 */
export function StoryLibrary({ stories }: StoryLibraryProps) {
  const { t } = useTranslation('custom');
  const [selectedCategory, setSelectedCategory] = useState(CATALOG_CATEGORIES[0] ?? 'All Stories');
  const [query, setQuery] = useState('');

  const filteredStories = useMemo(() => {
    const byCategory = filterStoriesByCategory(stories, selectedCategory);
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return byCategory;
    return byCategory.filter(
      (story) =>
        story.title.toLowerCase().includes(trimmed) ||
        getStoryCategory(story).toLowerCase().includes(trimmed),
    );
  }, [stories, selectedCategory, query]);

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory(CATALOG_CATEGORIES[0] ?? 'All Stories');
  };

  return (
    <section id="library" aria-label={t('home.library.title', 'Story library')} className="scroll-mt-24">
      <PageContainer className="flex flex-col gap-16 pb-28">
        <ContinueRail stories={stories} />

        <div>
          <div className="mb-10 flex flex-col items-center gap-3 text-center">
            <span className="font-label-lg text-label-lg uppercase tracking-[0.2em] text-tertiary">
              {t('home.library.eyebrow', 'The library')}
            </span>
            <h2 className="font-display-lg text-[34px] leading-tight text-on-background md:text-[52px]">
              {t('home.library.title', 'Choose tonight’s adventure')}
            </h2>
            <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
              {t(
                'home.library.subtitle',
                'Every tale branches with your choices and is read aloud in a voice you pick.',
              )}
            </p>
          </div>

          <div className="mb-10 flex flex-col items-center gap-5">
            <CatalogSearch value={query} onChange={setQuery} className="w-full max-w-md" />
            <CategoryPills
              categories={CATALOG_CATEGORIES}
              selected={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>

          {filteredStories.length === 0 ? (
            <EmptyState
              icon={BookOpenText}
              title={t('home.empty.title', 'No stories found')}
              description={t('home.empty.body', 'Try a different search or category.')}
              action={
                <SonoraButton variant="tonal" onClick={clearFilters}>
                  {t('home.empty.clear', 'Clear filters')}
                </SonoraButton>
              }
            />
          ) : (
            <StaggerGroup
              key={`${selectedCategory}-${query}`}
              className="grid grid-cols-1 place-items-center gap-10 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredStories.map((story) => (
                <StaggerItem key={story.id} className="size-full max-w-md">
                  <AudiobookCard story={story} className="w-full" />
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </div>
      </PageContainer>
    </section>
  );
}
