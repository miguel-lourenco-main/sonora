import { WordTiming } from '../types';

/** Split narration text the same way the UI renders words. */
export function tokenizeNarrationText(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

export function normalizeNarrationWord(word: string): string {
  return word.toLowerCase().replace(/[^\w']/g, '');
}

/**
 * Compress timings that overshoot the audio file so the last word ends at
 * `targetDuration`. Never stretches: audio files commonly end with trailing
 * silence, and stretching precise timings into that silence shifts every
 * word late (the further into the text, the worse — a classic source of
 * "highlight is a word or two off").
 */
export function rescaleWordTimings(
  timings: WordTiming[],
  targetDuration: number,
): WordTiming[] {
  if (timings.length === 0 || targetDuration <= 0) {
    return timings;
  }

  const lastEnd = timings[timings.length - 1]?.end ?? 0;
  if (lastEnd <= targetDuration + 0.02) {
    return timings;
  }

  const scale = targetDuration / lastEnd;
  return timings.map((timing) => ({
    ...timing,
    start: timing.start * scale,
    end: timing.end * scale,
  }));
}

export interface AsrWord {
  word: string;
  start: number;
  end: number;
}

/**
 * Sequentially match ASR words to display tokens. Returns one entry per
 * token: the matched ASR span, or null where the ASR transcript diverges.
 */
export function matchAsrWordsToTokens(
  text: string,
  asrWords: AsrWord[],
): (AsrWord | null)[] {
  const tokens = tokenizeNarrationText(text);
  const matched: (AsrWord | null)[] = [];
  let asrIndex = 0;
  const LOOKAHEAD = 6;

  for (const token of tokens) {
    const norm = normalizeNarrationWord(token).replace(/'/g, '');
    let found: AsrWord | null = null;

    outer: for (
      let look = asrIndex;
      look < Math.min(asrIndex + LOOKAHEAD, asrWords.length);
      look++
    ) {
      // A display token like "snow-capped" arrives from ASR as several
      // words — try concatenations of 1..3 consecutive ASR words.
      let concat = '';
      for (let span = 0; span < 3 && look + span < asrWords.length; span++) {
        const candidate = asrWords[look + span];
        if (!candidate) break;
        concat += normalizeNarrationWord(candidate.word).replace(/'/g, '');
        if (concat === norm) {
          found = {
            word: token,
            start: asrWords[look]!.start,
            end: candidate.end,
          };
          asrIndex = look + span + 1;
          break outer;
        }
        if (concat.length > norm.length) break;
      }
    }
    matched.push(found);
  }

  return matched;
}

/**
 * Map ASR (speech-to-text) word timestamps onto display tokens. Tokens the
 * ASR missed (numerals, disfluencies) are interpolated between neighbours,
 * so the result always has one timing per display token.
 */
export function mapAsrWordsToTokens(
  text: string,
  asrWords: AsrWord[],
  duration: number,
): WordTiming[] {
  const tokens = tokenizeNarrationText(text);
  const matched = matchAsrWordsToTokens(text, asrWords);

  return tokens.map((token, index) => {
    const hit = matched[index];
    if (hit) {
      return { word: token, start: hit.start, end: hit.end };
    }
    const prev = matched.slice(0, index).reverse().find(Boolean);
    const next = matched.slice(index + 1).find(Boolean);
    const start = prev ? prev.end : 0;
    const end = next ? next.start : duration;
    return { word: token, start, end: Math.max(end, start + 0.05) };
  });
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

/** Pause weight (in character-equivalent units) added after a token. */
function pauseWeightAfter(word: string): number {
  if (/[.!?…]['")\]]*$/.test(word)) return 8; // sentence boundary
  if (/[,;:—–]['")\]]*$/.test(word)) return 3; // clause boundary
  return 0;
}

/**
 * Distribute duration across tokens by word length AND punctuation pauses.
 * TTS engines pause noticeably at sentence/clause boundaries; ignoring those
 * pauses makes a uniform schedule drift ahead of speech around every period.
 * Pause time is appended to the preceding word's span so timings stay
 * contiguous (the word stays highlighted through its pause).
 */
export function buildPunctuationAwareWordTimings(
  text: string,
  duration: number,
): WordTiming[] {
  const tokens = tokenizeNarrationText(text);
  if (tokens.length === 0 || duration <= 0) {
    return [];
  }

  const speakWeights = tokens.map(wordLengthWeight);
  const pauseWeights = tokens.map((token, index) =>
    index === tokens.length - 1 ? 0 : pauseWeightAfter(token),
  );
  const totalWeight =
    speakWeights.reduce((sum, w) => sum + w, 0) +
    pauseWeights.reduce((sum, w) => sum + w, 0);

  let cursor = 0;
  return tokens.map((word, index) => {
    const isLast = index === tokens.length - 1;
    const span =
      (((speakWeights[index] ?? 1) + (pauseWeights[index] ?? 0)) / totalWeight) *
      duration;
    const start = cursor;
    const end = isLast ? duration : cursor + span;
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
