'use client'

import { AlertTriangle, Settings, ExternalLink } from 'lucide-react'
import { Button } from '@kit/ui/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/shadcn/card'
import Link from 'next/link'

export function AudioUnavailableWarning() {
  return (
    <div className="flex items-center justify-center p-6" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-normal leading-relaxed">Audio Not Available</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-muted-foreground tracking-wide leading-relaxed">
              What you can do:
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-4 rounded-lg border bg-muted/50">
                <div className="flex-1">
                  <p className="font-semibold text-base leading-relaxed">Add an ElevenLabs API Key</p>
                  <p className="text-base text-muted-foreground mt-2 leading-relaxed">
                    Generate high-quality audio on-demand for any story
                  </p>
                  <Link href="/voices">
                    <Button variant="outline" size="sm" className="mt-3">
                      <Settings className="h-4 w-4 mr-2" />
                      Go to Voices Settings
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="w-full text-center text-lg text-muted-foreground uppercase tracking-wide leading-relaxed">
                or
              </div>
              
              <div className="flex items-start space-x-3 p-4 rounded-lg border bg-muted/50">
                <div className="flex-1">
                  <p className="font-semibold text-lg leading-relaxed">Try a Story with Pre-recorded Audio</p>
                  <p className="text-base text-muted-foreground mt-2 leading-relaxed">
                    Some stories have pre-recorded narration available
                  </p>
                  <Link href="/">
                    <Button variant="outline" size="sm" className="mt-3">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Browse Available Stories
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
