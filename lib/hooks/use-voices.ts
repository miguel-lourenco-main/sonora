import { useState, useEffect, useCallback } from 'react';
import { Voice } from '~/lib/types';
import { listVoices } from '../client/elevenlabs';
import { getCachedVoices, setCachedVoices, getElevenLabsApiKey } from '../local/storage';

export function useVoices() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVoices = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const key = getElevenLabsApiKey();
      if (!key) {
        setVoices([]);
        return;
      }
      
      const cached = getCachedVoices<Voice[]>();
      if (cached && cached.length && !forceRefresh) {
        setVoices(cached);
      } else {
        const apiVoices = await listVoices();
        const uiVoices: Voice[] = apiVoices.map(v => ({
          id: v.voice_id,
          voice_id: v.voice_id,
          name: v.name,
          is_default: false,
          account_id: 'local',
          created_at: new Date((v.date_unix ?? Date.now()) * 1000).toISOString(),
        } as unknown as Voice));
        setVoices(uiVoices);
        // cache for 6 hours
        setCachedVoices(uiVoices, 6 * 60 * 60 * 1000);
      }
    } catch (err) {
      console.error('Error fetching voices:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch voices';
      setError(new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchVoices();
  }, [fetchVoices]);

  return { voices, isLoading, error, refetch: fetchVoices };
} 