"use client"

import { Mic, MicOff} from "lucide-react"
import { Button } from "@kit/ui/shadcn/button"
import { cn } from "@kit/ui/lib"

interface VoiceControlProps {
  isListening: boolean;
  hasPermission: boolean | null;
  onRequestPermission: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export function VoiceControl({
  isListening,
  hasPermission,
  onRequestPermission,
  onStartRecording,
  onStopRecording,
}: VoiceControlProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {hasPermission === false ? (
        <Button onClick={onRequestPermission} variant="outline">
          Enable Voice Control
        </Button>
      ) : (
        <>
          <Button
            onClick={isListening ? onStopRecording : onStartRecording}
            variant="outline"
            className={cn(
              "relative flex items-center gap-2",
              isListening && "text-primary border-primary",
            )}
          >
            {isListening && (
              <span className="absolute -top-2 -right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            )}
            {isListening ? (
              <>
                <MicOff className="h-4 w-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                Start Recording
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
} 