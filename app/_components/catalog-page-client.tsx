'use client';

// Home catalog shell: category pills + story grid over static `bookData`.

import { useMemo, useState } from 'react';
import { AudiobookCard } from './custom/audiobook-card';
import { CategoryPills } from './custom/category-pills';
import { PageContainer } from '@/components/sonora';
import {
  CATALOG_CATEGORIES,
  filterStoriesByCategory,
} from '~/lib/data/story-categories';
import type { Story } from '~/lib/types';

interface CatalogPageClientProps {
  stories: Story[];
}

export function CatalogPageClient({ stories }: CatalogPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState(CATALOG_CATEGORIES[0] ?? 'All Stories');

  const filteredStories = useMemo(
    () => filterStoriesByCategory(stories, selectedCategory),
    [stories, selectedCategory],
  );

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

      <section className="overflow-hidden py-12 md:py-16">
        <PageContainer className="relative z-10 text-center">
          <h1 className="font-display-lg text-display-lg text-primary">Choose Your Story</h1>
          <p className="mx-auto mt-4 max-w-xl font-body-lg text-body-lg text-on-surface-variant">
            Where will your imagination take you today? Explore an enchanted library of endless possibilities.
          </p>
          <div className="mt-8 hidden md:block">
            <CategoryPills
              categories={CATALOG_CATEGORIES}
              selected={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>
        </PageContainer>
      </section>

      <PageContainer className="relative z-10 pb-20">
        <div className="mb-8 md:hidden">
          <CategoryPills
            categories={CATALOG_CATEGORIES}
            selected={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>

        {filteredStories.length === 0 ? (
          <p className="py-16 text-center font-body-lg text-body-lg text-on-surface-variant">
            No stories in this category yet. Try another filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 place-items-center gap-10 md:grid-cols-2 lg:grid-cols-3">
            {filteredStories.map((story) => (
              <AudiobookCard key={story.id} story={story} className="w-full max-w-md" />
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  );
}
