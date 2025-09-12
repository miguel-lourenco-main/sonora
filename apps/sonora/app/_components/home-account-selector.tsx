'use client';

import { useContext } from 'react';

import { useRouter } from 'next/navigation';

// accounts feature removed
import { SidebarContext } from '@kit/ui/shadcn-sidebar';

import featureFlagsConfig from '~/config/feature-flags.config';
import pathsConfig from '~/config/paths.config';

const features = {
  enableTeamCreation: featureFlagsConfig.enableTeamCreation,
};

export function HomeAccountSelector(props: {
  accounts: Array<{
    label: string | null;
    value: string | null;
    image: string | null;
  }>;

  userId: string;
  collisionPadding?: number;
}) {
  const router = useRouter();
  const context = useContext(SidebarContext);

  return null;
}
