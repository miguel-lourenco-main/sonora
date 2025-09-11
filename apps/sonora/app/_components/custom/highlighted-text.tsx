"use client"

import { useEffect, useRef } from "react"
import { WordTiming } from "~/lib/types"
import { cn } from "@kit/ui/lib"

interface HighlightedTextProps {
  text: string;
  currentTime: number;
  wordTimings?: WordTiming[];
  isPlaying: boolean;
}

export function HighlightedText({
  text,
  currentTime,
  wordTimings,
  isPlaying,
}: HighlightedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!wordTimings?.length || !containerRef.current) return;

    // Find the currently highlighted word with a small look-ahead offset
    const currentWord = wordTimings.find(
      timing => currentTime >= timing.start && currentTime <= timing.end
    );

    if (currentWord) {
      const wordIndex = wordTimings.indexOf(currentWord);
      const wordElement = wordsRef.current[wordIndex];
      
      if (wordElement && containerRef.current) {
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        const wordRect = wordElement.getBoundingClientRect();
        
        const containerTop = containerRect.top;
        const containerHeight = containerRect.height;
        const wordTop = wordRect.top - containerTop;
        
        const currentScrollTop = container.scrollTop;
        const maxScroll = container.scrollHeight - containerHeight;
        
        // Position words at 1/4 of the container height
        const targetPosition = containerHeight * 0.25;
        
        const newScrollTop = Math.max(0, Math.min(maxScroll, currentScrollTop + (wordTop - targetPosition)));

        // Only scroll if the word position is significantly different from target
        if (Math.abs(wordTop - targetPosition) > 20) {
          container.scrollTo({
            top: newScrollTop,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [currentTime, wordTimings]);

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      {text.split(' ').map((word, index) => {
        const timing = wordTimings?.[index];
        
        // Only highlight if audio is actually playing and we've reached the word's timing
        const isCurrentlyNarrated = isPlaying && timing && 
          currentTime >= timing.start && // Start highlighting as soon as we reach the start time
          currentTime <= timing.end + 0.15; // Keep highlighting slightly after the end time
        
        // A word has been narrated if we've passed its start time
        const hasBeenNarrated = timing && currentTime > timing.start;
        
        // Don't highlight anything if audio hasn't started playing
        const isHighlighted = currentTime > 0 && (hasBeenNarrated ?? isCurrentlyNarrated);
        
        return (
          <span
            key={`${word}-${index}`}
            ref={(el) => { wordsRef.current[index] = el; }}
            className={cn(
              "transition-colors duration-50", // Even faster transition
              isHighlighted ? "text-primary font-medium" : "text-muted-foreground"
            )}
          >
            {word}{' '}
          </span>
        );
      })}
    </div>
  );
}