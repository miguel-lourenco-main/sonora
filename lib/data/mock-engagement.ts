/**
 * Presentational engagement data — seeds the "Continue listening" rail so the
 * home page demonstrates the feature before any real playback has happened.
 */

export const FEATURED_STORY_ID = '1';

export interface ListeningProgress {
  storyId: string;
  nodeId: string;
  /** 0–100 */
  percent: number;
  chapterLabel: string;
  updatedAt: number;
}

export const PROGRESS_STORAGE_KEY = 'sonora.progress.v1';

export const SEED_PROGRESS: ListeningProgress[] = [
  {
    storyId: '2',
    nodeId: 'mountain_base',
    percent: 35,
    chapterLabel: 'Chapter 1 of 5',
    updatedAt: 1749600000000,
  },
  {
    storyId: '4',
    nodeId: 'start',
    percent: 12,
    chapterLabel: 'Chapter 1 of 5',
    updatedAt: 1749500000000,
  },
];
