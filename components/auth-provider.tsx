'use client';

import { useCallback } from 'react';

export function AuthProvider(props: React.PropsWithChildren) {
  return props.children;
}

function useDispatchAppEventFromAuthEvent() {
  return useCallback(
    (
      type: string,
      userId: string | undefined,
      traits: Record<string, string> = {},
    ) => {
      // no-op without supabase auth
    },
    [],
  );
}
