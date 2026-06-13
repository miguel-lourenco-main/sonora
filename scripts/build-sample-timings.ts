/**
 * Build lib/data/sample-word-timings.json from ASR transcriptions of the
 * pre-recorded sample audio in public/samples/.
 *
 * 1. Produce per-file ASR JSON ({duration, words:[{word,start,end}]}), e.g.
 *    with scripts/asr_word_timings.py (vosk) or any STT with word timestamps.
 * 2. Run: pnpm tsx scripts/build-sample-timings.ts <dir-with-asr-json>
 *
 * Keys are `${storyLabel}-${nodeId}` matching public/samples file names.
 */
import fs from 'fs';
import path from 'path';

import { bookData } from '../lib/data/sample-story';
import { mapAsrWordsToTokens, type AsrWord } from '../lib/utils/narration-sync';

const truthDir = process.argv[2];
if (!truthDir || !fs.existsSync(truthDir)) {
  console.error('usage: tsx scripts/build-sample-timings.ts <dir-with-asr-json>');
  process.exit(1);
}

// Bundled by the app; keys match public/samples/{storyLabel}-{nodeId}.mp3 names.
const OUT_PATH = path.join(process.cwd(), 'lib/data/sample-word-timings.json');

const output: Record<string, { word: string; start: number; end: number }[]> = {};
let built = 0;

for (const story of bookData) {
  for (const chapter of story.chapters) {
    for (const [nodeId, node] of Object.entries(chapter.content.nodes)) {
      const key = `${story.label}-${nodeId}`;
      const truthPath = path.join(truthDir, `${key}.json`);
      // ASR is run per MP3; nodes without a matching JSON were not transcribed yet.
      if (!fs.existsSync(truthPath)) continue;

      const truth: { duration: number; words: AsrWord[] } = JSON.parse(
        fs.readFileSync(truthPath, 'utf8'),
      );
      // Align ASR tokens to the canonical narration text (handles hyphenation drift).
      const timings = mapAsrWordsToTokens(node.text, truth.words, truth.duration);
      // Three decimal places match player timing resolution and YAML metadata.
      output[key] = timings.map(({ word, start, end }) => ({
        word,
        start: Number(start.toFixed(3)),
        end: Number(end.toFixed(3)),
      }));
      built++;
    }
  }
}

fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 1));
console.log(`Wrote ${built} node timings to ${OUT_PATH}`);
