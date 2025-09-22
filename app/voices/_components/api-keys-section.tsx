'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@kit/ui/shadcn/button'
import { Input } from '@kit/ui/shadcn/input'
import { Label } from '@kit/ui/shadcn/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@kit/ui/shadcn/card'
import { getElevenLabsApiKey, setElevenLabsApiKey, clearElevenLabsApiKey, clearCachedVoices } from '~/lib/local/storage'
import { validateApiKey } from '~/lib/client/elevenlabs'
import { toast } from 'sonner'

interface ApiKeysSectionProps {
  onRefetchVoices?: () => Promise<void>;
}

export function ApiKeysSection({ onRefetchVoices }: ApiKeysSectionProps) {
  const [key, setKey] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [isPersisted, setIsPersisted] = useState<boolean | null>(null)

  useEffect(() => {
    const existing = getElevenLabsApiKey()
    if (existing) setKey(existing)
  }, [])

  // Debounced refetch function
  const debouncedRefetch = useCallback(() => {
    if (onRefetchVoices) {
      const timeoutId = setTimeout(() => {
        onRefetchVoices().catch(console.error);
      }, 1000); // 1 second debounce
      
      return () => clearTimeout(timeoutId);
    }
  }, [onRefetchVoices]);

  // Handle key input changes with debounced refetch
  const handleKeyChange = useCallback((newKey: string) => {
    setKey(newKey);
    
    // If the key looks like a valid API key (starts with 'xi-'), trigger debounced refetch
    if (newKey.trim().startsWith('xi-') && newKey.trim().length > 10) {
      debouncedRefetch();
    }
  }, [debouncedRefetch]);

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

  async function cleanApiKey() {
    clearElevenLabsApiKey()
    clearCachedVoices()
    setKey('')
    toast.success('API key and cached voices cleared from storage')
    // Ensure voices table updates immediately after clearing
    if (onRefetchVoices) {
      try {
        await onRefetchVoices()
      } catch (e) {
        console.error(e)
      }
    }
  }

  async function saveKey() {
    // Do not transform into clear; require a non-empty key
    if (!key.trim()) {
      toast.error('Please enter an API key to save')
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
      
      // Trigger refetch after successful save
      if (onRefetchVoices) {
        onRefetchVoices().catch(console.error);
      }
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <Card style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <CardHeader>
        <CardTitle className="text-xl font-normal leading-relaxed">API Keys</CardTitle>
        <CardDescription className="text-base leading-relaxed">Store your ElevenLabs API key locally on this device.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="grid gap-2">
            <Label htmlFor="el-key" className="text-base font-medium leading-relaxed">ElevenLabs API key</Label>
            <Input id="el-key" type="password" value={key} onChange={(e) => handleKeyChange(e.target.value)} placeholder="xi-..." className="text-base" />
          </div>
          <div className="flex gap-2">
            <Button onClick={saveKey} disabled={isValidating} className="text-base">
              {isValidating ? 'Validating...' : 'Save key'}
            </Button>
            <Button variant="outline" onClick={cleanApiKey} disabled={!key.trim()} className="text-base">
              Clear key
            </Button>
            <Button variant="outline" onClick={persistStorage} className="text-base">Request persistent storage</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
