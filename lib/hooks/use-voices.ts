import { useState, useEffect, useCallback } from 'react';
import { Voice } from '~/lib/types';
import { listVoices, type ElevenLabsVoice } from '../client/elevenlabs';
import { getCachedVoices, setCachedVoices, getElevenLabsApiKey } from '../local/storage';

/** Maps an ElevenLabs voice to the shape the UI and the voices cache use. */
export function toUiVoice(v: ElevenLabsVoice): Voice {
  return {
    id: v.voice_id,
    voice_id: v.voice_id,
    name: v.name,
    is_default: false,
    account_id: 'local',
    created_at: new Date((v.date_unix ?? Date.now()) * 1000).toISOString(),
    // Always set (null when absent) so cache entries written before this field existed can be detected.
    preview_url: v.preview_url ?? null,
  } as unknown as Voice;
}

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
      // Caches written before preview_url was stored are refetched once.
      const cacheIsCurrent = !!cached?.length && 'preview_url' in (cached[0] as object);
      if (cached && cacheIsCurrent && !forceRefresh) {
        setVoices(cached);
      } else {
        const apiVoices = await listVoices();
        const uiVoices: Voice[] = apiVoices.map(toUiVoice);
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