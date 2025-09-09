import { useState, useCallback, useRef, useEffect } from 'react';
import { Choice } from '../types';
import { processVoiceChoice } from '../actions';
import { toast } from 'sonner';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

interface UseSpeechRecognitionProps {
  choices?: Choice[];
  onChoiceMade: (choiceIndex: number) => void;
}

interface SpeechState {
  isListening: boolean;
  hasPermission: boolean | null;
  error: string | null;
  transcript: string | null;
  isProcessing: boolean;
}

// Define consistent audio settings
const AUDIO_SETTINGS = {
  sampleRate: 48000,
  channelCount: 1,
  bitsPerSample: 16,
  audioBitsPerSecond: 128000
} as const;

async function convertToWav(blob: Blob): Promise<Blob> {
  // Create AudioContext with specific sample rate
  const audioContext = new (window.AudioContext || window.webkitAudioContext)({
    sampleRate: AUDIO_SETTINGS.sampleRate
  });
  
  const arrayBuffer = await blob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  // Write WAV header
  const wavBuffer = new ArrayBuffer(44 + audioBuffer.length * 2);
  const view = new DataView(wavBuffer);
  
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + audioBuffer.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, AUDIO_SETTINGS.channelCount, true);
  view.setUint32(24, AUDIO_SETTINGS.sampleRate, true);
  view.setUint32(28, AUDIO_SETTINGS.sampleRate * AUDIO_SETTINGS.channelCount * (AUDIO_SETTINGS.bitsPerSample / 8), true);
  view.setUint16(32, AUDIO_SETTINGS.channelCount * (AUDIO_SETTINGS.bitsPerSample / 8), true);
  view.setUint16(34, AUDIO_SETTINGS.bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, audioBuffer.length * 2, true);

  // Write audio data
  const data = new Int16Array(wavBuffer, 44, audioBuffer.length);
  const channelData = audioBuffer.getChannelData(0);
  for (let i = 0; i < audioBuffer.length; i++) {
    data[i] = Math.max(-1, Math.min(1, channelData[i] ?? 0)) * 0x7FFF;
  }

  return new Blob([wavBuffer], { type: 'audio/wav' });
}

export function useSpeechRecognition({
  choices = [],
  onChoiceMade
}: UseSpeechRecognitionProps) {
  const [state, setState] = useState<SpeechState>({
    isListening: false,
    hasPermission: false,
    error: null,
    transcript: null,
    isProcessing: false
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setState(prev => ({ ...prev, hasPermission: true }));
    } catch (err) {
      console.error('Microphone permission denied:', err);
      setState(prev => ({ 
        ...prev, 
        hasPermission: false,
        error: 'Microphone permission denied'
      }));
      toast.error('Microphone permission denied');
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (!state.hasPermission) {
      await requestPermission();
      if (!state.hasPermission) return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: AUDIO_SETTINGS.channelCount,
          sampleRate: AUDIO_SETTINGS.sampleRate,
          sampleSize: AUDIO_SETTINGS.bitsPerSample,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false // Disable automatic gain control
        } 
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: AUDIO_SETTINGS.audioBitsPerSecond
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setState(prev => ({ ...prev, isProcessing: true }));
        
        try {
          const wavBlob = await convertToWav(audioBlob);
          const result = await processVoiceChoice(wavBlob, choices);
          
          if (result) {
            setState(prev => ({ ...prev, transcript: result.transcript }));
            onChoiceMade(result.choiceIndex);
          } else {
            setState(prev => ({ 
              ...prev, 
              error: 'Could not understand the choice. Please try again.' 
            }));
            toast.error('Could not understand the choice. Please try again.');
          }
        } catch (err) {
          console.error('Error processing voice choice:', err);
          setState(prev => ({ 
            ...prev, 
            error: 'Failed to process speech' 
          }));
        } finally {
          audioChunksRef.current = [];
          stream.getTracks().forEach(track => track.stop());
          setState(prev => ({ 
            ...prev, 
            isListening: false,
            isProcessing: false 
          }));
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setState(prev => ({ ...prev, isListening: true, error: null }));

    } catch (err) {
      console.error('Error starting recording:', err);
      setState(prev => ({ 
        ...prev, 
        isListening: false,
        error: 'Failed to start recording'
      }));
    }
  }, [state.hasPermission, requestPermission, onChoiceMade, choices]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // Check initial permission state
  const checkInitialPermission = useCallback(async () => {
    console.log('Checking initial permission')
    if (typeof window === 'undefined') return false;

    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      console.log('Permission result:', result)
      setState(prev => ({ ...prev, hasPermission: result.state === 'granted' }));
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      setState(prev => ({ ...prev, hasPermission: false }));
    }
  }, []);

  // Check permission on mount
  useEffect(() => {
    void checkInitialPermission();
  }, [checkInitialPermission]);

  return {
    isListening: state.isListening,
    hasPermission: state.hasPermission,
    error: state.error,
    transcript: state.transcript,
    isProcessing: state.isProcessing,
    requestPermission,
    startRecording,
    stopRecording
  };
} 