import type { Story } from '~/lib/types';

/** Catalog filter label → story categories from data */
export const CATALOG_FILTER_MAP: Record<string, string[] | null> = {
  'All Stories': null,
  Adventure: ['Adventure'],
  Fantasy: ['Fiction'],
  Educational: ['Educational'],
  'Fairy Tale': ['Fairy Tale'],
};

export const CATALOG_CATEGORIES = Object.keys(CATALOG_FILTER_MAP) as string[];

/** Per-story category (aligned with audiobook-data where available) */
export const STORY_CATEGORY_BY_ID: Record<string, string> = {
  '1': 'Fairy Tale',
  '2': 'Adventure',
  '3': 'Fiction',
  '4': 'Fantasy',
  '5': 'Sci-Fi',
  '6': 'Biography',
  '7': 'Sci-Fi',
  '8': 'Adventure',
  '9': 'Mystery',
  '10': 'Educational',
};

export function getStoryCategory(story: Story): string {
  return STORY_CATEGORY_BY_ID[story.id] ?? 'Fiction';
}

export function filterStoriesByCategory(stories: Story[], filterLabel: string): Story[] {
  const allowed = CATALOG_FILTER_MAP[filterLabel];
  if (allowed === null || allowed === undefined) {
    return stories;
  }
  return stories.filter((story) => allowed.includes(getStoryCategory(story)));
}
