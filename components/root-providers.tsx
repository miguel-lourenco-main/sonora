'use client';

import { useMemo } from 'react';

import dynamic from 'next/dynamic';

import { ThemeProvider } from 'next-themes';

// import { AppEventsProvider } from '../lib/shared/events/index';
import { If } from '@kit/ui/makerkit/if';
import { VersionUpdater } from '@kit/ui/makerkit/version-updater';

import { AnalyticsProvider } from '~/components/analytics-provider';
import { AuthProvider } from '~/components/auth-provider';
import appConfig from '~/config/app.config';
import featuresFlagConfig from '~/config/feature-flags.config';

import { ReactQueryProvider } from './react-query-provider';
import { I18nProvider } from '~/lib/i18n/i18n-provider';
import { getI18nSettings } from '~/lib/i18n/i18n.settings';
import { i18nClientResolver } from '~/lib/i18n/i18n.client-resolver';
import { installConsoleFilter } from '~/lib/utils/console-filter';

export function RootProviders({
  lang,
  theme = appConfig.theme,
  children,
}: React.PropsWithChildren<{
  lang: string;
  theme?: string;
}>) {
  // Install console filter once on the client
  installConsoleFilter();
  const i18nSettings = getI18nSettings(lang);

  return (
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
              <I18nProvider settings={i18nSettings} resolver={i18nClientResolver}>
                {children}
              </I18nProvider>
            </ThemeProvider>
          </AuthProvider>

          <If condition={featuresFlagConfig.enableVersionUpdater}>
            <VersionUpdater />
          </If>
        </ReactQueryProvider>
      </AnalyticsProvider>
  );
}
