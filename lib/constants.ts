import { z } from "zod"

export const SONORA_STORY_PLAYER_PAGE_PATH = "/app/player/[id]"

export const SONORA_CUSTOM_PATHS_SCHEMA = {
  story_player: z.string().min(1)
}

export const SONORA_CUSTOM_PATHS = {
  story_player: SONORA_STORY_PLAYER_PAGE_PATH
}

// Voice cloning duration limits (in seconds)
export const VOICE_RECOMMENDED_DURATION = 60; // 1 minute minimum
export const VOICE_MIN_DURATION = 10; // 10 seconds minimum
export const VOICE_MAX_DURATION = 180; // 3 minutes (recommended)

export const VOICE_MAX_SAMPLES = 25; // Maximum number of audio samples allowed
export const VOICE_MAX_FILE_SIZE = '1000000000'; // 1000 MB maximum
export const VOICE_FILES_SUPPORTED_TYPES: Record<string, string[]> = {
  'audio/wav': ['.wav'],
  'audio/mpeg': ['.mp3'],
  'audio/x-m4a': ['.m4a'],
  'audio/mp4': ['.mp4']
};

export const formatDuration = (seconds: number) => {
    if (seconds >= 60) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} minute${minutes === 1 ? '' : 's'}${remainingSeconds > 0 ? ` ${remainingSeconds} seconds` : ''}`;
    }
    return `${seconds} seconds`;
};