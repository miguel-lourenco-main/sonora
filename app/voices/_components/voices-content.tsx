'use client';

import { useState, useCallback } from 'react';
import { ApiKeysSection } from './api-keys-section';
import VoicesTable from './voices-table';
import { PageContainer } from '@/components/sonora';

export function VoicesContent() {
  const [refetchVoices, setRefetchVoices] = useState<(() => Promise<void>) | null>(null);

  const handleRefetchReady = useCallback((refetch: () => Promise<void>) => {
    setRefetchVoices(() => refetch);
  }, []);

  return (
    <PageContainer className="flex flex-col gap-10 py-8 md:py-12">
      <section>
        <h1 className="font-display-lg text-display-lg text-primary">Voice Library</h1>
        <p className="mt-2 max-w-2xl font-body-md text-body-md text-on-surface-variant">
          Manage your magical narrators and connection keys. Crafted for parents, powered by wonder.
        </p>
      </section>
      <ApiKeysSection onRefetchVoices={refetchVoices || undefined} />
      <VoicesTable 
        initialVoices={[]}
        onRefetchReady={handleRefetchReady}
      />
    </PageContainer>
  );
}
