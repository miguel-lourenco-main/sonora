'use client'

import { useState, useEffect } from 'react'
import { Button } from '@kit/ui/button'
import { Input } from '@kit/ui/input'
import { Label } from '@kit/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@kit/ui/card'
import { getElevenLabsApiKey, setElevenLabsApiKey, clearElevenLabsApiKey, clearCachedVoices } from '~/lib/local/storage'
import { validateApiKey } from '~/lib/client/elevenlabs'
import { toast } from 'sonner'

export function ApiKeysSection() {
  const [key, setKey] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [isPersisted, setIsPersisted] = useState<boolean | null>(null)

  useEffect(() => {
    const existing = getElevenLabsApiKey()
    if (existing) setKey(existing)
  }, [])

  async function persistStorage() {
    if (typeof navigator?.storage?.persist === 'function') {
      try {
        const granted = await navigator.storage.persist()
        setIsPersisted(granted)
        if (granted) toast.success('Storage persistence granted')
        else toast.error('Storage persistence denied')
      } catch {
        setIsPersisted(false)
      }
    }
  }

  function cleanApiKey() {
    clearElevenLabsApiKey()
    clearCachedVoices()
    setKey('')
    toast.success('API key and cached voices cleared from storage')
  }

  async function saveKey() {
    // If the input is empty, clean the API key instead
    if (!key.trim()) {
      cleanApiKey()
      return
    }

    setIsValidating(true)
    try {
      const result = await validateApiKey(key)
      if (!result.ok) {
        if (result.cors) {
          // Allow saving despite CORS; user can proceed
          setElevenLabsApiKey(key.trim())
          toast.success('Saved key (could not verify due to CORS). Try fetching voices.')
        } else {
          toast.error(`Validation failed (${result.status ?? 'network error'})`)
          return
        }
      } else {
        setElevenLabsApiKey(key.trim())
        toast.success('API key saved')
      }
      await persistStorage()
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>Store your ElevenLabs API key locally on this device.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="grid gap-2">
            <Label htmlFor="el-key">ElevenLabs API key</Label>
            <Input id="el-key" type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="xi-..." />
          </div>
          <div className="flex gap-2">
            <Button onClick={saveKey} disabled={isValidating}>
              {isValidating ? 'Validating...' : key.trim() ? 'Save key' : 'Clear key'}
            </Button>
            <Button variant="outline" onClick={cleanApiKey} disabled={!key.trim()}>
              Clear key
            </Button>
            <Button variant="outline" onClick={persistStorage}>Request persistent storage</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
