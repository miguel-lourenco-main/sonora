'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@kit/ui/lib';
import { ModeToggle } from '@kit/ui/makerkit/mode-toggle';
import { PageContainer } from '@/components/sonora';

const navLinks = [
  { href: '/', label: 'Stories' },
  { href: '/voices', label: 'Voices' },
] as const;

function isActiveLink(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/' || pathname.startsWith('/story') || pathname.startsWith('/player');
  }
  return pathname.startsWith(href);
}

export function AppHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 ease-sonora',
        scrolled || mobileOpen
          ? 'border-b border-outline-variant/30 bg-surface/80 shadow-sm backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <PageContainer
        className={cn(
          'flex items-center justify-between transition-all duration-300 ease-sonora',
          scrolled ? 'h-16' : 'h-20',
        )}
      >
        <div className="flex items-center gap-4 md:gap-8">
          <button
            type="button"
            className="rounded-xl p-2.5 transition-transform active:scale-95 hover:bg-surface-container-high/50 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
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
          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map(({ href, label }) => {
              const active = isActiveLink(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative rounded-full px-4 py-2 font-label-lg text-label-lg transition-colors',
                    active
                      ? 'text-primary'
                      : 'text-on-surface-variant hover:text-primary',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-primary-container/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <ModeToggle />
        </div>
      </PageContainer>
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-outline-variant/30 bg-surface/95 md:hidden"
          >
            <div className="flex flex-col gap-3 px-container-margin-mobile py-4">
              {navLinks.map(({ href, label }, index) => {
                const active = isActiveLink(pathname, href);
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.2 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'block rounded-xl px-4 py-3 font-label-lg text-label-lg transition-colors',
                        active
                          ? 'bg-primary text-on-primary'
                          : 'text-on-surface-variant hover:bg-surface-container-low',
                      )}
                    >
                      {label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
