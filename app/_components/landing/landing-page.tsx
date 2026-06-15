'use client';

import { useMemo } from 'react';

import { FEATURED_STORY_ID } from '~/lib/data/mock-engagement';
import type { Story } from '~/lib/types';

import { Hero } from './hero/hero';
import { Branching } from './sections/branching';
import { FeaturedTale } from './sections/featured-tale';
import { Features } from './sections/features';
import { StoryLibrary } from './sections/story-library';
import { VoicesCta } from './sections/voices-cta';
import { SmoothScroll } from './smooth-scroll';

interface LandingPageProps {
  stories: Story[];
}

export function LandingPage({ stories }: LandingPageProps) {
  const featuredStory = useMemo(
    () => stories.find((story) => story.id === FEATURED_STORY_ID),
    [stories],
  );

  return (
    <SmoothScroll>
      <div className="relative flex flex-col">
        <Hero />
        <Features />
        <Branching />
        {featuredStory ? <FeaturedTale story={featuredStory} /> : null}
        <StoryLibrary stories={stories} />
        <VoicesCta />
      </div>
    </SmoothScroll>
  );
}
