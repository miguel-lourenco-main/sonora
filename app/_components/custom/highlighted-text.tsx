"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { WordTiming } from "~/lib/types"
import { cn } from "@kit/ui/lib"
import {
  getWordProgress,
  NarrationSyncMode,
  resolveActiveWordIndex,
  tokenizeNarrationText,
} from "~/lib/utils/narration-sync"

interface HighlightedTextProps {
  text: string;
  currentTime: number;
  audioDuration?: number;
  wordTimings?: WordTiming[];
  syncMode?: NarrationSyncMode;
  isPlaying: boolean;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
}

const SYNC_TICK_HZ = 30;

export function HighlightedText({
  text,
  currentTime,
  audioDuration = 0,
  wordTimings,
  syncMode = "estimated",
  isPlaying,
  audioRef,
}: HighlightedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [playbackTime, setPlaybackTime] = useState(currentTime);
  const [liveDuration, setLiveDuration] = useState(audioDuration);
  const lastSyncBucketRef = useRef(-1);

  const tokens = useMemo(() => tokenizeNarrationText(text), [text]);

  useEffect(() => {
    setLiveDuration(audioDuration);
  }, [audioDuration]);

  useEffect(() => {
    if (!isPlaying || !audioRef?.current) {
      setPlaybackTime(currentTime);
      lastSyncBucketRef.current = -1;
      return;
    }

    let frameId = 0;

    const tick = () => {
      const audio = audioRef.current;
      if (!audio) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      const time = audio.currentTime;
      if (audio.duration && Number.isFinite(audio.duration)) {
        setLiveDuration((prev) =>
          Math.abs(prev - audio.duration) > 0.01 ? audio.duration : prev,
        );
      }

      const bucket = Math.floor(time * SYNC_TICK_HZ);
      if (bucket !== lastSyncBucketRef.current) {
        lastSyncBucketRef.current = bucket;
        setPlaybackTime(time);
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, audioRef, currentTime]);

  const activeTime = isPlaying && audioRef?.current ? playbackTime : currentTime;
  const resolvedDuration =
    liveDuration > 0 ? liveDuration : audioDuration;

  const activeIndex = wordTimings?.length
    ? resolveActiveWordIndex(
        wordTimings,
        activeTime,
        resolvedDuration,
        syncMode,
      )
    : -1;

  useEffect(() => {
    if (!wordTimings?.length || !containerRef.current || activeIndex < 0) return;

    const wordElement = wordsRef.current[activeIndex];
    if (!wordElement || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const wordRect = wordElement.getBoundingClientRect();

    const containerTop = containerRect.top;
    const containerHeight = containerRect.height;
    const wordTop = wordRect.top - containerTop;

    const currentScrollTop = container.scrollTop;
    const maxScroll = container.scrollHeight - containerHeight;
    const targetPosition = containerHeight * 0.25;
    const newScrollTop = Math.max(
      0,
      Math.min(maxScroll, currentScrollTop + (wordTop - targetPosition)),
    );

    if (Math.abs(wordTop - targetPosition) > 20) {
      container.scrollTo({
        top: newScrollTop,
        behavior: "auto",
      });
    }
  }, [activeIndex, wordTimings]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto font-narration-text text-narration-text leading-relaxed md:text-narration-text-lg"
    >
      {tokens.map((word, index) => {
        const timing = wordTimings?.[index];
        const isActive = index === activeIndex && !!timing;
        const isRead = activeIndex >= 0 && index < activeIndex;

        const progress =
          isActive && timing
            ? syncMode === "estimated" && resolvedDuration > 0
              ? Math.min(
                  1,
                  Math.max(
                    0,
                    (activeTime - timing.start) /
                      Math.max(timing.end - timing.start, 0.001),
                  ),
                )
              : getWordProgress(timing, activeTime)
            : 0;

        return (
          <span
            key={`${word}-${index}`}
            ref={(el) => {
              wordsRef.current[index] = el;
            }}
            className={cn(
              "narration-word relative mr-[0.25em] inline-block align-baseline",
              isActive && "narration-word-active",
              isRead && "text-on-surface",
              !isRead && !isActive && activeTime > 0 && "text-on-surface-variant/80",
              !isRead && !isActive && activeTime === 0 && "text-on-surface-variant",
            )}
          >
            <span
              className={cn(
                "relative z-[1]",
                isActive && "font-semibold text-tertiary",
                isRead && !isActive && "font-medium text-on-surface",
              )}
            >
              {word}
            </span>
            {isActive && (
              <span className="narration-underline-track" aria-hidden>
                <span
                  className="narration-underline-fill"
                  style={{ width: `${progress * 100}%` }}
                />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
