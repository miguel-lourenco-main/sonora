'use client'

import { useVoiceManager, Voice } from '~/lib/hooks/use-voice-manager'
import VoiceTable from './voices-table'
import { useTranslation } from 'react-i18next'

export default function VoicesPage({
    initialVoices,
}: {
    initialVoices: Voice[],
}) {
  const { t, ready } = useTranslation('custom')
  const { voices } = useVoiceManager(initialVoices)

  if (process.env.NODE_ENV === 'development' && !ready) return null;

  return (
    <div className="container py-6">
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold">{t('voices.myVoices')}</h1>
                <p className="text-muted-foreground">{t('voices.description')}</p>
            </div>
            <VoiceTable
                initialVoices={voices}
            />
        </div>
    </div>
  );
}
