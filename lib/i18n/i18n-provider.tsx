'use client';

import { useEffect, useState } from 'react';
import type { InitOptions, i18n } from 'i18next';

import { initializeI18nClient } from './i18n.client';

let i18nInstance: i18n | undefined;
let initializingPromise: Promise<void> | null = null;

type Resolver = (
  lang: string,
  namespace: string,
) => Promise<Record<string, string>>;

export function I18nProvider({
  settings,
  children,
  resolver,
}: React.PropsWithChildren<{
  settings: InitOptions;
  resolver: Resolver;
}>) {
  const ready = useI18nClient(settings, resolver);

  if (!ready) {
    return null;
  }

  return children;
}

/**
 * @name useI18nClient
 * @description A hook that initializes the i18n client.
 * @param settings
 * @param resolver
 */
function useI18nClient(settings: InitOptions, resolver: Resolver) {
  // Kick off initialization without suspending render
  const [ready, setReady] = useState<boolean>(!!i18nInstance);

  useEffect(() => {
    const needsInit =
      !i18nInstance ||
      i18nInstance.language !== settings.lng ||
      (Array.isArray(i18nInstance.options.ns) &&
        Array.isArray(settings.ns) &&
        i18nInstance.options.ns.length !== settings.ns.length);

    if (needsInit && !initializingPromise) {
      initializingPromise = loadI18nInstance(settings, resolver)
        .then(() => setReady(true))
        .finally(() => {
          initializingPromise = null;
        });
    }
  }, [settings.lng, Array.isArray(settings.ns) ? settings.ns.length : 0, resolver]);

  return ready;
}

async function loadI18nInstance(settings: InitOptions, resolver: Resolver) {
  i18nInstance = await initializeI18nClient(settings, resolver);
}


