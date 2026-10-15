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
  if (!res.ok) {
    let errorMessage = 'Failed to list voices';
    try {
      const errorData = await res.json();
      if (errorData.detail?.message) {
        errorMessage = errorData.detail.message;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      if (res.status === 401) {
        errorMessage = 'Invalid or missing API key';
      } else if (res.status === 429) {
        errorMessage = 'Quota exhausted. Please check your ElevenLabs account limits.';
      }
    }
    throw new Error(errorMessage);
  }
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
  
  // Try using FormData instead of JSON, similar to createVoice
  const form = new FormData();
  form.set('name', name);
  console.log('Renaming voice with FormData, name:', name);
  
  const res = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}/edit`, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey },
    body: form,
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Rename voice error response:', errorText);
    throw new Error(`Failed to rename voice: ${errorText}`);
  }
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
  if (!res.ok) {
    let errorMessage = 'Failed to generate preview';
    try {
      const errorData = await res.json();
      if (errorData.detail?.message) {
        errorMessage = errorData.detail.message;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // If we can't parse the error response, use a generic message based on status
      if (res.status === 401) {
        errorMessage = 'Invalid or missing API key';
      } else if (res.status === 429) {
        errorMessage = 'Quota exhausted. Please check your ElevenLabs account limits.';
      } else if (res.status === 400) {
        errorMessage = 'Invalid request. Please check your input.';
      } else if (res.status >= 500) {
        errorMessage = 'ElevenLabs service is temporarily unavailable';
      }
    }
    throw new Error(errorMessage);
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export type ConnectionTestResult =
  | { ok: true }
  | { ok: false; message: string; status?: number };

function readErrorMessage(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const { detail, message } = body as { detail?: unknown; message?: unknown };
  if (typeof detail === 'string') return detail;
  if (detail && typeof detail === 'object') {
    const nested = (detail as { message?: unknown }).message;
    if (typeof nested === 'string') return nested;
  }
  return typeof message === 'string' ? message : null;
}

/**
 * Checks a key against ElevenLabs' cheapest authenticated endpoint (GET /v1/user,
 * no credits used). The app is a static export with no server, so the request goes
 * straight from the browser to ElevenLabs, the same path every other call here takes.
 */
export async function testConnection(key: string): Promise<ConnectionTestResult> {
  let res: Response;
  try {
    res = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: { 'xi-api-key': key.trim() },
      cache: 'no-store',
    });
  } catch {
    return { ok: false, message: 'Could not reach ElevenLabs (network or CORS error).' };
  }

  if (res.ok) return { ok: true };

  let message: string | null = null;
  try {
    message = readErrorMessage(await res.json());
  } catch {
    // non-JSON error body
  }
  if (!message) {
    if (res.status === 401) message = 'Invalid API key.';
    else if (res.status === 429) message = 'Too many requests. Try again in a moment.';
    else if (res.status >= 500) message = 'ElevenLabs is temporarily unavailable.';
    else message = `Request failed (HTTP ${res.status}).`;
  }
  return { ok: false, status: res.status, message };
}
