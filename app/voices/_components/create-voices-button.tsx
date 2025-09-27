import { Button } from "@kit/ui/shadcn/button";
import { TrackableFile } from "@kit/ui/lib/interfaces";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import DialogLayout from '@kit/ui/custom/layouts/dialog-layout';
import TooltipComponent from '@kit/ui/custom/tooltip-component';
import { VoiceFileForm } from "./voice-file-form";
import { VOICE_MAX_DURATION } from "~/lib/constants";

const STATUS_DURATION = 2000; // 2 seconds to show success state

export function CreateVoicesButton({ open, setOpen }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }){

  const { t, ready } = useTranslation('custom');
  const [files, setFiles] = useState<TrackableFile[]>([]);

  const handleFinishSubmit = (success: boolean) => {
    if (success) {
      // Wait for STATUS_DURATION before closing and resetting
      setTimeout(() => {
        setFiles([]);
        setOpen(false);
      }, STATUS_DURATION);
    }
  };

  if (process.env.NODE_ENV === 'development' && !ready) return null;

  return (
    <DialogLayout
      externalOpen={open}
      externalSetOpen={setOpen}
      trigger={ () => 
        <TooltipComponent 
          trigger={
            <Button variant="foreground" size="default" onClick={() => {
              setOpen(true)
            }} className="text-base" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
              <div className="flex flex-row items-center gap-x-1">
                <Plus className="size-4"/>
                {t('voices.new')}
              </div>
            </Button>
          } 
          content={t('voices.create')} 
        />
      }
      reset={() => {

        console.log('reset');
        setFiles([])
      }}
      title={t('voices.create')}
      description={t('voices.createDescription')}
      contentClassName="max-w-[90vw] md:max-w-[600px] max-h-[90vh]"
    >
      <div className="flex flex-col h-full gap-4">
        <VoiceFileForm
          files={files}
          setFiles={setFiles}
          onFinishSubmit={handleFinishSubmit}
          maxDuration={VOICE_MAX_DURATION}
        />
      </div>
    </DialogLayout>
  )
}