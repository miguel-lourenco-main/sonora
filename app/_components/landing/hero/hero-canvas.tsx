'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

import { supportsWebGL } from '~/lib/landing/capabilities';
import { heroAudioBus } from '~/lib/landing/hero-audio-bus';
import { HeroScene } from '~/lib/landing/hero-scene';

/**
 * Mounts the Three.js hero scene behind the hero content. Loaded via
 * next/dynamic with ssr:false so `three` stays out of the initial bundle.
 * Renders nothing when WebGL is unavailable (the hero shows a CSS aurora instead).
 */
export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HeroScene | null>(null);
  const { resolvedTheme } = useTheme();
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!supportsWebGL()) {
      setSupported(false);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dark = document.documentElement.classList.contains('dark');
    let scene: HeroScene;
    try {
      scene = new HeroScene({ canvas, dark });
    } catch {
      setSupported(false);
      return;
    }
    scene.audioProvider = () => heroAudioBus.get();
    sceneRef.current = scene;
    scene.start();

    const onPointer = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      scene.setPointer(x, y);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setSupported(false);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    return () => {
      window.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setDark(resolvedTheme === 'dark');
  }, [resolvedTheme]);

  if (!supported) return null;

  return <canvas ref={canvasRef} className="absolute inset-0 size-full" aria-hidden="true" />;
}
