'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@kit/ui/shadcn/button'
import { Input } from '@kit/ui/shadcn/input'
import { Label } from '@kit/ui/shadcn/label'
import { getElevenLabsApiKey, setElevenLabsApiKey, clearElevenLabsApiKey, clearCachedVoices } from '~/lib/local/storage'
import { validateApiKey } from '~/lib/client/elevenlabs'
import { toast } from 'sonner'
import { Key, Save, Eye, EyeOff, Cloud } from 'lucide-react'
import { cn } from '@kit/ui/lib'

interface ApiKeysSectionProps {
  onRefetchVoices?: () => Promise<void>;
}

export function ApiKeysSection({ onRefetchVoices }: ApiKeysSectionProps) {
  const [key, setKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    const existing = getElevenLabsApiKey()
    if (existing) setKey(existing)
  }, [])

  const debouncedRefetch = useCallback(() => {
    if (onRefetchVoices) {
      const timeoutId = setTimeout(() => {
        onRefetchVoices().catch(console.error);
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [onRefetchVoices]);

  const handleKeyChange = useCallback((newKey: string) => {
    setKey(newKey);
    
    if (newKey.trim().startsWith('xi-') && newKey.trim().length > 10) {
      debouncedRefetch();
    }
  }, [debouncedRefetch]);

  async function persistStorage() {
    if (typeof navigator?.storage?.persist === 'function') {
      try {
        const granted = await navigator.storage.persist()
        if (granted) toast.success('Storage persistence granted')
        else toast.error('Storage persistence denied')
      } catch {
        toast.error('Could not request persistent storage')
      }
    }
  }

  async function cleanApiKey() {
    clearElevenLabsApiKey()
    clearCachedVoices()
    setKey('')
    toast.success('API key and cached voices cleared from storage')
    if (onRefetchVoices) {
      try {
        await onRefetchVoices()
      } catch (e) {
        console.error(e)
      }
    }
  }

  async function saveKey() {
    if (!key.trim()) {
      toast.error('Please enter an API key to save')
      return
    }

    setIsValidating(true)
    try {
      const result = await validateApiKey(key)
      if (!result.ok) {
        if (result.cors) {
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
      
      if (onRefetchVoices) {
        onRefetchVoices().catch(console.error);
      }
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <section className="grain-overlay glass-card magical-shadow relative overflow-hidden rounded-3xl p-6 md:p-8">
      <div className="absolute -right-10 -top-10 size-40 rounded-full bg-tertiary-fixed/10 blur-3xl" />
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <Key className="size-6 text-tertiary" />
            <h2 className="font-headline-md text-headline-md text-primary">API Settings</h2>
          </div>
          <p className="mb-6 max-w-xl font-body-md text-body-md text-on-surface-variant">
            Connect your ElevenLabs account to enable high-quality AI narration for your stories.
          </p>
          <div className="max-w-xl space-y-2">
            <Label htmlFor="el-key" className="ml-1 font-label-lg text-label-lg text-on-surface">
              ElevenLabs API Key
            </Label>
            <div className="relative">
              <Input
                id="el-key"
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder="xi-..."
                className="h-12 rounded-xl border-none bg-surface-container px-4 font-body-md focus-visible:ring-2 focus-visible:ring-primary/20"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
                onClick={() => setShowKey((s) => !s)}
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 md:w-64">
          <Button
            onClick={saveKey}
            disabled={isValidating}
            className={cn(
              "h-12 gap-2 rounded-full bg-primary font-bold text-on-primary magical-glow hover:brightness-110",
            )}
          >
            <Save className="size-5" />
            {isValidating ? 'Validating...' : 'Save key'}
          </Button>
          <Button
            variant="outline"
            onClick={persistStorage}
            className="h-12 gap-2 rounded-full border-outline-variant bg-surface-container-high font-bold text-on-surface-variant hover:bg-surface-container-highest"
          >
            <Cloud className="size-5" />
            Request persistent storage
          </Button>
          <button
            type="button"
            onClick={cleanApiKey}
            disabled={!key.trim()}
            className="py-2 text-sm font-bold text-error transition-all hover:underline disabled:opacity-50"
          >
            Clear local key
          </button>
        </div>
      </div>
    </section>
  )
}
