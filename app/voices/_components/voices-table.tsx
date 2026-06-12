'use client';

import { useCallback, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Voice } from '~/lib/hooks/use-voice-manager';
import { CreateVoicesButton } from './create-voices-button';
import { deleteVoice as deleteVoiceApi, renameVoice as renameVoiceApi } from '~/lib/client/elevenlabs';
import { toast } from 'sonner';
import { listVoices } from '~/lib/client/elevenlabs';
import { clearCachedVoices, setCachedVoices } from '~/lib/local/storage';
import { Button } from '@kit/ui/shadcn/button';
import { useVoices as useAutoVoices } from '~/lib/hooks/use-voices';
import { Mic2, RefreshCcw } from 'lucide-react';
import {
  EmptyState,
  SectionHeading,
  SonoraSkeleton,
  StaggerGroup,
  StaggerItem,
} from '@/components/sonora';
import { VoiceCard } from './voice-card';

interface VoicesTableProps {
  initialVoices: Voice[];
  onRefetchReady?: (refetch: () => Promise<void>) => void;
}

export default function VoicesTable({
  initialVoices,
  onRefetchReady,
}: VoicesTableProps) {
  const { t, ready } = useTranslation('custom');
  const [voices, setVoices] = useState<Voice[]>(initialVoices);
  const { voices: autoVoices, isLoading: isAutoLoading, refetch } = useAutoVoices();
  const [newFilesDialogOpen, setNewFilesDialogOpen] = useState(false);

  // No realtime subscription; updates occur via refresh or optimistic UI

  const handleDeleteVoice = useCallback(async (id: string) => {
    try {
      const voice = voices.find(voice => voice.id === id);
      if (!voice) throw new Error('Voice not found');
      await deleteVoiceApi(voice.voice_id);
      setVoices(prev => prev.filter(v => v.id !== id));
      toast.success(t('voices.delete.success'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('voices.delete.error');
      toast.error(errorMessage);
      console.error('Delete voice error:', error);
    }
  }, [t, voices]);

  const handleRenameVoice = useCallback(async (id: string, name: string) => {
    try {
      const voice = voices.find(voice => voice.id === id);
      await renameVoiceApi(voice?.voice_id ?? id, name);
      setVoices(prev => prev.map(v => (v.id === id ? { ...v, name } : v)));
      toast.success(t('voices.rename.success'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('voices.rename.error');
      toast.error(errorMessage);
      console.error('Rename voice error:', error);
    }
  }, [t, voices]);

  const handleRefresh = useCallback(async () => {
    try {
      clearCachedVoices();
      const apiVoices = await listVoices();
      const ui = apiVoices.map(v => ({
        id: v.voice_id,
        voice_id: v.voice_id,
        name: v.name,
        is_default: false,
        account_id: 'local',
        created_at: new Date((v.date_unix ?? Date.now()) * 1000).toISOString(),
      } as unknown as Voice));
      setVoices(ui);
      setCachedVoices(ui, 6 * 60 * 60 * 1000);
      toast.success(t('voices.refresh.success'));
    } catch (e) {
      toast.error(t('voices.refresh.error'));
    }
  }, [t]);

  // Expose refetch function to parent component
  useEffect(() => {
    if (refetch && onRefetchReady) {
      onRefetchReady(refetch);
    }
  }, [refetch, onRefetchReady]);

  // Sync voices with the hook - adopt fetched voices or clear when no API key
  useEffect(() => {
    if ((autoVoices?.length ?? 0) > 0) {
      // Adopt fetched voices
      setVoices(autoVoices as unknown as Voice[]);
    } else if (!isAutoLoading && (autoVoices?.length ?? 0) === 0) {
      // Clear voices when no API key (hook returns empty array and not loading)
      setVoices([]);
    }
  }, [autoVoices, isAutoLoading]);

  const sortedVoices = useMemo(
    () =>
      [...voices].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [voices],
  );

  // Empty state shown only when not loading and still empty
  const showEmptyState = !isAutoLoading && ((voices?.length ?? 0) === 0);

  if (!ready) return null;

  return (
    <section className="flex w-full flex-col gap-6">
      <SectionHeading
        title={t('voiceStudio.myNarrators', 'My narrators')}
        action={
          <div className="flex items-center gap-x-3">
            <CreateVoicesButton
              open={newFilesDialogOpen}
              setOpen={setNewFilesDialogOpen}
            />
            <Button
              variant="outline"
              size="default"
              className="flex h-fit min-h-tap-target-min gap-x-2 rounded-full border-outline-variant bg-secondary-container font-bold text-on-secondary-container"
              onClick={handleRefresh}
            >
              <RefreshCcw className="size-4" aria-hidden="true" />
              {t('voices.refresh.button')}
            </Button>
          </div>
        }
        className="mb-0 flex-wrap gap-y-4"
      />

      {isAutoLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <SonoraSkeleton key={i} className="h-36 rounded-[28px]" />
          ))}
        </div>
      ) : showEmptyState ? (
        <EmptyState
          icon={Mic2}
          title={t('voices.empty.title', 'No voices yet')}
          description={t(
            'voices.empty.description',
            'Add your ElevenLabs key in Settings and create or refresh voices.',
          )}
          action={
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="min-h-tap-target-min rounded-full bg-primary font-bold text-on-primary"
            >
              Go to API Keys
            </Button>
          }
        />
      ) : (
        <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedVoices.map((voice) => (
            <StaggerItem key={voice.id}>
              <VoiceCard
                voice={voice}
                onDelete={handleDeleteVoice}
                onRename={handleRenameVoice}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </section>
  );
}
