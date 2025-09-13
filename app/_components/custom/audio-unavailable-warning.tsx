'use client'

import { AlertTriangle, Settings, ExternalLink } from 'lucide-react'
import { Button } from '@kit/ui/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/shadcn/card'
import { Alert, AlertDescription } from '@kit/ui/shadcn/alert'
import Link from 'next/link'
import { AudioAvailabilityResult } from '~/lib/utils/audio-availability'

interface AudioUnavailableWarningProps {
  storyTitle: string
  audioResult: AudioAvailabilityResult
}

export function AudioUnavailableWarning({ storyTitle, audioResult }: AudioUnavailableWarningProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-xl">Audio Not Available</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{storyTitle}</strong> cannot be played at the moment because no audio source is available.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              What you can do:
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 rounded-lg border bg-muted/50">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Add an ElevenLabs API Key</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Generate high-quality audio on-demand for any story
                  </p>
                  <Link href="/voices">
                    <Button variant="outline" size="sm" className="mt-2">
                      <Settings className="h-4 w-4 mr-2" />
                      Go to Voices Settings
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 rounded-lg border bg-muted/50">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-sm font-medium text-green-600">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Try a Story with Pre-recorded Audio</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Some stories have pre-recorded narration available
                  </p>
                  <Link href="/">
                    <Button variant="outline" size="sm" className="mt-2">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Browse Available Stories
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {audioResult.instructions && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Technical Details:
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {audioResult.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
