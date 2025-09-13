'use client';

import { useMemo } from 'react';

import dynamic from 'next/dynamic';

import { ThemeProvider } from 'next-themes';

import { AppEventsProvider } from '@kit/shared/events';
import { If } from '@kit/ui/makerkit/if';
import { VersionUpdater } from '@kit/ui/makerkit/version-updater';

import { AnalyticsProvider } from '~/components/analytics-provider';
import { AuthProvider } from '~/components/auth-provider';
import appConfig from '~/config/app.config';
import featuresFlagConfig from '~/config/feature-flags.config';

import { ReactQueryProvider } from './react-query-provider';

export function RootProviders({
  lang,
  theme = appConfig.theme,
  children,
}: React.PropsWithChildren<{
  lang: string;
  theme?: string;
}>) {

  return (
    <AppEventsProvider>
      <AnalyticsProvider>
        <ReactQueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              enableSystem
              disableTransitionOnChange
              defaultTheme={theme}
              enableColorScheme={false}
            >
              {children}
            </ThemeProvider>
          </AuthProvider>

          <If condition={featuresFlagConfig.enableVersionUpdater}>
            <VersionUpdater />
          </If>
        </ReactQueryProvider>
      </AnalyticsProvider>
    </AppEventsProvider>
  );
}
