'use server'

import { ElevenLabsClient } from "elevenlabs";
import { Choice, ElevenLabsTextToSpeechResponse, Voice } from './types';
// import { Database } from "~/lib/database.types";
// import { getSupabaseServerClient } from "@kit/supabase/server-client";
import OpenAI from 'openai';

interface TranscriptionResponse {
  selected_answer: number;
  reasoning: string;
}

async function transcribeAudio(audioBlob: Blob): Promise<string | null> {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('model', 'whisper-1');
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('response_format', 'text');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        // Note: Don't set Content-Type header - it will be set automatically with boundary
      },
      body: formData
    });

    if (!response.ok) {
      console.error('Transcription error:', await response.text());
      throw new Error('Failed to transcribe audio');
    }

    console.log('Transcription response:', response);

    return await response.text();
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return null;
  }
}

async function analyzeTranscription(
  transcription: string,
  choices: Choice[]
): Promise<TranscriptionResponse | null> {
  try {
    const choicesText = choices
      .map((choice, index) => `${index + 1}. ${choice.text}`)
      .join('\n');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: `Based on the user's speech: "${transcription}", select which choice they are making.
            Available choices are:
            ${choicesText}
            
            Provide the answer in a structured JSON format with "selected_answer" (number 1-${choices.length}) and "reasoning" (string explaining why this choice was selected).`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze transcription');
    }

    const data = await response.json();
    console.log('Analysis result:', data);
    return JSON.parse(data.choices[0].message.content) as TranscriptionResponse;
  } catch (error) {
    console.error('Error analyzing transcription:', error);
    return null;
  }
}

export async function processVoiceChoice(
  audioBlob: Blob, 
  choices: Choice[]
): Promise<{ choiceIndex: number; transcript: string } | null> {
  try {
    // Step 1: Convert speech to text
    const transcription = await transcribeAudio(audioBlob);
    if (!transcription) {
      throw new Error('Failed to transcribe audio');
    }

    console.log('Transcription result:', transcription);

    // Step 2: Analyze transcription to determine choice
    const result = await analyzeTranscription(transcription, choices);
    if (!result) {
      throw new Error('Failed to analyze transcription');
    }

    return {
      choiceIndex: result.selected_answer - 1,
      transcript: transcription
    };
  } catch (error) {
    console.error('Error processing voice choice:', error);
    return null;
  }
}

async function validateElevenLabsKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/user', {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Error validating ElevenLabs API key:', error);
    return false;
  }
}

async function getElevenLabsClient() {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY is not set');
  }
  
  // Validate the API key before creating the client
  const isValid = await validateElevenLabsKey(process.env.ELEVENLABS_API_KEY);
  if (!isValid) {
    throw new Error('ELEVENLABS_API_KEY is invalid or expired');
  }
  
  return new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  }, );
}

export async function createVoice({
  name,
  description,
  files,
  isPublic = false
}: {
  name: string;
  description?: string;
  files: File[];
  isPublic?: boolean;
}) {
    try {
        const client = await getElevenLabsClient();
        const response = await client.voices.add({
            name,
            description,
            files,
            remove_background_noise: true,
        }, {
            timeoutInSeconds: 1800000
        });

        // removed supabase insert
        console.log('Voice creation response:', response);
    } catch (error) {
        console.error('Action: Failed to create voice:', error);
        throw error;
    }
}

export async function updateVoiceVisibility(voiceId: string, isPublic: boolean) {
    try {
        // removed supabase update
        console.log('Updated voice visibility:', { voiceId, isPublic });
    } catch (error) {
        console.error('Failed to update voice visibility:', error);
        throw error;
    }
}

export async function getVoices(): Promise<Voice[]> {

  return [{
    voice_id: 'default',
    name: 'Sonora',
    is_public: true,
    account_id: 'default',
    created_at: 'default',
    id: 'default',
    is_default: false
  }];
}

export async function deleteVoice(voiceId: string) {
  try {
    // Delete from ElevenLabs
    const client = await getElevenLabsClient();
    await client.voices.delete(voiceId);
  } catch (error) {
    console.error('Failed to delete voice:', error);
    throw error;
  }
}

export async function renameVoice(voiceId: string, newName: string) {
  try {
    // Rename in ElevenLabs
    const client = await getElevenLabsClient();
    await client.voices.edit(voiceId, { name: newName });

    console.log('Renaming voice with ID:', voiceId, 'to new name:', newName);
  } catch (error) {
    console.error('Failed to rename voice:', error);
    throw error;
  }
}

