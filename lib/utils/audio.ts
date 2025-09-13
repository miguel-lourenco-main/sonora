import { AudioDeviceConfig } from '../types';

export const DEFAULT_AUDIO_CONFIG: AudioDeviceConfig = {
  channelCount: 1,
  sampleRate: 44100,
  sampleSize: 16,
  echoCancellation: true,
  noiseSuppression: true
};

export async function getAudioDevices(): Promise<MediaDeviceInfo[]> {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'audioinput');
  } catch (err) {
    console.error('Error getting audio devices:', err);
    return Promise.reject(new Error('Failed to get audio devices'));
  }
}

/**
 * Converts a base64 data URL to a Blob URL
 */
export function dataUrlToBlob(dataUrl: string): string {
  // Extract the base64 data
  const parts = dataUrl.split(',');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error('Invalid data URL format');
  }
  
  const header = parts[0];
  const base64Data = parts[1];
  const mimeRegex = /^data:(.*?);base64$/;
  const mimeMatch = mimeRegex.exec(header);
  if (!mimeMatch?.at(1)) {
    throw new Error('Invalid data URL header format');
  }
  
  const mimeType = mimeMatch[1];
  
  try {
    // Convert base64 to binary
    const binaryStr = window.atob(base64Data);
    const len = binaryStr.length;
    const arr = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
      arr[i] = binaryStr.charCodeAt(i);
    }
    
    // Create blob and URL
    const blob = new Blob([arr], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (error) {
    throw new Error('Failed to process base64 data: ' + (error as Error).message);
  }
}

/**
 * Gets the duration of an audio file in seconds
 */
export function getAudioDuration(audioUrl: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    
    // Convert data URL to blob URL if needed
    const url = audioUrl.startsWith('data:') ? dataUrlToBlob(audioUrl) : audioUrl;
    console.log('🎵 Creating Audio element for:', url.slice(0, 50) + '...');

    // Log all relevant events
    audio.addEventListener('loadstart', () => {
      console.log('🎵 [loadstart] Loading started:', {
        duration: audio.duration,
        readyState: audio.readyState,
        networkState: audio.networkState,
        paused: audio.paused,
        currentTime: audio.currentTime
      });
    });

    audio.addEventListener('durationchange', () => {
      console.log('🎵 [durationchange] Duration updated:', {
        duration: audio.duration,
        readyState: audio.readyState,
        networkState: audio.networkState,
        paused: audio.paused,
        currentTime: audio.currentTime
      });
    });

    audio.addEventListener('loadedmetadata', () => {
      console.log('🎵 [loadedmetadata] Metadata loaded:', {
        duration: audio.duration,
        readyState: audio.readyState,
        networkState: audio.networkState,
        paused: audio.paused,
        currentTime: audio.currentTime
      });
      
      if (audio.duration && audio.duration !== Infinity) {
        console.log('✅ Valid duration found in loadedmetadata:', audio.duration);
        cleanup();
        resolve(audio.duration);
      } else {
        console.log('⚠️ Invalid duration in loadedmetadata:', audio.duration);
      }
    });

    audio.addEventListener('canplay', () => {
      console.log('🎵 [canplay] Can start playing:', {
        duration: audio.duration,
        readyState: audio.readyState,
        networkState: audio.networkState,
        paused: audio.paused,
        currentTime: audio.currentTime
      });
      
      if (audio.duration && audio.duration !== Infinity) {
        console.log('✅ Valid duration found in canplay:', audio.duration);
        resolve(audio.duration);
      }
    });

    audio.addEventListener('canplaythrough', () => {
      console.log('🎵 [canplaythrough] Can play through:', {
        duration: audio.duration,
        readyState: audio.readyState,
        networkState: audio.networkState,
        paused: audio.paused,
        currentTime: audio.currentTime
      });
      
      if (audio.duration && audio.duration !== Infinity) {
        console.log('✅ Valid duration found in canplaythrough:', audio.duration);
        resolve(audio.duration);
      }
    });

    audio.addEventListener('error', (event) => {
      cleanup();
      reject(new Error(`Failed to load audio: ${event.type}`));
    });

    // Set source and start loading
    audio.src = url;
    audio.load();

    // Clean up blob URL when done
    const cleanup = () => {
      if (url !== audioUrl) {
        URL.revokeObjectURL(url);
      }
    };
  });
}

