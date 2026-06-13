/**
 * Narration sync alignment report.
 *
 * Scores the app's word-highlight schedule against ground-truth word
 * timestamps (ASR-derived JSON: {duration, words: [{word,start,end}]}).
 *
 * Usage:
 *   pnpm tsx scripts/narration-sync-report.ts <story-label> <node-id> <truth.json>
 *
 * Example:
 *   pnpm tsx scripts/narration-sync-report.ts enchanted-forest start /tmp/ef-start-truth.json
 */
import fs from 'fs';

import { bookData } from '../lib/data/sample-story';
import sampleWordTimings from '../lib/data/sample-word-timings.json';
import type { WordTiming } from '../lib/types';
import {
  alignWordTimingsToText,
  buildLengthWeightedWordTimings,
  buildPunctuationAwareWordTimings,
  mapAsrWordsToTokens,
  matchAsrWordsToTokens,
  resolveActiveWordIndex,
  tokenizeNarrationText,
} from '../lib/utils/narration-sync';

const [storyLabel, nodeId, truthPath] = process.argv.slice(2);

if (!storyLabel || !nodeId || !truthPath) {
  console.error('usage: tsx scripts/narration-sync-report.ts <story-label> <node-id> <truth.json>');
  process.exit(1);
}

const story = bookData.find((b) => b.label === storyLabel);
// Sample stories use a single chapter per book today; extend if multi-chapter books are added.
const node = story?.chapters[0]?.content.nodes[nodeId];
if (!story || !node) {
  console.error(`node not found: ${storyLabel}/${nodeId}`);
  process.exit(1);
}

interface TruthWord {
  word: string;
  start: number;
  end: number;
}
const truth: { duration: number; words: TruthWord[] } = JSON.parse(
  fs.readFileSync(truthPath, 'utf8'),
);

const tokens = tokenizeNarrationText(node.text);

// Ground-truth words aligned to display tokens; nulls are ASR/text mismatches.
const truthByToken = matchAsrWordsToTokens(node.text, truth.words);
const matched = truthByToken.filter(Boolean).length;

/** Score one timing strategy: word-index drift at speech midpoints plus start-time error. */
function evaluate(name: string, timings: WordTiming[], mode: 'estimated' | 'precise') {
  // Score at each truth word's temporal midpoint — catches late/early highlights better than start-time-only checks.
  // mode selects how resolveActiveWordIndex interpolates between word boundaries.
  let totalOff = 0;
  let maxOff = 0;
  let firstOffIndex = -1;
  let offCount = 0;
  const offsets: number[] = [];
  const samples: string[] = [];

  truthByToken.forEach((tw, index) => {
    if (!tw) return;
    const mid = (tw.start + tw.end) / 2;
    const highlighted = resolveActiveWordIndex(timings, mid, truth.duration, mode);
    const off = highlighted - index; // + = highlight ahead of speech
    offsets.push(off);
    if (off !== 0) {
      offCount++;
      if (firstOffIndex === -1) firstOffIndex = index;
      if (Math.abs(off) > Math.abs(maxOff)) maxOff = off;
      if (samples.length < 5) {
        samples.push(
          `    @${mid.toFixed(2)}s speaking "${tokens[index]}" (#${index}) but highlighting "${tokens[highlighted] ?? '?'}" (#${highlighted}, ${off > 0 ? '+' : ''}${off})`,
        );
      }
    }
    totalOff += Math.abs(off);

    return undefined;
  });

  // Start-time delta per word (schedule vs truth)
  const deltas: number[] = [];
  truthByToken.forEach((tw, index) => {
    const timing = timings[index];
    if (!tw || !timing) return;
    deltas.push(timing.start - tw.start);
  });
  const meanDelta = deltas.reduce((a, b) => a + b, 0) / Math.max(deltas.length, 1);
  const maxDelta = deltas.reduce((a, b) => (Math.abs(b) > Math.abs(a) ? b : a), 0);

  console.log(`\n■ ${name} (${mode} mode)`);
  console.log(`  words misaligned at speech midpoint: ${offCount}/${matched} (${((offCount / matched) * 100).toFixed(0)}%)`);
  console.log(`  mean |words off|: ${(totalOff / matched).toFixed(2)}   worst: ${maxOff > 0 ? '+' : ''}${maxOff} words`);
  console.log(`  schedule start-time error: mean ${(meanDelta * 1000).toFixed(0)}ms, worst ${(maxDelta * 1000).toFixed(0)}ms (negative = highlight early)`);
  if (firstOffIndex >= 0) {
    console.log(`  first misalignment at word #${firstOffIndex} ("${tokens[firstOffIndex]}")`);
  }
  if (samples.length) {
    console.log('  examples:');
    samples.forEach((s) => console.log(s));
  }
}

console.log(`Story: ${storyLabel}/${nodeId}`);
console.log(`Tokens: ${tokens.length}, truth words: ${truth.words.length}, matched: ${matched}`);
console.log(`Audio duration: ${truth.duration}s`);

// Compare timing strategies from cheapest estimate to ground-truth ASR mapping.

// 1. Current production behavior for pre-recorded samples
evaluate('current: length-weighted estimate', buildLengthWeightedWordTimings(node.text, truth.duration), 'estimated');

// 2. Punctuation/silence-aware estimate (proposed fallback when no real timings exist)
evaluate('proposed: punctuation-aware estimate', buildPunctuationAwareWordTimings(node.text, truth.duration), 'estimated');

// 3. Node-attached timings, if any (what ElevenLabs nodes would use)
const stored = (node as { wordTimings?: WordTiming[] }).wordTimings;
if (stored?.length) {
  evaluate('node-attached timings', stored, 'precise');
}

// 4. The SHIPPED pipeline for pre-recorded samples: bundled JSON timings run
// through alignWordTimingsToText, exactly as use-audio-timings does.
const shipped = (sampleWordTimings as Record<string, WordTiming[]>)[
  `${storyLabel}-${nodeId}`
];
if (shipped?.length) {
  evaluate(
    'shipped: sample-word-timings.json via app pipeline',
    alignWordTimingsToText(node.text, shipped, truth.duration),
    'precise',
  );
} else {
  console.log('\n(no shipped sample timings for this node)');
}

// 5. Direct ASR mapping of this truth file (upper bound)
evaluate(
  'upper bound: ASR truth mapped to tokens',
  mapAsrWordsToTokens(node.text, truth.words, truth.duration),
  'precise',
);
