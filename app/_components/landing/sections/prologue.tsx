'use client';

import { useTranslation } from 'react-i18next';

import { PageContainer } from '@/components/sonora';
import { useGsap } from '~/lib/landing/use-gsap';

import { AncientBook } from '../ui/ancient-book';

/**
 * The Prologue — a hushed, candle-lit beat that sets the "old, mysterious
 * stories" tone before the catalog. The illuminated book is the centrepiece.
 */
export function Prologue() {
  const { t } = useTranslation('custom');

  const rootRef = useGsap<HTMLDivElement>(({ gsap, root, reduced }) => {
    if (reduced) return;
    const fades = root.querySelectorAll<HTMLElement>('[data-reveal]');
    gsap.from(fades, {
      opacity: 0,
      y: 28,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: root, start: 'top 80%', once: true },
    });
  }, []);

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* a darker, candle-lit pool so the gold reads as mysterious */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(70% 60% at 50% 45%, rgb(21 50 18 / 0.10), transparent 72%)',
        }}
      />
      <PageContainer ref={rootRef} className="relative flex flex-col items-center text-center">
        <span
          data-reveal
          className="font-label-lg text-label-lg uppercase tracking-[0.3em] text-tertiary"
        >
          {t('home.prologue.eyebrow', 'Prologue')}
        </span>
        <h2
          data-reveal
          className="mt-5 max-w-2xl font-display-lg text-[30px] leading-[1.1] text-on-background md:text-[52px]"
        >
          {t('home.prologue.titleLead', 'Every tale begins with')}{' '}
          <span className="italic text-gradient-gold">
            {t('home.prologue.titleAccent', 'an open book.')}
          </span>
        </h2>

        <div data-reveal className="mt-10 w-full md:mt-14">
          <AncientBook />
        </div>

        <p
          data-reveal
          className="mt-10 max-w-md font-display text-lg italic leading-relaxed text-on-surface-variant"
        >
          {t(
            'home.prologue.caption',
            'Lean in. The ink is still wet, the page still listening — and the next word is yours to choose.',
          )}
        </p>
      </PageContainer>
    </section>
  );
}
