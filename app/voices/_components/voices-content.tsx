'use client';

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiKeysSection } from './api-keys-section';
import VoicesTable from './voices-table';
import { PageContainer, StaggerGroup, StaggerItem } from '@/components/sonora';

export function VoicesContent() {
  const { t } = useTranslation('custom');
  const [refetchVoices, setRefetchVoices] = useState<(() => Promise<void>) | null>(null);

  const handleRefetchReady = useCallback((refetch: () => Promise<void>) => {
    setRefetchVoices(() => refetch);
  }, []);

  return (
    <div className="relative">
      <div
        className="aurora-bg aurora-bg-animated pointer-events-none absolute inset-x-0 top-0 h-72 opacity-60"
        aria-hidden="true"
      />
      <PageContainer className="relative flex flex-col gap-10 py-8 md:py-12">
        <StaggerGroup inView={false} stagger={0.08}>
          <StaggerItem>
            <section>
              <span className="font-label-lg text-label-lg uppercase tracking-[0.25em] text-tertiary">
                {t('voiceStudio.eyebrow', 'Cast your narrators')}
              </span>
              <h1 className="mt-3 font-display-lg text-display-lg text-primary">
                {t('voiceStudio.titleLead', 'Voice')}{' '}
                <span className="italic text-gradient-gold">
                  {t('voiceStudio.titleAccent', 'Studio')}
                </span>
              </h1>
              <p className="mt-3 max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
                {t(
                  'voiceStudio.subtitle',
                  'Craft the narrators of your tales — record or upload a voice and hear your stories come alive.',
                )}
              </p>
            </section>
          </StaggerItem>
        </StaggerGroup>
        <ApiKeysSection onRefetchVoices={refetchVoices || undefined} />
        <VoicesTable
          initialVoices={[]}
          onRefetchReady={handleRefetchReady}
        />
      </PageContainer>
    </div>
  );
}
