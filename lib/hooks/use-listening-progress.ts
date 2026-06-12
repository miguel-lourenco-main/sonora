'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  PROGRESS_STORAGE_KEY,
  SEED_PROGRESS,
  type ListeningProgress,
} from '~/lib/data/mock-engagement';

function readStorage(): ListeningProgress[] {
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(SEED_PROGRESS));
      return SEED_PROGRESS;
    }
    return JSON.parse(raw) as ListeningProgress[];
  } catch {
    return SEED_PROGRESS;
  }
}

function writeStorage(entries: ListeningProgress[]) {
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // storage unavailable (private mode) — progress just won't persist
  }
}

/**
 * Listening progress over localStorage. `mounted` stays false during SSG
 * hydration — render skeletons until it flips to avoid hydration mismatch.
 */
export function useListeningProgress() {
  const [entries, setEntries] = useState<ListeningProgress[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEntries(readStorage());
    setMounted(true);
  }, []);

  const recordProgress = useCallback(
    (progress: Omit<ListeningProgress, 'updatedAt'>) => {
      setEntries((prev) => {
        const next = [
          { ...progress, updatedAt: Date.now() },
          ...prev.filter((entry) => entry.storyId !== progress.storyId),
        ];
        writeStorage(next);
        return next;
      });
    },
    [],
  );

  const clear = useCallback(() => {
    setEntries([]);
    writeStorage([]);
  }, []);

  return { entries, mounted, recordProgress, clear };
}
