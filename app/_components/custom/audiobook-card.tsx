"use client"

// Catalog tile: cover, step count, and link into the static `/player/[id]` route.

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock5, Footprints } from 'lucide-react'
import { hasPreRecordedAudio } from '~/lib/utils/audio-availability'
import { cn } from "@kit/ui/lib"
import { Story } from "~/lib/types"
import { SonoraBadge, SonoraCard } from "@/components/sonora"

interface StoryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  story: Story
}

function countStorySteps(story: Story): number {
  try {
    return story.chapters.reduce((total, chapter) => {
      const nodes = chapter.content?.nodes ?? {}
      return total + Object.keys(nodes).length
    }, 0)
  } catch {
    return 0
  }
}

function estimateMinutesFromSteps(stepCount: number): number {
  const minutes = Math.ceil((stepCount * 30) / 60)
  return Math.max(minutes, 1)
}

function getStoryDescription(story: Story, maxLen = 100): string {
  try {
    const chapter = story.chapters[0]
    const initialId = chapter?.content.initialNodeId
    const initialNode = chapter?.content.nodes[initialId ?? '']
    const text = initialNode?.text ?? ""
    if (text.length <= maxLen) return text
    return text.slice(0, maxLen).trimEnd() + "…"
  } catch {
    return "Interactive story"
  }
}

export function AudiobookCard({ story, className, ...props }: StoryCardProps) {
  const hasPreRecorded = hasPreRecordedAudio(story.label)
  const steps = countStorySteps(story)
  const minutes = estimateMinutesFromSteps(steps)
  const description = getStoryDescription(story)

  return (
    <div className={cn("size-full", className)} {...props}>
      <Link href={`/player/${story.id}`} className="group block size-full">
        <SonoraCard className="cursor-pointer">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl border-[8px] border-surface-container-high shadow-inner book-texture">
            <div className="absolute inset-y-0 left-0 z-10 w-8 book-spine" />
            <Image
              src={story.coverUrl}
              alt={story.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute right-4 top-4 z-20">
              <SonoraBadge variant={hasPreRecorded ? 'pre-recorded' : 'ai-live'} />
            </div>
          </div>
          <div className="flex flex-col flex-1 justify-between mt-6 space-y-3">
            <h3 className="font-headline-md text-headline-md text-primary">{story.title}</h3>
            <p className="line-clamp-2 font-body-md text-body-md italic text-on-surface-variant">
              {description}
            </p>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4 font-label-lg text-label-lg text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <Footprints className="size-[18px]" />
                  {steps} steps
                </span>
                <span className="flex items-center gap-1">
                  <Clock5 className="size-[18px]" />
                  {minutes} min
                </span>
              </div>
              <ArrowRight className="size-5 text-primary transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </SonoraCard>
      </Link>
    </div>
  )
}
