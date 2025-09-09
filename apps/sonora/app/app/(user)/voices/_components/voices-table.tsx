'use client';

import { useCallback, useState, useEffect } from 'react';
import { CustomDataTable } from '@kit/ui/custom-data-table';
import { useTranslation } from 'react-i18next';
import { Voice } from '~/lib/hooks/use-voice-manager';
import { useVoicesColumns } from './voices-columns';
import { CreateVoicesButton } from './create-voices-button';
import { deleteVoice, renameVoice } from '~/lib/actions';
import { getSupabaseBrowserClient } from '@kit/supabase/browser-client';
import { toast } from 'sonner';
import { Database } from '~/lib/database.types';
import { handleInsertOrUpdate, handleDelete } from '@kit/shared/utils';

interface VoicesTableProps {
  initialVoices: Voice[];
}

export default function VoicesTable({
  initialVoices,
}: VoicesTableProps) {
  const { t, ready } = useTranslation('custom');
  const [voices, setVoices] = useState<Voice[]>(initialVoices);
  const [newFilesDialogOpen, setNewFilesDialogOpen] = useState(false);

  // Setup realtime subscription
  useEffect(() => {
    const supabase = getSupabaseBrowserClient<Database>();

    const channel = supabase
      .channel('voices-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'voice' },
        (payload) => {
          console.log('Voice INSERT received:', payload.new);
          handleInsertOrUpdate({ setter: setVoices, newItem: payload.new as Voice })
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'voice' },
        (payload) => {
          console.log('Voice UPDATE received:', payload.new);
          handleInsertOrUpdate({ setter: setVoices, newItem: payload.new as Voice })
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'voice' },
        (payload) => {
          console.log('Voice DELETE received:', payload.old);
          handleDelete({ setter: setVoices, deletedItemId: payload.old.id})
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const handleDeleteVoice = useCallback(async (id: string) => {
    try {
      const voice = voices.find(voice => voice.id === id);
      if (!voice) throw new Error('Voice not found');
      await deleteVoice(voice.voice_id);
      toast.success(t('voices.delete.success'));
    } catch (error) {
      toast.error(t('voices.delete.error'));
      console.error(error);
    }
  }, [t, voices]);

  const handleRenameVoice = useCallback(async (id: string, name: string) => {
    try {
      await renameVoice(id, name);
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
      </div>
    );
  }, [newFilesDialogOpen]);

  const columns = useVoicesColumns(handleDeleteVoice, handleRenameVoice, t);

  if (process.env.NODE_ENV === 'development' && !ready) return null;

  return (
    <CustomDataTable
      data={voices}
      columns={columns}
      tableLabel={t('voices.lowercase')}
      filters={[]}
      createToolbarButtons={createToolbarButtons}
      identifier="name"
      initialSorting={[{ id: 'created_at', desc: true }]}
    />
  );
}