import { useReducer, useCallback } from 'react'
import { createVoice as createVoiceApi } from "../client/elevenlabs";
import { Tables } from "~/lib/database.types";

export type Voice = Tables<'voice'> & {
  audioUrl?: string
}

type VoiceState = {
  voices: Voice[]
}

type VoiceAction =
  | { type: 'ADD_VOICE'; payload: Voice }
  | { type: 'DELETE_VOICE'; payload: string }
  | { type: 'RENAME_VOICE'; payload: { id: string; name: string } }

const voiceReducer = (state: VoiceState, action: VoiceAction): VoiceState => {
  switch (action.type) {
    case 'ADD_VOICE':
      return { ...state, voices: [...state.voices, action.payload] }
    case 'DELETE_VOICE':
      return { ...state, voices: state.voices.filter(voice => voice.id !== action.payload) }
    case 'RENAME_VOICE':
      return {
        ...state,
        voices: state.voices.map(voice =>
          voice.id === action.payload.id ? { ...voice, name: action.payload.name } : voice
        )
      }
    default:
      return state
  }
}

class ApiError extends Error {
  response?: Response;
  constructor(message: string, response?: Response) {
    super(message);
    this.response = response;
  }
}

export const useVoiceManager = (initialVoices: Voice[] = []) => {
  const [state, dispatch] = useReducer(voiceReducer, { voices: initialVoices })

  const addVoice = useCallback((voice: Voice) => {
    dispatch({ type: 'ADD_VOICE', payload: voice })
  }, [])

  const deleteVoice = useCallback((id: string) => {
    dispatch({ type: 'DELETE_VOICE', payload: id });
  }, []);

  const renameVoice = useCallback((id: string, name: string) => {
    dispatch({ type: 'RENAME_VOICE', payload: { id, name } });
  }, []);

  const createVoice = useCallback(async ({ 
    name, 
    description, 
    files 
  }: { 
    name: string; 
    description: string; 
    files: File[]; 
  }) => {
    console.log('Hook: createVoice started', { name, description, filesCount: files.length });
    try {
        await createVoiceApi({
            name,
            description,
            files
        });
        console.log('Hook: createVoice completed successfully');
    } catch (error) {
        console.log('Hook: Error caught:', error);
        
        // Parse error message from the string format
        let errorMessage = 'Failed to create voice';
        
        if (error instanceof Error) {
            try {
              const bodyRegex = /Body: ({[\s\S]*})/;
              const bodyMatch = bodyRegex.exec(error.message);
              
              if (bodyMatch?.[1]) {
                  const errorBody = JSON.parse(bodyMatch[1].trim()) as { detail: { message: string } };
                  errorMessage = errorBody.detail.message || error.message;
              }
            } catch (parseError) {
                console.error('Error parsing:', parseError);
                errorMessage = error.message;
            }
        }

        throw new ApiError(errorMessage, error instanceof Error ? (error as { response?: Response }).response : undefined);
    }
  }, []);

  return {
    voices: state.voices,
    addVoice,
    deleteVoice,
    renameVoice,
    createVoice
  }
}