/**
 * Gets the duration of multiple audio files in seconds
 */
export async function getAudioDurations(audioUrls: string[]): Promise<number[]> {
  return Promise.all(audioUrls.map(url => getAudioDuration(url)));
}

export function calculateWordTimings(text: string, totalDuration: number) {
  console.log('📝 [timings] Calculating word timings:', {
    textLength: text.length,
    totalDuration: totalDuration.toFixed(2)
  });

  // Constants for timing adjustments (in seconds)
  const PAUSE_AFTER_COMMA = 0.4;
  const PAUSE_AFTER_PERIOD = 0.8;
  const PAUSE_AFTER_NEWLINE = 1.2;

  // First pass: Count total characters and pauses
  const chars = text.split('');
  let totalPauseUnits = 0;
  const totalCharUnits = chars.length;

  chars.forEach((char, i) => {
    if (i !== chars.length - 1) {
      if (char === ',') totalPauseUnits += PAUSE_AFTER_COMMA;
      if (char === '.') totalPauseUnits += PAUSE_AFTER_PERIOD;
      if (char === '\n') totalPauseUnits += PAUSE_AFTER_NEWLINE;
    }
  });

  // Calculate effective characters per second based on total duration
  const CHARS_PER_SECOND = totalCharUnits / (totalDuration - totalPauseUnits);

  console.log('📝 [timings] Base timing calculations:', {
    totalPauseUnits: totalPauseUnits.toFixed(2),
    effectiveCharsPerSecond: CHARS_PER_SECOND.toFixed(2)
  });

  // Second pass: Generate character timings
  const charTimings: { char: string; start: number; end: number }[] = [];
  let currentTime = 0;

  chars.forEach((char, i) => {
    const charDuration = 1 / CHARS_PER_SECOND;
    const charTiming = {
      char,
      start: currentTime,
      end: currentTime + charDuration
    };
    charTimings.push(charTiming);
    
    currentTime += charDuration;

    // Add pauses after punctuation (except for last character)
    if (i !== chars.length - 1) {
      if (char === ',') {
        currentTime += PAUSE_AFTER_COMMA;
        console.log('📝 [timings] Added comma pause at:', currentTime.toFixed(2));
      } else if (char === '.') {
        currentTime += PAUSE_AFTER_PERIOD;
        console.log('📝 [timings] Added period pause at:', currentTime.toFixed(2));
      } else if (char === '\n') {
        currentTime += PAUSE_AFTER_NEWLINE;
        console.log('📝 [timings] Added newline pause at:', currentTime.toFixed(2));
      }
    }
  });

  // Third pass: Generate word timings based on character spans
  const wordTimings: { word: string; start: number; end: number }[] = [];
  let currentWord = '';
  let wordStart = 0;
  let isFirstCharOfWord = true;

  charTimings.forEach((timing, i) => {
    const whitespaceRegex = /\s/;
    const isWhitespace = whitespaceRegex.exec(timing.char) !== null;
    
    if (isWhitespace || i === charTimings.length - 1) {
      // If last character, include it if it's not whitespace
      if (i === charTimings.length - 1 && !whitespaceRegex.exec(timing.char)) {
        currentWord += timing.char;
      }
      
      if (currentWord) {
        wordTimings.push({
          word: currentWord,
          start: wordStart,
          end: timing.end
        });
        console.log('📝 [timings] Word timing:', {
          word: currentWord,
          start: wordStart.toFixed(2),
          end: timing.end.toFixed(2),
          duration: (timing.end - wordStart).toFixed(2)
        });
        currentWord = '';
        isFirstCharOfWord = true;
      }
    } else {
      if (isFirstCharOfWord) {
        wordStart = timing.start;
        isFirstCharOfWord = false;
      }
      currentWord += timing.char;
    }
  });

  console.log('📝 [timings] Final word timings:', {
    wordCount: wordTimings.length,
    totalTime: wordTimings[wordTimings.length - 1]?.end.toFixed(2) ?? 0,
    averageWordDuration: (totalDuration / wordTimings.length).toFixed(2)
  });

  return wordTimings;
} 