"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, Volume2, Clock5 } from 'lucide-react'
import { hasPreRecordedAudio } from '~/lib/utils/audio-availability'
import { cn } from "@kit/ui/lib"
import { Story } from "~/lib/types"
import { CardBody, CardContainer, CardItem } from "@/components/3d-card"

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

  return (
    <div className={cn("w-full", className)} {...props}>
      <Link href={`/player/${story.id}`}>
        <CardContainer containerClassName="" className="">
          <CardBody className="flex flex-col items-center size-fit space-y-4 rounded-2xl py-6 bg-gradient-to-b from-muted/30 to-background shadow-lg">
            <CardItem translateZ={60} className="py-6">
              <h3 className="text-2xl font-semibold line-clamp-2">{story.title}</h3>
            </CardItem>
            <CardItem translateZ={100}>
              <img src={story.coverUrl} alt={story.title} width={400} height={400} className="m-4 rounded-lg object-cover" />
            </CardItem>
            <div className="flex flex-col space-y-4 px-12 pt-4">
              <CardItem translateZ={40}>
                <p className="text-base text-muted-foreground line-clamp-3">{description}</p>
              </CardItem>
              <CardItem translateZ={20} className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{steps} steps</span>
                <span className="inline-flex items-center gap-1"><Clock5 className="h-3 w-3" /> {minutes} min</span>
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      </Link>
    </div>
  )
}