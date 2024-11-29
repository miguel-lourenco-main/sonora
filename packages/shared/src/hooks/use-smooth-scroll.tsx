'use client';

import { createContext, useContext, useRef } from 'react';

interface SmoothScrollContextType {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  smoothScrollTo: (targetY: number) => void;
}

export const SmoothScrollContext = createContext<SmoothScrollContextType | undefined>(undefined);

export function SmoothScrollProvider({ children }: { children: React.ReactNode, threshold?: number }) {
  const anchorRef = useRef<HTMLDivElement>(null);

  const smoothScrollTo = (targetY: number) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 1000; // ms
    let start: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      
      const easeInOutCubic = (t: number) => 
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

      window.scrollTo(0, startY + distance * easeInOutCubic(percentage));

      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }

  return (
    <SmoothScrollContext.Provider value={{ anchorRef, smoothScrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext);
  if (context === undefined) {
    throw new Error('useSmoothScroll must be used within a SmoothScrollProvider');
  }
  return context;
}