"use client"

import { cn } from "@kit/ui/lib"
import { BookOpen, Pause, Play, RotateCcw } from "lucide-react"

interface PlayerFooterProps {
  isPlaying: boolean
  currentTime: number
  progressPercent: number
  chapterLabel: string
  disabled?: boolean
  canReplay?: boolean
  onPlayPause: () => void
  onReplay?: () => void
}

function formatTime(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function PlayerFooter({
  isPlaying,
  currentTime,
  progressPercent,
  chapterLabel,
  disabled,
  canReplay,
  onPlayPause,
  onReplay,
}: PlayerFooterProps) {
  const handleMainAction = canReplay && !isPlaying ? onReplay ?? onPlayPause : onPlayPause

  return (
    <footer className="sticky bottom-0 z-50 w-full border-t border-outline-variant/30 bg-surface-container-highest/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-container-margin-mobile py-6 md:px-container-margin-desktop">
        <div className="flex w-full items-center gap-4">
          <span className="min-w-[40px] font-label-lg text-label-lg text-on-surface-variant">
            {formatTime(currentTime)}
          </span>
          <div className="relative h-3 flex-grow cursor-pointer overflow-hidden rounded-full bg-surface-container-low">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-tertiary-fixed magical-glow transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
          <span className="min-w-[40px] font-label-lg text-label-lg text-on-surface-variant">
            --:--
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
