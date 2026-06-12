"use client"

import { useCallback, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
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
    <footer className="sticky bottom-0 z-50 w-full px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-2">
      <div className="glass-card mx-auto flex w-full max-w-[1100px] flex-col gap-4 rounded-[28px] px-5 py-5 shadow-2xl md:px-8">
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
                "pointer-events-none absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-tertiary-fixed-dim to-tertiary-fixed magical-glow",
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
          <motion.button
            type="button"
            disabled={disabled}
            onClick={handleMainAction}
            whileHover={disabled ? undefined : { scale: 1.05 }}
            whileTap={disabled ? undefined : { scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={cn(
              "glow-focus relative flex size-20 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl magical-glow-strong",
              disabled && "pointer-events-none opacity-50",
              isPlaying && "bg-tertiary",
            )}
            aria-label={isPlaying ? "Pause" : canReplay ? "Replay" : "Play"}
          >
            {isPlaying && (
              <motion.span
                className="absolute inset-0 rounded-full bg-tertiary-fixed/40"
                animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                aria-hidden="true"
              />
            )}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isPlaying ? "pause" : canReplay ? "replay" : "play"}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="relative flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause className="size-10 fill-current" />
                ) : canReplay ? (
                  <RotateCcw className="size-10" />
                ) : (
                  <Play className="size-10 fill-current" />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
          <div className="w-24" />
        </div>
      </div>
    </footer>
  )
}
