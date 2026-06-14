'use client';

/**
 * A tiny shared channel between the "Hear a whisper" audio feature and the
 * Three.js hero scene. The whisper hook pushes a normalised audio level here;
 * the scene's render loop reads it to make the aurora and motes breathe with
 * the real narration — decoupling the React audio code from the imperative scene.
 */
let level = 0;

export const heroAudioBus = {
  set(value: number) {
    level = value;
  },
  get() {
    return level;
  },
};
