import { useState, useCallback, useRef, useEffect } from 'react';
import { Choice } from '../types';
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

// Basic local matching between transcript and available choices
function selectChoiceFromTranscript(transcript: string, choices: Choice[]): number | null {
  const cleaned = transcript.toLowerCase();
  let bestIndex: number | null = null;
  let bestScore = 0;

  choices.forEach((choice, index) => {
    const target = (choice.text || '').toLowerCase();
    if (!target) return;

    // Simple scoring: token overlap ratio + substring bonus
    const cleanedTokens = new Set(cleaned.split(/[^a-z0-9]+/).filter(Boolean));
    const targetTokens = new Set(target.split(/[^a-z0-9]+/).filter(Boolean));
    const intersection = [...targetTokens].filter(t => cleanedTokens.has(t)).length;
    const union = new Set([...targetTokens, ...cleanedTokens]).size || 1;
    let score = intersection / union;
    if (cleaned.includes(target)) score += 0.5; // substring bonus

    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  // Require a minimal confidence
  return bestScore >= 0.2 ? bestIndex : null;
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

  const recognitionRef = useRef<any>(null);

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
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.error('Speech recognition not supported in this browser.');
        setState(prev => ({ ...prev, error: 'Speech recognition not supported' }));
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript: string = event.results?.[0]?.[0]?.transcript ?? '';
        setState(prev => ({ ...prev, transcript }));

        const choiceIndex = selectChoiceFromTranscript(transcript, choices);
        if (choiceIndex !== null) {
          onChoiceMade(choiceIndex);
        } else {
          toast.error('Could not understand the choice. Please try again.');
          setState(prev => ({ ...prev, error: 'Could not understand the choice.' }));
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event?.error);
        toast.error('Speech recognition error');
        setState(prev => ({ ...prev, error: 'Speech recognition error' }));
      };

      recognition.onend = () => {
        setState(prev => ({ ...prev, isListening: false, isProcessing: false }));
      };

      recognitionRef.current = recognition;
      setState(prev => ({ ...prev, isListening: true, error: null }));
      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setState(prev => ({ 
        ...prev, 
        isListening: false,
        error: 'Failed to start speech recognition'
      }));
    }
  }, [state.hasPermission, requestPermission, onChoiceMade, choices]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
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