'use server'

import { ElevenLabsClient } from "elevenlabs";
import { Choice, ElevenLabsTextToSpeechResponse } from './types';
import { Database } from "~/lib/database.types";
import { getSupabaseServerClient } from "@kit/supabase/server-client";
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

        const supabase = getSupabaseServerClient<Database>();

        const { error } = await supabase
            .from('voice')
            .insert({
                voice_id: response.voice_id,
                name: name,
                is_public: isPublic
            });

        if (error) throw error;

        console.log('Voice creation response:', response);
    } catch (error) {
        console.error('Action: Failed to create voice:', error);
        throw error;
    }
}

export async function updateVoiceVisibility(voiceId: string, isPublic: boolean) {
    try {
        const supabase = getSupabaseServerClient<Database>();

        const { error } = await supabase
            .from('voice')
            .update({ is_public: isPublic })
            .eq('voice_id', voiceId);

        if (error) throw error;

        console.log('Updated voice visibility:', { voiceId, isPublic });
    } catch (error) {
        console.error('Failed to update voice visibility:', error);
        throw error;
    }
}

export async function getVoices() {
    const supabase = getSupabaseServerClient<Database>();

    const { data: voices, error } = await supabase
        .from('voice')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;

    console.log('Fetched voices:', voices);

    return voices;
}

export async function getPublicVoices() {
    const supabase = getSupabaseServerClient<Database>();

    const { data: voices, error } = await supabase
        .from('voice')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

    if (error) throw error;

    console.log('Fetched public voices:', voices);

    return voices;
}

