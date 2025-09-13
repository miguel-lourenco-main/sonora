'use client';

import { useState, useCallback } from 'react';
import { ApiKeysSection } from './api-keys-section';
import VoicesTable from './voices-table';

export function VoicesContent() {
  const [refetchVoices, setRefetchVoices] = useState<(() => Promise<void>) | null>(null);

  const handleRefetchReady = useCallback((refetch: () => Promise<void>) => {
    setRefetchVoices(() => refetch);
  }, []);

  return (
    <>
      <ApiKeysSection onRefetchVoices={refetchVoices || undefined} />
      <VoicesTable 
        initialVoices={[]}
        onRefetchReady={handleRefetchReady}
      />
    </>
  );
}
