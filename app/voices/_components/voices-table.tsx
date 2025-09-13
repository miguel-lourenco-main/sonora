'use client';

import { useCallback, useState, useEffect } from 'react';
import { CustomDataTable } from '@kit/ui/custom/custom-data-table';
import { useTranslation } from 'react-i18next';
import { Voice } from '~/lib/hooks/use-voice-manager';
import { useVoicesColumns } from './voices-columns';
import { CreateVoicesButton } from './create-voices-button';
import { deleteVoice as deleteVoiceApi, renameVoice as renameVoiceApi } from '~/lib/client/elevenlabs';
import { toast } from 'sonner';
import { listVoices } from '~/lib/client/elevenlabs';
import { clearCachedVoices, setCachedVoices } from '~/lib/local/storage';
import { Button } from '@kit/ui/shadcn/button';
import { useVoices as useAutoVoices } from '~/lib/hooks/use-voices';

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
      toast.success(t('voices.delete.success'));
    } catch (error) {
      toast.error(t('voices.delete.error'));
      console.error(error);
    }
  }, [t, voices]);

  const handleRenameVoice = useCallback(async (id: string, name: string) => {
    try {
      await renameVoiceApi(id, name);
      toast.success(t('voices.rename.success'));
    } catch (error) {
      toast.error(t('voices.rename.error'));
      console.error(error);
    }
  }, [t]);

  const createToolbarButtons = useCallback(() => {
    return (
      <div className="flex items-center gap-x-4">
        <CreateVoicesButton 
          open={newFilesDialogOpen} 
          setOpen={setNewFilesDialogOpen} 
        />
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
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
              toast.success(t('voices.refresh.success'))
            } catch (e) {
              toast.error(t('voices.refresh.error'))
            }
          }}
        >
          {t('voices.refresh.button')}
        </Button>
      </div>
    );
  }, [newFilesDialogOpen]);

  const columns = useVoicesColumns(handleDeleteVoice, handleRenameVoice, t);

  console.log(columns);
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

  // Empty state shown only when not loading and still empty
  const showEmptyState = !isAutoLoading && ((voices?.length ?? 0) === 0);

  if (process.env.NODE_ENV === 'development' && !ready) return null;

  return (
    <div className="flex flex-col gap-4 w-full mt-8 lg:mt-20">
      {showEmptyState && (
        <div className="flex items-center justify-between rounded-md border p-4">
          <div>
            <div className="font-medium">{t('voices.empty.title') ?? 'No voices yet'}</div>
            <div className="text-sm text-muted-foreground">{t('voices.empty.description') ?? 'Add your ElevenLabs key in Settings and create or refresh voices.'}</div>
          </div>
          <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Go to API Keys
          </Button>
        </div>
      )}
      <CustomDataTable
        data={voices}
        columns={columns}
        tableLabel={t('voices.lowercase')}
        filters={[]}
        createToolbarButtons={createToolbarButtons}
        identifier="name"
        initialSorting={[{ id: 'created_at', desc: true }]}
      />
    </div>
  );
}