import { Toaster } from '@kit/ui/shadcn/sonner';
import { cn } from '@kit/ui/lib';

import { RootProviders } from '~/components/root-providers';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarHeader } from '@kit/ui/shadcn/sidebar';
import { SidebarNavigation } from '@kit/ui/shadcn/sidebar';
import { personalAccountNavigationConfig } from '~/config/personal-account-navigation.config';
import { AppLogo } from '~/components/app-logo';
import { heading, sans } from '~/lib/fonts';
import type { Metadata } from 'next';
import appConfig from '~/config/app.config';

import '../styles/globals.css';
import { ModeToggle } from '@kit/ui/makerkit/mode-toggle';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Default language and theme are derived on client; use fallbacks for static HTML
  const language = 'en';
  const theme: 'light' | 'dark' | 'system' = 'light';
  const className = getClassName(theme);

  return (
    <html lang={language} className={className}>
      <body>
        <RootProviders theme={theme} lang={language}>
          <SidebarProvider>
            <Sidebar>
              <SidebarHeader className={'flex flex-row h-16 justify-between items-center'}>
                <AppLogo width={56} height={56} />
                <ModeToggle />
              </SidebarHeader>
              <SidebarContent>
                <SidebarNavigation config={personalAccountNavigationConfig} />
              </SidebarContent>
            </Sidebar>
            <SidebarInset>
              {children}
            </SidebarInset>
          </SidebarProvider>
        </RootProviders>

        <Toaster richColors={true} theme={theme} position="top-center" />
      </body>
    </html>
  );
}

function getClassName(theme?: string) {
  const dark = theme === 'dark';
  const light = !dark;

  const font = [sans.variable, heading.variable].reduce<string[]>(
    (acc, curr) => {
      if (acc.includes(curr)) return acc;

      return [...acc, curr];
    },
    [],
  );

  return cn('min-h-screen bg-background antialiased', ...font, {
    dark,
    light,
  });
}

export const metadata: Metadata = {
  title: appConfig.title,
  description: appConfig.description,
  metadataBase: new URL(appConfig.url),
  applicationName: appConfig.name,
  openGraph: {
    url: appConfig.url,
    siteName: appConfig.name,
    title: appConfig.title,
    description: appConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: appConfig.title,
    description: appConfig.description,
  },
};

