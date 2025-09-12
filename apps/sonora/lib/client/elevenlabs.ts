import { getElevenLabsApiKey } from "../local/storage";

export type ElevenLabsVoice = {
  voice_id: string;
  name: string;
  category?: string;
  labels?: Record<string, string>;
  description?: string;
  preview_url?: string;
  date_unix?: number;
};

export async function requireApiKey(): Promise<string> {
  const key = getElevenLabsApiKey();
  if (!key) throw new Error('Missing ElevenLabs API key');
  return key;
}

export async function listVoices(): Promise<ElevenLabsVoice[]> {
  const apiKey = await requireApiKey();
  const res = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': apiKey },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to list voices');
  const data = await res.json();
  return (data.voices ?? data) as ElevenLabsVoice[];
}

export async function createVoice(params: { name: string; description?: string; files: File[]; }): Promise<ElevenLabsVoice> {
  const apiKey = await requireApiKey();
  const form = new FormData();
  form.set('name', params.name);
  if (params.description) form.set('description', params.description);
  params.files.forEach((file, idx) => form.append('files', file, file.name || `audio_${idx}.wav`));
  form.set('remove_background_noise', 'true');
  const res = await fetch('https://api.elevenlabs.io/v1/voices/add', {
    method: 'POST',
    headers: { 'xi-api-key': apiKey },
    body: form,
  });
  if (!res.ok) throw new Error(`Failed to create voice`);
  const data = await res.json();
  return data as ElevenLabsVoice;
}

export async function deleteVoice(voiceId: string): Promise<void> {
  const apiKey = await requireApiKey();
  const res = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}`, {
    method: 'DELETE',
    headers: { 'xi-api-key': apiKey },
  });
  if (!res.ok) throw new Error('Failed to delete voice');
}

export async function renameVoice(voiceId: string, name: string): Promise<void> {
  const apiKey = await requireApiKey();
  const res = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}/edit`, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to rename voice');
}

export async function previewVoice(voiceId: string, text: string): Promise<string> {
  const apiKey = await requireApiKey();
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2' }),
  });
  if (!res.ok) throw new Error('Failed to generate preview');
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export type ValidateResult = { ok: true } | { ok: false; status?: number; cors?: boolean };

export async function validateApiKey(key: string): Promise<ValidateResult> {
  try {
    const res = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: { 'xi-api-key': key.trim() },
      cache: 'no-store',
      // mode: 'cors' is default; keep explicit semantics clear
      mode: 'cors',
    });
    if (res.ok) return { ok: true };
    return { ok: false, status: res.status };
  } catch (e) {
    // Likely a CORS/network error in the browser
    return { ok: false, cors: true };
  }
}