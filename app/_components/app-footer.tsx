'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageContainer } from '@/components/sonora';

const footerLinks = [
  { href: '/', labelKey: 'footer.links.stories', fallback: 'Stories' },
  { href: '/voices', labelKey: 'footer.links.voices', fallback: 'Voices' },
] as const;

export function AppFooter() {
  const { t } = useTranslation('custom');

  return (
    <footer className="site-footer relative mt-16 bg-surface-container-low/60">
      <PageContainer className="relative grid gap-10 py-12 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex w-fit items-center gap-3">
            <Image
              src="/images/app-icon.png"
              alt=""
              width={36}
              height={36}
              className="size-9 rounded-xl shadow-sm"
            />
            <span className="font-headline-md text-headline-md text-primary">Sonora</span>
          </Link>
          <p className="max-w-xs font-body-md text-body-md text-on-surface-variant">
            {t('footer.tagline', 'Interactive audiobooks where every choice writes a different tale.')}
          </p>
        </div>
        <nav
          className="flex flex-col gap-2"
          aria-label={t('footer.navLabel', 'Footer navigation')}
        >
          <span className="mb-1 font-label-lg text-label-lg uppercase tracking-widest text-tertiary">
            {t('footer.explore', 'Explore')}
          </span>
          {footerLinks.map(({ href, labelKey, fallback }) => (
            <Link
              key={href}
              href={href}
              className="w-fit py-1 font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary"
            >
              {t(labelKey, fallback)}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 md:items-end">
          <span className="inline-flex items-center gap-2 font-label-lg text-label-lg text-on-surface-variant">
            <Sparkles className="size-4 text-tertiary" aria-hidden="true" />
            {t('footer.madeWith', 'Made with wonder')}
          </span>
          <span className="font-body-md text-sm text-on-surface-variant/70">
            © {new Date().getFullYear()} Sonora
          </span>
        </div>
      </PageContainer>
    </footer>
  );
}
