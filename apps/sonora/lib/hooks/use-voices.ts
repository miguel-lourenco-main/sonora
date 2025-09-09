import { useState, useEffect } from 'react';
import { Voice } from '~/lib/types';
import { getVoices } from '~/lib/actions';

export function useVoices() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchVoices() {
      try {
        console.log('Fetching voices...');
        const fetchedVoices = await getVoices();
        console.log('Fetched voices:', fetchedVoices);
        
        if (fetchedVoices) {
          const processedVoices = fetchedVoices.map(voice => ({
            ...voice,
            is_default: false
          }));
          console.log('Processed voices:', processedVoices);
          setVoices(processedVoices);
        }
      } catch (err) {
        console.error('Error fetching voices:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch voices'));
      } finally {
        setIsLoading(false);
      }
    }

    void fetchVoices();
  }, []);

  return { voices, isLoading, error };
} 