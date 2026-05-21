'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@kit/ui/lib';
import { ModeToggle } from '@kit/ui/makerkit/mode-toggle';
import { PageContainer } from '@/components/sonora';

const navLinks = [
  { href: '/', label: 'Stories' },
  { href: '/voices', label: 'Voices' },
] as const;

export function AppHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface/80 shadow-sm backdrop-blur-md transition-all duration-300">
      <PageContainer className="flex h-20 items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <button
            type="button"
            className="rounded-xl p-2 transition-transform active:scale-95 hover:bg-surface-container-high/50 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? (
              <X className="size-6 text-primary" />
            ) : (
              <Menu className="size-6 text-primary" />
            )}
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
          >
            <Image
              src="/images/app-icon.png"
              alt=""
              width={40}
              height={40}
              className="size-9 rounded-xl shadow-sm md:size-10"
              priority
            />
            <span className="font-headline-lg text-headline-lg-mobile text-primary tracking-tight md:text-headline-lg">
              Sonora
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'px-2 py-1 font-label-lg text-label-lg transition-colors',
                    active
                      ? 'border-b-2 border-tertiary-fixed font-bold text-primary'
                      : 'text-on-surface-variant hover:text-primary',
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <ModeToggle />
        </div>
      </PageContainer>
      {mobileOpen && (
        <nav className="border-t border-outline-variant/30 bg-surface/95 px-container-margin-mobile py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'rounded-xl px-4 py-3 font-label-lg text-label-lg transition-colors',
                    active
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-low',
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
