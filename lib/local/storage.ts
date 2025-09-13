// Simple local storage utilities for API keys and cached voices

type CachedItem<T> = {
  value: T;
  // epoch millis when the item expires
  expiresAt: number;
};

const ELEVENLABS_KEY = 'sonora.elevenlabs.apiKey';
const VOICES_CACHE_KEY = 'sonora.voices.cache.v1';

export function getElevenLabsApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(ELEVENLABS_KEY);
  } catch {
    return null;
  }
}

export function setElevenLabsApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ELEVENLABS_KEY, key);
  } catch {
    // ignore
  }
}

export function clearElevenLabsApiKey(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ELEVENLABS_KEY);
  } catch {
    // ignore
  }
}

export function getCachedVoices<T>(): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(VOICES_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedItem<T>;
    if (!parsed || typeof parsed.expiresAt !== 'number') return null;
    if (Date.now() > parsed.expiresAt) {
      // expired
      localStorage.removeItem(VOICES_CACHE_KEY);
      return null;
    }
    return parsed.value;
  } catch {
    return null;
  }
}

export function setCachedVoices<T>(value: T, ttlMs: number): void {
  if (typeof window === 'undefined') return;
  try {
    const item: CachedItem<T> = { value, expiresAt: Date.now() + ttlMs };
    localStorage.setItem(VOICES_CACHE_KEY, JSON.stringify(item));
  } catch {
    // ignore
  }
}

export function clearCachedVoices(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(VOICES_CACHE_KEY);
  } catch {
    // ignore
  }
}


