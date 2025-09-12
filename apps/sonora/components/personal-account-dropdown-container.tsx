'use client';

import type { User } from '@supabase/supabase-js';

// accounts and supabase removed

import featuresFlagConfig from '~/config/feature-flags.config';
import pathsConfig from '~/config/paths.config';

const paths = {
  app: pathsConfig.app.selectStoryPage,
};

const features = {
  enableThemeToggle: featuresFlagConfig.enableThemeToggle,
};

export function ProfileAccountDropdownContainer(props: {
  user?: User;

  account?: {
    id: string | null;
    name: string | null;
    picture_url: string | null;
  };
}) {
  return null;
}
