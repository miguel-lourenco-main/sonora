import { Story } from "~/lib/types";
import { getElevenLabsApiKey } from "~/lib/local/storage";

export interface AudioAvailabilityResult {
  canPlay: boolean;
  hasPreRecorded: boolean;
  hasApiKey: boolean;
  reason?: string;
  instructions?: string[];
}

/**
 * Checks if a story can be played based on available audio sources
 */
export async function checkAudioAvailability(story: Story): Promise<AudioAvailabilityResult> {
  // Check if story has pre-recorded audio files
  const hasPreRecorded = await checkPreRecordedAudio(story);
  
  // Check if there's a valid API key for generating audio
  const hasApiKey = checkApiKeyAvailability();
  
  const canPlay = hasPreRecorded || hasApiKey;
  
  if (canPlay) {
    return {
      canPlay: true,
      hasPreRecorded,
      hasApiKey,
    };
  }
  
  // If neither is available, provide instructions
  return {
    canPlay: false,
    hasPreRecorded: false,
    hasApiKey: false,
    reason: "No audio source available",
    instructions: [
      "This story requires either pre-recorded audio files or an API key to generate audio.",
      "To listen to this story, you can:",
      "1. Add an ElevenLabs API key in the Voices section to generate audio on-demand",
      "2. Or wait for pre-recorded audio files to be added to this story"
    ]
  };
}

/**
 * Checks if a story has pre-recorded audio files
 */
async function checkPreRecordedAudio(story: Story): Promise<boolean> {
  if (!story.chapters?.[0]?.content?.nodes) {
    return false;
  }
  
  const nodes = story.chapters[0].content.nodes;
  const nodeIds = Object.keys(nodes);
  
  // Check if at least one node has a pre-recorded audio file
  for (const nodeId of nodeIds) {
    const sampleUrl = `/samples/${story.label}-${nodeId}.mp3`;
    try {
      const response = await fetch(sampleUrl, { method: 'HEAD' });
      if (response.ok) {
        return true; // At least one pre-recorded file exists
      }
    } catch (error) {
      // Continue checking other files
      continue;
    }
  }
  
  return false;
}

/**
 * Checks if API keys are available for audio generation
 */
function checkApiKeyAvailability(): boolean {
  // Check client-side ElevenLabs API key
  const elevenLabsKey = getElevenLabsApiKey();
  
  // Note: We can't check server-side API keys from the client,
  // but we assume they're available if the client has an ElevenLabs key
  // or if the default voice (OpenAI) is being used
  return !!elevenLabsKey;
}

/**
 * Gets the list of story labels that have pre-recorded audio
 */
export function getStoriesWithPreRecordedAudio(): string[] {
  // Based on the samples directory, these stories have pre-recorded audio
  return ['enchanted-forest', 'mystic-mountain'];
}

/**
 * Checks if a specific story has pre-recorded audio based on its label
 */
export function hasPreRecordedAudio(storyLabel: string): boolean {
  return getStoriesWithPreRecordedAudio().includes(storyLabel);
}
