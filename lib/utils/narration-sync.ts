import { WordTiming } from '../types';

/** Split narration text the same way the UI renders words. */
export function tokenizeNarrationText(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

export function normalizeNarrationWord(word: string): string {
  return word.toLowerCase().replace(/[^\w']/g, '');
}

/** Scale timings so the last word ends exactly at `targetDuration`. */
export function rescaleWordTimings(
  timings: WordTiming[],
  targetDuration: number,
): WordTiming[] {
  if (timings.length === 0 || targetDuration <= 0) {
    return timings;
  }

  const lastEnd = timings[timings.length - 1]?.end ?? 0;
  if (lastEnd <= 0 || Math.abs(lastEnd - targetDuration) < 0.02) {
    return timings;
  }

  const scale = targetDuration / lastEnd;
  return timings.map((timing) => ({
    ...timing,
    start: timing.start * scale,
    end: timing.end * scale,
  }));
}

/**
 * Map provider word timings onto display tokens (same length as tokenizeNarrationText).
 * Falls back to even distribution when alignment fails.
 */
export function alignWordTimingsToText(
  text: string,
  timings: WordTiming[],
  duration: number,
): WordTiming[] {
  const tokens = tokenizeNarrationText(text);
  if (tokens.length === 0) {
    return [];
  }

  if (timings.length === tokens.length) {
    return rescaleWordTimings(
      timings.map((timing, index) => ({
        ...timing,
        word: tokens[index] ?? timing.word,
      })),
      duration,
    );
  }

  const aligned: WordTiming[] = [];
  let timingIndex = 0;

  for (const token of tokens) {
    const normalizedToken = normalizeNarrationWord(token);

    while (
      timingIndex < timings.length &&
      normalizeNarrationWord(timings[timingIndex]?.word ?? '') !== normalizedToken
    ) {
      timingIndex += 1;
    }

    const match = timings[timingIndex];
    if (match && normalizeNarrationWord(match.word) === normalizedToken) {
      aligned.push({ ...match, word: token });
      timingIndex += 1;
    }
  }

  if (aligned.length === tokens.length) {
    return rescaleWordTimings(aligned, duration);
  }

  const slice = timings.length >= tokens.length ? timings.slice(0, tokens.length) : timings;
  const source = slice.length === tokens.length ? slice : timings;
  const step = duration / tokens.length;

  const evenTimings = tokens.map((token, index) => {
    const fromProvider = source[index];
    if (fromProvider) {
      return { ...fromProvider, word: token };
    }
    return {
      word: token,
      start: index * step,
      end: (index + 1) * step,
    };
  });

  return rescaleWordTimings(evenTimings, duration);
}

// Binary search for the last word whose start time is at or before `time`.
export function findActiveWordIndex(timings: WordTiming[], time: number): number {
  if (timings.length === 0 || time < 0) {
    return -1;
  }

  let lo = 0;
  let hi = timings.length - 1;
  let candidate = -1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const timing = timings[mid];
    if (!timing) break;

    if (time >= timing.start) {
      candidate = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  if (candidate === -1) {
    return 0;
  }

  const active = timings[candidate];
  if (!active) {
    return -1;
  }

  if (time <= active.end) {
    return candidate;
  }

  const next = timings[candidate + 1];
  if (next && time < next.start) {
    return candidate + 1;
  }

  return candidate;
}

export function getWordProgress(timing: WordTiming, time: number): number {
  const duration = timing.end - timing.start;
  if (duration <= 0) {
    return time >= timing.end ? 1 : 0;
  }
  return Math.min(1, Math.max(0, (time - timing.start) / duration));
}

function wordLengthWeight(word: string): number {
  return Math.max(1, word.replace(/[^\w']/g, '').length);
}

/** Distribute duration across tokens by word length (no punctuation pauses). */
export function buildLengthWeightedWordTimings(
  text: string,
  duration: number,
): WordTiming[] {
  const tokens = tokenizeNarrationText(text);
  if (tokens.length === 0 || duration <= 0) {
    return [];
  }

  const weights = tokens.map(wordLengthWeight);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = 0;

  return tokens.map((word, index) => {
    const weight = weights[index] ?? 1;
    const isLast = index === tokens.length - 1;
    const start = cursor;
    const end = isLast ? duration : cursor + (weight / totalWeight) * duration;
    cursor = end;
    return { word, start, end };
  });
}

function getAudioProgressIndex(
  timings: WordTiming[],
  audioTime: number,
  audioDuration: number,
): number {
  if (timings.length === 0 || audioDuration <= 0) {
    return -1;
  }

  const ratio = Math.min(1, Math.max(0, audioTime / audioDuration));
  let cumulative = 0;

  for (let i = 0; i < timings.length; i++) {
    const timing = timings[i];
    if (!timing) continue;
    const span = (timing.end - timing.start) / audioDuration;
    cumulative += span;
    if (ratio <= cumulative || i === timings.length - 1) {
      return i;
    }
  }

  return timings.length - 1;
}

export type NarrationSyncMode = 'estimated' | 'precise';

/**
 * Pick the active word from timings and the live audio clock.
 * Catches up when the schedule falls behind heard speech (common late in long phrases).
 */
export function resolveActiveWordIndex(
  timings: WordTiming[],
  audioTime: number,
  audioDuration: number,
  mode: NarrationSyncMode,
): number {
  if (timings.length === 0) {
    return -1;
  }

  if (mode === 'estimated') {
    return getAudioProgressIndex(timings, audioTime, audioDuration);
  }

  const scheduled = findActiveWordIndex(timings, audioTime);
  if (scheduled < 0 || audioDuration <= 0) {
    return scheduled;
  }

  const current = timings[scheduled];
  const audioProgress = getAudioProgressIndex(timings, audioTime, audioDuration);

  if (
    current &&
    audioTime > current.end + 0.03 &&
    audioProgress > scheduled
  ) {
    return audioProgress;
  }

  return scheduled;
}