export async function deleteVoice(voiceId: string) {
  try {
    // Delete from ElevenLabs
    const client = await getElevenLabsClient();
    await client.voices.delete(voiceId);

    const supabase = getSupabaseServerClient<Database>();

    // Delete from Supabase
    const { error } = await supabase
      .from('voice')
      .delete()
      .eq('voice_id', voiceId);

    if (error) throw error;

    console.log('Deleting voice with ID:', voiceId);
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
    const chunks = [];
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

  const openai = results[0].status === 'fulfilled' ? results[0].value : false;
  const elevenlabs = results[1].status === 'fulfilled' ? results[1].value : false;

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

interface Alignment {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

function processWordTimings(text: string, alignment: Alignment) {
  const wordTimings = [];
  const words = text.split(' ');
  let currentWordIndex = 0;
  let currentWord = '';
  let wordStart = 0;
  
  for (let i = 0; i < alignment.characters.length; i++) {
    const char = alignment.characters[i];
    const startTime = alignment.character_start_times_seconds[i] ?? 0;
    const endTime = alignment.character_end_times_seconds[i] ?? 0;
    
    if (char === ' ' || i === alignment.characters.length - 1) {
      // If this is the last character, include it in the current word
      if (i === alignment.characters.length - 1 && char !== ' ') {
        currentWord += char;
      }
      
      if (currentWord) {
        // Only add the word if it matches our expected word
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

// Define the type for node data
type NodeData = {
  duration: number;
  chunks: Array<{
    start: number;
    end: number;
    text: string;
  }>;
};

export async function generateSpeechSimulated({ text, nodeId }: { text: string; nodeId: string }) {
  'use server';

  console.log('Simulating speech generation for text:', text, 'nodeId:', nodeId);

  // Simulate API delay (random between 1-3 seconds)
  const delay = Math.floor(Math.random() * 3000) + 4000;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Map node IDs to audio files for the enchanted forest story
  const audioMap: Record<string, string> = {
    'start': '/samples/enchanted-forest-start.mp3',
    'path-split': '/samples/enchanted-forest-path-split.mp3',
    'shadow-path': '/samples/enchanted-forest-shadow-path.mp3',
    'sun-path': '/samples/enchanted-forest-sun-path.mp3',
    'end-chapter': '/samples/enchanted-forest-end-chapter.mp3'
  };

  // Map node IDs to their actual durations and chunk timings from the YAML
  const nodeTimings: Record<string, NodeData> = {
    'start': {
      duration: 23.688,
      chunks: [
        { start: 0, end: 6.877, text: "Deep within the realm of ancient magic lies the Enchanted Forest, a place where every choice shapes destiny." },
        { start: 6.877, end: 13.372, text: "As you step through the ethereal mist that marks its borders, you feel the forest's consciousness stirring." },
        { start: 13.372, end: 20.631, text: "The very air seems alive with whispers of untold stories, and the path before you pulses with magical energy." },
        { start: 20.631, end: 23.688, text: "Your journey into these mystical woods begins now." }
      ]
    },
    'path-split': {
      duration: 10.368,
      chunks: [
        { start: 0, end: 5.76, text: "The forest path divides before you. To your left, shadows dance invitingly beneath ancient boughs." },
        { start: 5.76, end: 10.368, text: "To your right, golden sunlight streams through a canopy of emerald leaves." }
      ]
    },
    'shadow-path': {
      duration: 37.2,
      chunks: [
        { start: 0, end: 6, text: "You venture down the shadowy path, where ancient moss-covered trees loom overhead like silent guardians." },
        { start: 6, end: 13.6, text: "The air grows thick with mystery as you navigate through twisted roots and hear distant echoes of forgotten magic." },
        { start: 13.6, end: 20, text: "Strange glowing mushrooms illuminate your way, casting an otherworldly blue light that dances across your path." },
        { start: 20, end: 26.8, text: "The whispers of the forest grow stronger here, speaking of secrets long buried in these dark depths." },
        { start: 26.8, end: 37.2, text: "As you press forward, you can't shake the feeling that unseen eyes are watching your every move, judging your worthiness to witness the forest's deepest mysteries." }
      ]
    },
    'sun-path': {
      duration: 37.248,
      chunks: [
        { start: 0, end: 6.772, text: "The sunlit path welcomes you with a warm embrace as golden rays filter through the swaying branches above." },
        { start: 6.772, end: 13.921, text: "Butterflies with wings like stained glass dance around wildflowers that carpet the forest floor in a riot of colors." },
        { start: 13.921, end: 25.961, text: "As you walk, you discover small clearings where magical creatures go about their daily lives - pixies tending to luminous flowers, and small forest spirits playing among the roots of ancient trees." },
        { start: 25.961, end: 37.248, text: "The air here is sweet with the scent of blooming magic, though beneath this cheerful facade, you sense powerful forces at work, weaving spells as old as the forest itself." }
      ]
    },
    'end-chapter': {
      duration: 8.448,
      chunks: [
        { start: 0, end: 4.928, text: "Your choice has set in motion events that will echo through the Enchanted Forest." },
        { start: 4.928, end: 8.448, text: "But this is just the beginning of your magical journey." }
      ]
    }
  };

  // Get the audio file and timing data for the node
  const sampleAudioUrl = audioMap[nodeId] ?? '/samples/enchanted-forest-start.mp3';
  const defaultNode = nodeTimings.start!; // We know this exists
  const nodeData: NodeData = nodeTimings[nodeId] ?? defaultNode;

  // Generate word timings based on the chunks
  const wordTimings: Array<{ word: string; start: number; end: number }> = [];
  
  nodeData.chunks.forEach(chunk => {
    const words = chunk.text.split(' ');
    const timePerWord = (chunk.end - chunk.start) / words.length;
    
    words.forEach((word, index) => {
      const start = chunk.start + (index * timePerWord);
      const end = start + timePerWord - 0.05; // Small gap between words
      wordTimings.push({ word, start, end });
    });
  });

  console.log('Simulated speech generation completed with file:', sampleAudioUrl, 'duration:', nodeData.duration);
  
  return {
    audioUrl: sampleAudioUrl,
    wordTimings
  };
}