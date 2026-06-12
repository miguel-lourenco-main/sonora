import { Toaster } from '@kit/ui/shadcn/sonner';
import { cn } from '@kit/ui/lib';

import { RootProviders } from '~/components/root-providers';
import { display, body } from '~/lib/fonts';
import type { Metadata } from 'next';
import appConfig from '~/config/app.config';

import '../styles/globals.css';
import { AppHeader } from './_components/app-header';
import { AppFooter } from './_components/app-footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const language = 'en';
  const theme: 'light' | 'dark' | 'system' = 'light';
  const className = getClassName(theme);

  return (
    <html lang={language} className={className}>
      <body className="flex min-h-screen flex-col">
        <RootProviders theme={theme} lang={language}>
          <AppHeader />
          <main className="flex flex-1 flex-col">{children}</main>
          <AppFooter />
        </RootProviders>

        <Toaster richColors={true} theme={theme} position="top-center" />
      </body>
    </html>
  );
}

function getClassName(theme?: string) {
  const dark = theme === 'dark';
  const light = !dark;

  const fontVars = [display.variable, body.variable];

  return cn('min-h-screen bg-background antialiased', ...fontVars, {
    dark,
    light,
  });
}

export const metadata: Metadata = {
  title: appConfig.title,
  description: appConfig.description,
  metadataBase: new URL(appConfig.url),
  applicationName: appConfig.name,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/app-icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/app-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/app-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '360x360', type: 'image/png' }],
  },
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
