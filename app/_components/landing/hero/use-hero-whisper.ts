'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import rawTimings from '~/lib/data/sample-word-timings.json';
import { heroAudioBus } from '~/lib/landing/hero-audio-bus';

const SRC = '/samples/enchanted-forest-start.mp3';
const KEY = 'enchanted-forest-start';

interface Timing {
  word: string;
  start: number;
  end: number;
}

export interface WhisperWord {
  word: string;
  start: number;
  end: number;
}

/** Build the displayed excerpt: the first sentence of the narration. */
function buildExcerpt(): WhisperWord[] {
  const all = (rawTimings as Record<string, Timing[]>)[KEY] ?? [];
  const words: WhisperWord[] = [];
  for (const w of all) {
    words.push(w);
    if (w.word.includes('.')) break;
  }
  return words.length ? words : all.slice(0, 16);
}

/**
 * The "Hear a whisper" signature: plays the real narration sample, feeds a live
 * audio level into the hero scene (so the aurora breathes with the voice), and
 * tracks the active word for word-synced highlighting. Auto-stops at the end of
 * the displayed sentence to keep it a short, magical taste. Degrades gracefully
 * if Web Audio is unavailable.
 */
export function useHeroWhisper() {
  const [playing, setPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef(0);
  const wordsRef = useRef<WhisperWord[]>([]);
  const cancelledRef = useRef(false);

  if (wordsRef.current.length === 0) wordsRef.current = buildExcerpt();
  const words = wordsRef.current;
  const lastEnd = words.length ? words[words.length - 1].end : 6;

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    heroAudioBus.set(0);
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    // Release the audio clock while idle (it is resumed again on the next play).
    void ctxRef.current?.suspend?.();
    setPlaying(false);
    setActiveIndex(-1);
  }, []);

  const play = useCallback(async () => {
    let a = audioRef.current;
    if (!a) {
      a = new Audio(SRC);
      a.preload = 'auto';
      audioRef.current = a;
      a.addEventListener('ended', () => stop());
    }

    // Best-effort Web Audio analyser for real reactivity.
    if (!ctxRef.current) {
      try {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AC();
        const source = ctx.createMediaElementSource(a);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        ctxRef.current = ctx;
        analyserRef.current = analyser;
      } catch {
        // Fall back to plain playback + a synthetic level.
        ctxRef.current = null;
        analyserRef.current = null;
      }
    }

    if (ctxRef.current?.state === 'suspended') {
      try {
        await ctxRef.current.resume();
      } catch {
        /* ignore */
      }
    }

    a.currentTime = 0;
    try {
      await a.play();
    } catch {
      return;
    }
    // The component may have unmounted while we awaited resume()/play().
    if (cancelledRef.current) {
      a.pause();
      return;
    }
    setPlaying(true);

    const analyser = analyserRef.current;
    const data = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;

    const tick = () => {
      const audio = audioRef.current;
      if (!audio) return;

      let level: number;
      if (analyser && data) {
        analyser.getByteFrequencyData(data);
        const n = Math.min(data.length, 64);
        let sum = 0;
        for (let i = 0; i < n; i++) sum += data[i];
        level = Math.min(1, (sum / n / 255) * 1.7);
      } else {
        // No analyser — synthesise a gentle pulse so the aurora still reacts.
        level = 0.4 + 0.25 * Math.sin(audio.currentTime * 7);
      }
      heroAudioBus.set(level);

      const ct = audio.currentTime;
      let idx = -1;
      for (let i = 0; i < words.length; i++) {
        if (ct >= words[i].start) idx = i;
        else break;
      }
      setActiveIndex(idx);

      if (ct >= lastEnd + 0.3) {
        stop();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [words, lastEnd, stop]);

  const toggle = useCallback(() => {
    if (playing) stop();
    else void play();
  }, [playing, play, stop]);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      heroAudioBus.set(0);
      audioRef.current?.pause();
      void ctxRef.current?.close?.();
    };
  }, []);

  return { playing, activeIndex, words, play, stop, toggle };
}