export async function previewVoice(voiceId: string, text: string) {
  try {
    // Use OpenAI for default voice
    if (voiceId === 'default') {
      const client = await getOpenAIClient();
      const mp3Response = await client.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: text,
        response_format: "mp3",
      });

      const audioData = await mp3Response.arrayBuffer();
      const base64Audio = Buffer.from(audioData).toString('base64');
      return `data:audio/mpeg;base64,${base64Audio}`;
    }

    // Use ElevenLabs for other voices
    const client = await getElevenLabsClient();
    const response = await client.textToSpeech.convert(voiceId, {
      text,
      model_id: "eleven_multilingual_v2",
    });

    // Convert stream to buffer
    const chunks = [] as any[];
    for await (const chunk of response) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const base64Audio = buffer.toString('base64');
    const base64AudioURL = `data:audio/mpeg;base64,${base64Audio}`;

    return base64AudioURL;
      
  } catch (error) {
    console.error('Preview generation error:', error);
    throw error;
  }
}

async function validateOpenAIKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Error validating OpenAI API key:', error);
    return false;
  }
}

export async function validateAPIKeys(): Promise<{
  openai: boolean;
  elevenlabs: boolean;
  allValid: boolean;
}> {
  const results = await Promise.allSettled([
    process.env.OPENAI_API_KEY ? validateOpenAIKey(process.env.OPENAI_API_KEY) : Promise.resolve(false),
    process.env.ELEVENLABS_API_KEY ? validateElevenLabsKey(process.env.ELEVENLABS_API_KEY) : Promise.resolve(false),
  ]);

  const openai = results[0].status === 'fulfilled' ? (results[0] as PromiseFulfilledResult<boolean>).value : false;
  const elevenlabs = results[1].status === 'fulfilled' ? (results[1] as PromiseFulfilledResult<boolean>).value : false;

  return {
    openai,
    elevenlabs,
    allValid: openai && elevenlabs,
  };
}

async function getOpenAIClient() {
  
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  
  // Validate the API key before creating the client
  const isValid = await validateOpenAIKey(process.env.OPENAI_API_KEY);
  if (!isValid) {
    throw new Error('OPENAI_API_KEY is invalid or expired');
  }
  
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

function processWordTimings(text: string, alignment: Alignment) {
  const wordTimings = [] as { word: string; start: number; end: number }[];
  const words = text.split(' ');
  let currentWordIndex = 0;
  let currentWord = '';
  let wordStart = 0;
  
  for (let i = 0; i < alignment.characters.length; i++) {
    const char = alignment.characters[i]!;
    const startTime = alignment.character_start_times_seconds[i]!;
    const endTime = alignment.character_end_times_seconds[i]!;
    
    if (char === ' ' || i === alignment.characters.length - 1) {
      if (i === alignment.characters.length - 1 && char !== ' ') {
        currentWord += char;
      }
      
      if (currentWord) {
        if (currentWordIndex < words.length && currentWord === words[currentWordIndex]) {
          wordTimings.push({
            word: currentWord,
            start: wordStart,
            end: endTime
          });
        }
        currentWordIndex++;
        currentWord = '';
      }
    } else {
      if (!currentWord) {
        wordStart = startTime;
      }
      currentWord += char;
    }
  }
  
  return wordTimings;
}

type Alignment = {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
};

async function generateSpeechWithOpenAI(text: string) {
  const client = await getOpenAIClient();

  try {
    // Generate speech
    const mp3Response = await client.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
      response_format: "mp3",
    });

    // Get the audio data and create base64 URL
    const audioData = await mp3Response.arrayBuffer();
    const base64Audio = Buffer.from(audioData).toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    return {
      audioUrl,
      text, // Return the original text so client can generate word timings
      provider: 'openai' as const // Add provider info to help client handle timing differently
    };
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}

export async function generateSpeech({ text, voiceId }: { text: string; voiceId: string }) {
  'use server';

  console.log('Generating speech for text:', text);
  
  try {
    // Use OpenAI for default voice
    if (voiceId === 'default') {
      const result = await generateSpeechWithOpenAI(text);
      if (!result?.audioUrl) {
        throw new Error('OpenAI speech generation failed to return audio URL');
      }
      return result;
    }

    // Use ElevenLabs for other voices
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY is not set');
    }

    const client = await getElevenLabsClient();

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Speech generation timed out after 5 minutes')), 300000);
      });

      const speechPromise = client.textToSpeech.convertWithTimestamps(voiceId, {
        text,
        model_id: "eleven_multilingual_v2",
        output_format: "mp3_44100_128"
      });

      const response = await Promise.race([speechPromise, timeoutPromise]) as ElevenLabsTextToSpeechResponse;
      
      if (!response?.audio_base64) {
        throw new Error('ElevenLabs failed to return audio data');
      }

      const audioUrl = `data:audio/mpeg;base64,${response.audio_base64}`;
      
      // Process word timings for ElevenLabs response
      const wordTimings = processWordTimings(text, response.alignment);

      return {
        audioUrl,
        wordTimings,
        provider: 'elevenlabs' as const
      };

    } catch (error) {
      console.error('Failed to generate speech with ElevenLabs:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to generate speech:', error);
    throw error;
  }
}