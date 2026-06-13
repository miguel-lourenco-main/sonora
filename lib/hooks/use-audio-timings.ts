import { useEffect, useState } from 'react';
import { getAudioDuration } from '../utils/audio';
import {
  alignWordTimingsToText,
  buildPunctuationAwareWordTimings,
  NarrationSyncMode,
} from '../utils/narration-sync';

export type WordTiming = {
  word: string;
  start: number;
  end: number;
};

type OpenAIAudioTimingsProps = {
  audioUrl: string;
  text: string;
  provider: 'openai';
};

type ElevenLabsAudioTimingsProps = {
  audioUrl: string;
  text: string;
  provider: 'elevenlabs';
  wordTimings: WordTiming[];
};

type AudioTimingsProps = OpenAIAudioTimingsProps | ElevenLabsAudioTimingsProps;

type AudioTimingsResult = {
  duration: number;
  wordTimings: WordTiming[];
  syncMode: NarrationSyncMode;
  isLoading: boolean;
  error: Error | null;
};

export function useAudioTimings(props: AudioTimingsProps): AudioTimingsResult {
  const [duration, setDuration] = useState<number>(0);
  const [wordTimings, setWordTimings] = useState<WordTiming[]>(
    props.provider === 'elevenlabs' ? props.wordTimings : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTimings() {
      // Skip if no valid audio URL
      if (!props.audioUrl) {
        setIsLoading(false);
        setError(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const audioDuration = await getAudioDuration(props.audioUrl);
        if (!isMounted) return;

        setDuration(audioDuration);

        if (props.provider === 'elevenlabs') {
          // alignWordTimingsToText compresses timings that overshoot the
          // file but never stretches them into trailing silence.
          setWordTimings(
            alignWordTimingsToText(props.text, props.wordTimings, audioDuration),
          );
        } else {
          setWordTimings(
            buildPunctuationAwareWordTimings(props.text, audioDuration),
          );
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading audio timings:', err);
          setError(err instanceof Error ? err : new Error('Failed to load audio timings'));
          // Reset states on error
          setDuration(0);
          setWordTimings([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadTimings();

    return () => {
      isMounted = false;
    };
  }, [
    props.audioUrl,
    props.provider,
    props.text,
    props.provider === 'elevenlabs' ? props.wordTimings : undefined,
  ]);

  const syncMode: NarrationSyncMode =
    props.provider === 'elevenlabs' ? 'precise' : 'estimated';

  return {
    duration,
    wordTimings,
    syncMode,
    isLoading,
    error,
  };
} 