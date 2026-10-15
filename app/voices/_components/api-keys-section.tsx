'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@kit/ui/shadcn/button'
import { Input } from '@kit/ui/shadcn/input'
import { Label } from '@kit/ui/shadcn/label'
import { getElevenLabsApiKey, setElevenLabsApiKey, clearElevenLabsApiKey, clearCachedVoices } from '~/lib/local/storage'
import { testConnection } from '~/lib/client/elevenlabs'
import { toast } from 'sonner'
import { Key, Save, Eye, EyeOff, Cloud, PlugZap, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@kit/ui/lib'

type ConnectionStatus =
  | { state: 'idle' }
  | { state: 'testing' }
  | { state: 'success' }
  | { state: 'error'; message: string }

interface ApiKeysSectionProps {
  onRefetchVoices?: () => Promise<void>;
}

export function ApiKeysSection({ onRefetchVoices }: ApiKeysSectionProps) {
  const [key, setKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [connected, setConnected] = useState(false)
  const [status, setStatus] = useState<ConnectionStatus>({ state: 'idle' })

  useEffect(() => {
    const existing = getElevenLabsApiKey()
    if (existing) {
      setKey(existing)
      setConnected(true)
    }
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
    setStatus({ state: 'idle' });
    
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
    setConnected(false)
    setStatus({ state: 'idle' })
    toast.success('API key and cached voices cleared from storage')
    if (onRefetchVoices) {
      try {
        await onRefetchVoices()
      } catch (e) {
        console.error(e)
      }
    }
  }

  async function runConnectionTest(value: string) {
    setStatus({ state: 'testing' })
    const result = await testConnection(value)
    setStatus(result.ok ? { state: 'success' } : { state: 'error', message: result.message })
    return result
  }

  async function testKey() {
    if (!key.trim()) {
      setStatus({ state: 'error', message: 'Enter an API key to test.' })
      return
    }
    await runConnectionTest(key)
  }

  async function saveKey() {
    if (!key.trim()) {
      toast.error('Please enter an API key to save')
      return
    }

    setIsValidating(true)
    try {
      // Saving always runs the connection test, so the user gets the same inline feedback.
      const result = await runConnectionTest(key)
      if (!result.ok && result.status !== undefined) {
        toast.error('Key not saved: the connection test failed')
        return
      }
      // No HTTP status means the request never reached ElevenLabs (network/CORS); keep the
      // previous behaviour of saving anyway so the user can still try fetching voices.
      setElevenLabsApiKey(key.trim())
      toast.success(result.ok ? 'API key saved' : 'Saved key (could not verify the connection)')
      setConnected(true)
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
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <Key className="size-6 text-tertiary" />
            <h2 className="font-headline-md text-headline-md text-primary">API Settings</h2>
            {connected && (
              <span className="magical-glow inline-flex items-center gap-2 rounded-full bg-primary-container/30 px-3 py-1 font-label-lg text-xs font-bold text-primary">
                <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
                Connected
              </span>
            )}
          </div>
          <p className="mb-6 max-w-xl font-body-md text-body-md text-on-surface-variant">
            Connect your ElevenLabs account to enable high-quality AI narration for your stories.
          </p>
          <div className="max-w-xl space-y-2">
            <Label htmlFor="el-key" className="ml-1 font-label-lg text-label-lg text-on-surface">
              ElevenLabs API Key
            </Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
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
              <Button
                type="button"
                variant="outline"
                onClick={testKey}
                disabled={status.state === 'testing' || isValidating}
                className="h-12 shrink-0 gap-2 rounded-xl border-outline-variant bg-surface-container-high font-bold text-on-surface-variant hover:bg-surface-container-highest"
              >
                {status.state === 'testing' ? (
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                ) : (
                  <PlugZap className="size-5" aria-hidden="true" />
                )}
                {status.state === 'testing' ? 'Testing...' : 'Test connection'}
              </Button>
            </div>
            <p role="status" aria-live="polite" className="ml-1 min-h-5 font-body-md text-sm">
              {status.state === 'success' && (
                <span className="inline-flex items-center gap-1.5 text-primary">
                  <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
                  Connected to ElevenLabs
                </span>
              )}
              {status.state === 'error' && (
                <span className="inline-flex items-start gap-1.5 text-error">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {status.message}
                </span>
              )}
            </p>
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
