'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, Pause, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Button } from '@kit/ui/shadcn/button';
import { cn } from '@kit/ui/lib';

import { previewVoice } from '~/lib/client/elevenlabs';

interface PreviewAudioProps {
  voiceId: string;
  voiceName: string;
  /** ElevenLabs' stock sample. When present it is played directly and costs no credits. */
  previewUrl?: string | null;
}

type Status = 'idle' | 'loading' | 'playing' | 'paused';

// Only one voice sample plays at a time across the page.
let activeAudio: HTMLAudioElement | null = null;

/**
 * One play/pause control per voice.
 *
 * Plays the free `preview_url` sample ElevenLabs returns with each voice. Only voices without one
 * (e.g. some freshly cloned voices) fall back to generating a sample via text-to-speech, which
 * spends credits, so that path is labelled and the result is reused instead of regenerated.
 */
export function PreviewAudio({ voiceId, voiceName, previewUrl }: PreviewAudioProps) {
  const { t } = useTranslation('custom');
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const generatedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        if (activeAudio === audio) activeAudio = null;
      }
      if (generatedUrlRef.current) URL.revokeObjectURL(generatedUrlRef.current);
    };
  }, []);

  // A new sample source (voice changed or refreshed) invalidates the loaded audio.
  useEffect(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setStatus('idle');
    setProgress(0);
  }, [voiceId, previewUrl]);

  const getAudio = useCallback(async (): Promise<HTMLAudioElement> => {
    if (audioRef.current) return audioRef.current;
    let src = previewUrl ?? generatedUrlRef.current;
    if (!src) {
      src = await previewVoice(voiceId, `My name is ${voiceName}`);
      generatedUrlRef.current = src;
    }
    const audio = new Audio(src);
    audio.addEventListener('play', () => setStatus('playing'));
    audio.addEventListener('pause', () => setStatus((s) => (s === 'loading' ? s : 'paused')));
    audio.addEventListener('ended', () => {
      setStatus('idle');
      setProgress(0);
    });
    audio.addEventListener('timeupdate', () => {
      if (audio.duration > 0) setProgress(audio.currentTime / audio.duration);
    });
    audioRef.current = audio;
    return audio;
  }, [previewUrl, voiceId, voiceName]);

  const toggle = useCallback(async () => {
    if (status === 'playing') {
      audioRef.current?.pause();
      return;
    }
    try {
      if (!audioRef.current) setStatus('loading');
      const audio = await getAudio();
      if (activeAudio && activeAudio !== audio) activeAudio.pause();
      activeAudio = audio;
      await audio.play();
    } catch (error) {
      console.error('Preview error:', error);
      toast.error(
        error instanceof Error ? error.message : t('voices.previewError', 'Could not play the voice sample'),
      );
      audioRef.current = null;
      setStatus('idle');
    }
  }, [getAudio, status, t]);

  const playing = status === 'playing';
  const usesCredits = !previewUrl && !generatedUrlRef.current;
  const label = playing
    ? t('voices.previewPause', 'Pause sample')
    : usesCredits
      ? t('voices.previewGenerate', 'Generate sample (uses credits)')
      : t('voices.previewPlay', 'Play sample');

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        size="icon"
        onClick={toggle}
        disabled={status === 'loading'}
        aria-label={`${label}: ${voiceName}`}
        aria-pressed={playing}
        className="size-11 shrink-0 rounded-full"
      >
        {status === 'loading' ? (
          <Loader2 className="size-5 animate-spin" />
        ) : playing ? (
          <Pause className="size-5" />
        ) : (
          <Play className="size-5" />
        )}
      </Button>
      <div className="min-w-0 flex-1">
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-surface-variant"
          role="progressbar"
          aria-label={t('voices.previewProgress', 'Sample progress')}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div
            className={cn('h-full rounded-full bg-primary transition-[width] duration-200')}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="mt-1 truncate font-label-lg text-xs text-on-surface-variant">{label}</p>
      </div>
    </div>
  );
}
