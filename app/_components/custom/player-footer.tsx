"use client"

// Sticky playback bar: clip-local seek scrubber and play/pause/replay for the active story node.

import { useCallback, useRef, useState } from "react"
import { cn } from "@kit/ui/lib"
import { BookOpen, Pause, Play, RotateCcw } from "lucide-react"

interface PlayerFooterProps {
  isPlaying: boolean
  currentTime: number
  duration: number
  progressPercent: number
  chapterLabel: string
  disabled?: boolean
  seekDisabled?: boolean
  canReplay?: boolean
  onPlayPause: () => void
  onReplay?: () => void
  onSeek?: (time: number) => void
}

function formatTime(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function PlayerFooter({
  isPlaying,
  currentTime,
  duration,
  progressPercent,
  chapterLabel,
  disabled,
  seekDisabled,
  canReplay,
  onPlayPause,
  onReplay,
  onSeek,
}: PlayerFooterProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  // Ref tracks drag state for pointer handlers without forcing re-renders on every move
  const isDraggingRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const handleMainAction = canReplay && !isPlaying ? onReplay ?? onPlayPause : onPlayPause
  const canSeek = Boolean(onSeek) && !seekDisabled && duration > 0

  const seekFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track || !canSeek || !onSeek) return

      const rect = track.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      onSeek(ratio * duration)
    },
    [canSeek, duration, onSeek],
  )

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canSeek) return
    isDraggingRef.current = true
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
    seekFromClientX(event.clientX)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !canSeek) return
    seekFromClientX(event.clientX)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <footer className="sticky bottom-0 z-50 w-full border-t border-outline-variant/30 bg-surface-container-highest/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-container-margin-mobile py-6 md:px-container-margin-desktop">
        <div className="flex w-full items-center gap-4">
          <span className="min-w-[40px] font-label-lg text-label-lg text-on-surface-variant">
            {formatTime(currentTime)}
          </span>
          <div
            ref={trackRef}
            role="slider"
            aria-label="Playback position"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration)}
            aria-valuenow={Math.floor(currentTime)}
            aria-disabled={!canSeek}
            tabIndex={canSeek ? 0 : undefined}
            onKeyDown={(event) => {
              if (!canSeek || !onSeek) return
              const step = event.shiftKey ? 30 : 10
              if (event.key === "ArrowRight") {
                event.preventDefault()
                onSeek(Math.min(duration, currentTime + step))
              } else if (event.key === "ArrowLeft") {
                event.preventDefault()
                onSeek(Math.max(0, currentTime - step))
              }
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={cn(
              "relative h-3 flex-grow touch-none overflow-hidden rounded-full bg-surface-container-low",
              canSeek ? "cursor-pointer" : "cursor-default",
            )}
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 left-0 rounded-full bg-tertiary-fixed magical-glow",
                !isDragging && "transition-all duration-300",
              )}
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
          <span className="min-w-[40px] text-right font-label-lg text-label-lg text-on-surface-variant">
            {duration > 0 ? formatTime(duration) : "--:--"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            <span className="font-label-lg text-label-lg text-primary">{chapterLabel}</span>
          </div>
          <button
            type="button"
            disabled={disabled}
            onClick={handleMainAction}
            className={cn(
              "flex size-20 items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl transition-transform magical-glow-strong hover:scale-105 active:scale-95",
              disabled && "pointer-events-none opacity-50",
              isPlaying && "bg-tertiary",
            )}
            aria-label={isPlaying ? "Pause" : canReplay ? "Replay" : "Play"}
          >
            {isPlaying ? (
              <Pause className="size-10 fill-current" />
            ) : canReplay ? (
              <RotateCcw className="size-10" />
            ) : (
              <Play className="size-10 fill-current" />
            )}
          </button>
          <div className="w-24" />
        </div>
      </div>
    </footer>
  )
}
