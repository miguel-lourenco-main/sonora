import { createContext } from "react";

interface SmoothScrollContextType {
    anchorRef: React.RefObject<HTMLDivElement>;
    isNearAnchor: boolean;
    isLocked: boolean;
  }
  
export const SmoothScrollContext = createContext<SmoothScrollContextType | null>(null);