'use client'

import { useState, useEffect } from 'react'
import { Story } from '~/lib/types'
import { StoryPlayer } from './book-player'
import { AudioUnavailableWarning } from './audio-unavailable-warning'
import { checkAudioAvailability, AudioAvailabilityResult } from '~/lib/utils/audio-availability'

interface AudioAvailabilityCheckerProps {
  story: Story
  initialVoiceId?: string
}

export function AudioAvailabilityChecker({ story, initialVoiceId }: AudioAvailabilityCheckerProps) {
  const [audioResult, setAudioResult] = useState<AudioAvailabilityResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAvailability() {
      try {
        const result = await checkAudioAvailability(story)
        setAudioResult(result)
      } catch (error) {
        console.error('Error checking audio availability:', error)
        setAudioResult({
          canPlay: false,
          hasPreRecorded: false,
          hasApiKey: false,
          reason: "Error checking audio availability",
          instructions: ["There was an error checking if audio is available for this story."]
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkAvailability()
  }, [story])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground text-3xl">Checking audio availability...</p>
        </div>
      </div>
    )
  }

  if (!audioResult?.canPlay) {
    return (
      <AudioUnavailableWarning 
        storyTitle={story.title}
        audioResult={audioResult!}
      />
    )
  }

  return (
    <StoryPlayer 
      story={story} 
      initialVoiceId={audioResult?.hasPreRecorded ? 'default' : initialVoiceId}
    />
  )
}
