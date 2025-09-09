import { useEffect, useState } from 'react';
import { calculateWordTimings, getAudioDuration } from '../utils/audio';

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
  provider: 'elevenlabs';
  wordTimings: WordTiming[];
};

type AudioTimingsProps = OpenAIAudioTimingsProps | ElevenLabsAudioTimingsProps;

type AudioTimingsResult = {
  duration: number;
  wordTimings: WordTiming[];
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

        if (props.provider === 'elevenlabs') {
          // For ElevenLabs, we already have the word timings
          setWordTimings(props.wordTimings);
          const audioDuration = await getAudioDuration(props.audioUrl);
          if (isMounted) {
            setDuration(audioDuration);
          }
        } else {
          // For OpenAI, we need to calculate word timings based on audio duration
          const audioDuration = await getAudioDuration(props.audioUrl);
          if (!isMounted) return;
          
          setDuration(audioDuration);
          const calculatedTimings = calculateWordTimings(props.text, audioDuration);
          setWordTimings(calculatedTimings);
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
  }, [props.audioUrl, props.provider, props.provider === 'elevenlabs' ? props.wordTimings : props.text]);

  return {
    duration,
    wordTimings,
    isLoading,
    error
  };
} 