import { Toaster } from '@kit/ui/shadcn/sonner';
import { cn } from '@kit/ui/lib';

import { RootProviders } from '~/components/root-providers';
import { AppLogo } from '~/components/app-logo';
import { heading, sans, oregano } from '~/lib/fonts';
import type { Metadata } from 'next';
import appConfig from '~/config/app.config';

import '../styles/globals.css';
import { ModeToggle } from '@kit/ui/makerkit/mode-toggle';
import Link from 'next/link';

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
      <body className='flex flex-col h-screen'>
        <RootProviders theme={theme} lang={language}>
          <div className='flex flex-row justify-between items-center h-fit py-3 px-8'>
            <AppLogo width={96} height={96} />
            <nav className='flex flex-row justify-between text-lg text-muted-foreground items-center gap-4'>
              <Link href='/' className='hover:text-foreground transition-colors text-xl'>Stories</Link>
              <Link href='/voices' className='hover:text-foreground transition-colors text-xl'>Voices</Link>
            </nav>
            <ModeToggle />
          </div>
          {children}
        </RootProviders>

        <Toaster richColors={true} theme={theme} position="top-center" />
      </body>
    </html>
  );
}

function getClassName(theme?: string) {
  const dark = theme === 'dark';
  const light = !dark;

  const font = [sans.variable, heading.variable, oregano.variable].reduce<string[]>(
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/app-logo.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '360x360', type: 'image/png' },
    ],
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

