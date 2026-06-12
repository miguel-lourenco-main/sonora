'use client';

import { useState } from 'react';
import { Check, Loader2, MoreVertical, Pencil, Trash, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@kit/ui/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@kit/ui/shadcn/dropdown-menu';
import { Input } from '@kit/ui/shadcn/input';
import { SonoraCard } from '@/components/sonora';

import type { Voice } from '~/lib/hooks/use-voice-manager';

import { PreviewAudio } from './preview-audio';

interface VoiceCardProps {
  voice: Voice;
  onDelete: (id: string) => Promise<void>;
  onRename: (id: string, name: string) => Promise<void>;
}

export function VoiceCard({ voice, onDelete, onRename }: VoiceCardProps) {
  const { t } = useTranslation('custom');
  const [editing, setEditing] = useState(false);
  const [editingName, setEditingName] = useState(voice.name);
  const [busy, setBusy] = useState(false);

  const createdAt = new Date(voice.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleRename = async () => {
    if (!editingName.trim()) return;
    setBusy(true);
    try {
      await onRename(voice.id, editingName.trim());
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await onDelete(voice.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SonoraCard hover={false} interactive className="rounded-[28px] p-5">
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <span
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-magic-purple/30 to-primary-container/40 font-display text-xl font-bold text-primary"
            aria-hidden="true"
          >
            {voice.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="h-9 rounded-xl"
                  aria-label={t('voices.table.name', 'Voice name')}
                  autoFocus
                />
                <Button
                  size="icon"
                  onClick={handleRename}
                  disabled={busy}
                  aria-label={t('voices.rename.button', 'Rename voice')}
                  className="size-9 shrink-0 rounded-full"
                >
                  {busy ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setEditing(false)}
                  aria-label={t('voices.rename.cancel', 'Cancel rename')}
                  className="size-9 shrink-0 rounded-full"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <>
                <h3 className="truncate font-headline-md text-lg font-semibold text-primary">
                  {voice.name}
                </h3>
                <p className="font-label-lg text-xs text-on-surface-variant">{createdAt}</p>
              </>
            )}
          </div>
          {!editing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={busy}
                  aria-label={t('voices.table.actions', 'Actions')}
                  className="size-11 shrink-0 rounded-full text-on-surface-variant"
                >
                  {busy ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <MoreVertical className="size-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl">
                <DropdownMenuItem
                  onClick={() => {
                    setEditingName(voice.name);
                    setEditing(true);
                  }}
                >
                  <Pencil className="mr-2 size-4" />
                  {t('voices.rename.button', 'Rename voice')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-error focus:text-error">
                  <Trash className="mr-2 size-4" />
                  {t('voices.delete.button', 'Delete voice')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <PreviewAudio voiceId={voice.voice_id} voiceName={voice.name} />
      </div>
    </SonoraCard>
  );
}
