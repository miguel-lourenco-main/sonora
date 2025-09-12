"use client"

import Image from "next/image"
import { Play, Volume2 } from 'lucide-react'
import Link from "next/link"
import { hasPreRecordedAudio } from '~/lib/utils/audio-availability'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@kit/ui/card"
import { Button } from "@kit/ui/button"
import { cn } from "@kit/ui/lib"

interface Audiobook {
  id: string
  title: string
  author: string
  coverUrl: string
  duration: string
  narrator: string
  category: string
  label: string
}

interface AudiobookCardProps extends React.HTMLAttributes<HTMLDivElement> {
  audiobook: Audiobook
  aspectRatio?: "portrait" | "square"
  width?: number
  height?: number
}

export function AudiobookCard({
  audiobook,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: AudiobookCardProps) {
  // Check if this story has pre-recorded audio
  const hasPreRecorded = hasPreRecordedAudio(audiobook.label);

  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <Link href={`/player/${audiobook.id}`}>
        <CardHeader className="border-b p-0">
          <div className="relative">
            <Image
              src={audiobook.coverUrl}
              alt={audiobook.title}
              width={width}
              height={height}
              className={cn(
                "object-cover transition-all hover:scale-105",
                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
              )}
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-4 right-4 h-10 w-10 rounded-full opacity-90 hover:opacity-100"
            >
              <Play className="h-5 w-5" />
            </Button>
            {hasPreRecorded && (
              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Volume2 className="h-3 w-3" />
                Audio Ready
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid gap-2.5 p-4">
          <h3 className="line-clamp-1 text-base font-semibold leading-none">
            {audiobook.title}
          </h3>
          <p className="line-clamp-1 text-xs text-muted-foreground">
            By {audiobook.author}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <p className="text-xs text-muted-foreground">
            Narrated by {audiobook.narrator}
          </p>
          <p className="text-xs font-medium whitespace-nowrap self-start">{audiobook.duration}</p>
        </CardFooter>
      </Link>
    </Card>
  )
}