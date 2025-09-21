"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, Volume2, Clock5, VolumeOff } from 'lucide-react'
import { hasPreRecordedAudio } from '~/lib/utils/audio-availability'
import { cn } from "@kit/ui/lib"
import { Story } from "~/lib/types"
import { CardBody, CardContainer, CardItem } from "@/components/3d-card"
import { useEffect, useState } from "react"
import TooltipComponent from "@/components/ui/custom/tooltip-component"

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
  // Simple heuristic: ~30s per step, round up to next minute
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

  const [imageWidth, setImageWidth] = useState(400)
  const [imageHeight, setImageHeight] = useState(400)

  useEffect(() => {
    function updateImageSize() {
      if (typeof window === "undefined") return
      const viewportWidth = window.innerWidth
      // Scale image relative to device width with bounds
      const target = Math.min(400, Math.max(220, Math.floor(viewportWidth * 0.6)))
      setImageWidth(target)
      setImageHeight(target)
    }

    updateImageSize()
    window.addEventListener('resize', updateImageSize)
    return () => window.removeEventListener('resize', updateImageSize)
  }, [])

  return (
    <div className={cn("size-full", className)} {...props}>
      <Link href={`/player/${story.id}`} className="size-full">
        <CardContainer containerClassName="size-full" className="size-full">
          <CardBody className="grid grid-cols-1 place-items-center size-full max-w-[32rem] space-y-4 rounded-2xl py-6 bg-muted shadow-lg">
            <CardItem translateZ={150} className="size-full">
              <AudiobookCardContent story={story} />
            </CardItem>
            <div className="flex flex-col space-y-4 px-12 pt-4">
              <CardItem translateZ={40}>
                <p className="text-xl text-muted-foreground line-clamp-3">{description}</p>
              </CardItem>
              <CardItem translateZ={20} className="flex items-center w-full justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>{steps} steps</span>
                  <span className="inline-flex items-center gap-1"><Clock5 className="h-3 w-3" /> {minutes} min</span>
                </div>
                {hasPreRecorded ? (
                  <TooltipComponent
                    trigger={
                      <div className="inline-flex items-center gap-1 text-green-600">
                        <Volume2 className="size-8" />
                      </div>
                    }
                    content="Pre-recorded audio available"
                    className="bg-green-600 text-white text-xl"
                  />
                ) : (
                  <TooltipComponent
                    trigger={
                      <div className="inline-flex items-center gap-1 text-slate-600">
                        <VolumeOff className="size-8" />
                      </div>
                    }
                    content="Pre-recorded audio NOT available"
                    className="bg-slate-600 text-white text-xl"
                  />
                )}
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      </Link>
    </div>
  )
}

function AudiobookCardContent({ story }: { story: Story }) {
  return (
    <div className="relative size-full min-h-[32rem]">
      <img src="/images/book_cover.png" alt={story.title} className="absolute top-[2rem] left-[4rem] z-10 w-[22rem] m-4 rounded-lg object-cover" />
      <img src={story.coverUrl} alt={story.title} className="absolute top-[3.5rem] left-[10.5rem] z-20 w-[13rem] m-4 rounded-lg object-cover" />
    </div>
  )
}