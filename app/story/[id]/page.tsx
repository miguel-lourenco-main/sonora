import type { Metadata } from 'next';

import { bookData } from '~/lib/data/sample-story';
import { getStoryCategory } from '~/lib/data/story-categories';

import { StoryDetailClient } from './_components/story-detail-client';

export const dynamicParams = false;
export const dynamic = 'force-static';

export function generateStaticParams() {
  return bookData.map((b) => ({ id: b.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const story = bookData.find((b) => b.id === id);
  return { title: story ? story.title : 'Story' };
}

async function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const numericId = parseInt(id);
  if (isNaN(numericId) || numericId < 1 || numericId > 10) {
    return <div>Book not found</div>;
  }

  const story = bookData[numericId - 1];

  if (!story) {
    return <div>Book not found</div>;
  }

  const category = getStoryCategory(story);
  const others = bookData.filter((b) => b.id !== story.id);
  const sameCategory = others.filter((b) => getStoryCategory(b) === category);
  const related = [...sameCategory, ...others.filter((b) => !sameCategory.includes(b))].slice(0, 3);

  return <StoryDetailClient story={story} related={related} />;
}

export default StoryDetailPage;
