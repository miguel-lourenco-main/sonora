'use client';

import { useCallback } from 'react';

import { useMonitoring } from '@kit/monitoring/hooks';
import { useAppEvents } from '@kit/shared/events';

import pathsConfig from '~/config/paths.config';

export function AuthProvider(props: React.PropsWithChildren) {
  return props.children;
}

function useDispatchAppEventFromAuthEvent() {
  const { emit } = useAppEvents();
  const monitoring = useMonitoring();

  return useCallback(
    (
      type: string,
      userId: string | undefined,
      traits: Record<string, string> = {},
    ) => {
      // no-op without supabase auth
    },
    [emit, monitoring],
  );
}
