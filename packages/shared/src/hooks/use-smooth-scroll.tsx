import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface SmoothScrollContextType {
  anchorRef: React.RefObject<HTMLDivElement>;
  isNearAnchor: boolean;
  isLocked: boolean;
  setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SmoothScrollContext = createContext<SmoothScrollContextType | undefined>(undefined);

export function SmoothScrollProvider({ children, threshold = 100 }: { children: React.ReactNode, threshold?: number }) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [isNearAnchor, setIsNearAnchor] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    if (anchorRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const anchorCenter = anchorRect.top + anchorRect.height / 2;
      const targetPosition = viewportHeight / 2;
      const offset = anchorCenter - targetPosition;
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      if (Math.abs(offset) < threshold) {
        if (!isLocked) {
          window.scrollTo({
            top: currentScrollY + offset,
            behavior: 'smooth'
          });
          setIsLocked(true);
          setIsNearAnchor(true);
        }
      } else if (isLocked) {
        if (Math.abs(scrollDelta) > 5) {
          const resistance = 0.3;
          const newScrollY = currentScrollY - (scrollDelta * resistance);
          window.scrollTo(0, newScrollY);
          setIsLocked(false);
        }
      } else {
        setIsNearAnchor(false);
      }

      lastScrollY.current = window.scrollY;
    }
  }, [threshold, isLocked]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <SmoothScrollContext.Provider value={{ anchorRef, isNearAnchor, isLocked, setIsLocked }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext);
  if (context === undefined) {
    //throw new Error('useSmoothScroll must be used within a SmoothScrollProvider');
    return null
  }
  return context;
}