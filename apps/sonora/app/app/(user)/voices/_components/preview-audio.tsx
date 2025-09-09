import { useState, useCallback } from 'react';
import { Button } from "@kit/ui/button";
import { Loader2, Play, Check, X } from "lucide-react";
import { cn } from "@kit/ui/lib";
import { previewVoice } from '~/lib/actions';

interface PreviewAudioProps {
    voiceId: string;
    voiceName: string;
}

type PreviewStatus = 'idle' | 'loading' | 'success' | 'error';

export function PreviewAudio({ voiceId, voiceName }: PreviewAudioProps) {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [status, setStatus] = useState<PreviewStatus>('idle');

    const loadPreview = useCallback(async () => {
        try {
            setStatus('loading');
            // Get base64 audio from server action
            const base64URL = await previewVoice(voiceId, `My name is ${voiceName}`);

            setAudioUrl(base64URL);
            setStatus('success');
            
            setTimeout(() => {
                setStatus('idle');
            }, 2000);
        } catch (error) {
            console.error('Preview error:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 2000);
        }
    }, [voiceId, voiceName]);

    return (
        <div className="relative">
            <audio 
                src={audioUrl ?? undefined} 
                controls 
                className={cn(
                    "h-8",
                    !audioUrl && "opacity-50"
                )} 
            />
            
            {!audioUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <Button
                        size="sm"
                        onClick={loadPreview}
                        disabled={status === 'loading'}
                        className={cn(
                            status === 'success' && "bg-green-600",
                            status === 'error' && "bg-red-600"
                        )}
                    >
                        {status === 'loading' && <Loader2 className="size-4 animate-spin" />}
                        {status === 'success' && <Check className="size-4" />}
                        {status === 'error' && <X className="size-4" />}
                        {status === 'idle' && <Play className="size-4" />}
                    </Button>
                </div>
            )}
        </div>
    );
} 