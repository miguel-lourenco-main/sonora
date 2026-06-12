'use client';

import { useMemo, useState } from 'react';
import { BookOpenText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { AudiobookCard } from './custom/audiobook-card';
import { CategoryPills } from './custom/category-pills';
import { CatalogSearch } from './home/catalog-search';
import { ContinueRail } from './home/continue-rail';
import { FeaturedStory } from './home/featured-story';
import { HeroSection } from './home/hero-section';
import {
  EmptyState,
  PageContainer,
  SonoraButton,
  StaggerGroup,
  StaggerItem,
} from '@/components/sonora';
import { FEATURED_STORY_ID } from '~/lib/data/mock-engagement';
import {
  CATALOG_CATEGORIES,
  filterStoriesByCategory,
  getStoryCategory,
} from '~/lib/data/story-categories';
import type { Story } from '~/lib/types';

interface CatalogPageClientProps {
  stories: Story[];
}

export function CatalogPageClient({ stories }: CatalogPageClientProps) {
  const { t } = useTranslation('custom');
  const [selectedCategory, setSelectedCategory] = useState(CATALOG_CATEGORIES[0] ?? 'All Stories');
  const [query, setQuery] = useState('');

  const featuredStory = useMemo(
    () => stories.find((story) => story.id === FEATURED_STORY_ID),
    [stories],
  );

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
    <div className="relative flex min-h-full flex-grow flex-col">
      {/* Thematic book cover texture */}
      <div
        className="pointer-events-none absolute inset-0 bg-repeat opacity-[0.30] dark:opacity-[0.06]"
        style={{
          backgroundImage: "url('/images/book_cover.png')",
          backgroundSize: 'min(420px, 55vw) auto',
          backgroundPosition: 'center 8%',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-background/92 to-background"
        aria-hidden
      />

      <div className="relative z-10">
        <HeroSection />

        <PageContainer className="flex flex-col gap-14 pb-20">
          <ContinueRail stories={stories} />

          {featuredStory ? <FeaturedStory story={featuredStory} /> : null}

          <section id="library" aria-label="Story library" className="scroll-mt-24">
            <div className="mb-8 flex flex-col items-center gap-5">
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
          </section>
        </PageContainer>
      </div>
    </div>
  );
}
