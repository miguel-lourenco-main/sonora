import * as dotenv from 'dotenv';
import { resolve } from 'path';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { ContentNode, Subtitle, NodeDuration, DurationMetadata } from '../lib/types';
import { bookData } from '../lib/data/sample-story';
import { mkdirSync } from 'fs';

// Load .env file
dotenv.config({ path: resolve(process.cwd(), '.env') });

// Constants
const API_KEY = process.env.OPENAI_API_KEY;
const __filename = fileURLToPath(import.meta.url);
const SAMPLES_DIR = path.join(process.cwd(), 'public/samples');
const DECIMAL_DIGITS = 3;
const CHUNK_DURATION = 5.000;
const MAX_CHUNK_DURATION = 7.000;

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Generates speech audio using OpenAI's TTS API
 */
async function generateSpeech(text: string, outputFile: string): Promise<void> {
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'alloy',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API request failed: ${JSON.stringify(error)}`);
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(outputFile, Buffer.from(buffer));
    console.log(`Audio saved to ${outputFile}`);
  } catch (error) {
    console.error('Error generating audio for', outputFile, ':', error);
  }
}

/**
 * Creates a subtitle entry with proper decimal formatting
 */
function createSubtitle(startTime: number, duration: number, chunks: string[]): Subtitle {
  return {
    start: Number(startTime.toFixed(DECIMAL_DIGITS)),
    end: Number((startTime + duration).toFixed(DECIMAL_DIGITS)),
    text: chunks.join(' ')
  };
}

/**
 * Generates subtitles for a given text and audio duration
 */
function generateSubtitles(text: string, duration: number): Subtitle[] {
  // Split text into phrases using punctuation
  const phrases = text
    .split(/([.!?]+)/)
    .reduce((acc: string[], current, i, arr) => {
      if (i % 2 === 0) {
        return acc.concat(current + (arr[i + 1] ?? ''));
      }
      return acc;
    }, [])
    .filter(phrase => phrase.trim());

  // Calculate approximate words per second
  const wordsPerSecond = text.split(' ').length / duration;

  const subtitles: Subtitle[] = [];
  let currentChunk: string[] = [];
  let currentDuration = 0;
  let startTime = 0;

  phrases.forEach((phrase, index) => {
    const phraseWordCount = phrase.trim().split(' ').length;
    const phraseDuration = phraseWordCount / wordsPerSecond;
    
    const wouldExceedMax = currentDuration + phraseDuration > MAX_CHUNK_DURATION;
    const isShortPhrase = phraseDuration < (CHUNK_DURATION / 2);
    const hasNextPhrase = index < phrases.length - 1;

    if (wouldExceedMax && currentChunk.length > 0) {
      subtitles.push(createSubtitle(startTime, currentDuration, currentChunk));
      startTime += currentDuration;
      currentChunk = [];
      currentDuration = 0;
    }

    currentChunk.push(phrase.trim());
    currentDuration += phraseDuration;

    if (currentDuration >= CHUNK_DURATION && !isShortPhrase && hasNextPhrase) {
      subtitles.push(createSubtitle(startTime, currentDuration, currentChunk));
      startTime += currentDuration;
      currentChunk = [];
      currentDuration = 0;
    }
  });

  if (currentChunk.length > 0) {
    subtitles.push({
      start: Number(startTime.toFixed(DECIMAL_DIGITS)),
      end: Number(duration.toFixed(DECIMAL_DIGITS)),
      text: currentChunk.join(' ')
    });
  }

  return subtitles;
}

/**
 * Generates speech audio and subtitle files for a story node
 */
async function generateSpeechAndSubtitles(
  storyId: string, 
  nodeId: string, 
  nodeData: ContentNode
): Promise<{ duration: number; subtitles: Subtitle[] } | null> {
  ensureDirectoryExists(SAMPLES_DIR);
  
  const outputBaseName = `${storyId}-${nodeId}`;
  const mp3Path = path.join(SAMPLES_DIR, `${outputBaseName}.mp3`);

  // Skip if audio file already exists
  if (fs.existsSync(mp3Path)) {
    const duration = await getAudioDurationInSeconds(mp3Path);
    const subtitles = generateSubtitles(nodeData.text, duration);
    return { duration, subtitles };
  }

  // Generate audio
  await generateSpeech(nodeData.text, mp3Path);

  // Get actual audio duration
  const duration = await getAudioDurationInSeconds(mp3Path);
  console.log(`Audio duration for ${outputBaseName}: ${duration} seconds`);

  // Generate subtitles
  const subtitles = generateSubtitles(nodeData.text, duration);
  return { duration, subtitles };
}

/**
 * Generates duration metadata for a story chapter
 */
async function generateChapterDuration(storyId: string, nodes: Record<string, ContentNode>): Promise<void> {
  function findSharedEndNodes(nodes: Record<string, ContentNode>): Set<string> {
    const nodeReferences = new Map<string, string[]>();
    
    // Count references to each node
    Object.values(nodes).forEach(node => {
      if (node.nextNodeId) {
        const refs = nodeReferences.get(node.nextNodeId) ?? [];
        refs.push(node.id);
        nodeReferences.set(node.nextNodeId, refs);
      }
      if (node.choices) {
        node.choices.forEach(choice => {
          const refs = nodeReferences.get(choice.nextNodeId) ?? [];
          refs.push(node.id);
          nodeReferences.set(choice.nextNodeId, refs);
        });
      }
    });

    // Find nodes with multiple references
    return new Set(
      Array.from(nodeReferences.entries())
        .filter(([_, refs]) => refs.length > 1)
        .map(([nodeId]) => nodeId)
    );
  }

  const durations: Record<string, NodeDuration> = {};
  const sharedEndNodes = findSharedEndNodes(nodes);
  
  // First generate all node data without timestamps
  for (const [nodeId, node] of Object.entries(nodes)) {
    const audioPath = path.join(SAMPLES_DIR, `${storyId}-${nodeId}.mp3`);
    
    if (!fs.existsSync(audioPath)) {
      console.log(`Skipping missing audio: ${audioPath}`);
      continue;
    }

    const duration = await getAudioDurationInSeconds(audioPath);
    const chunks = generateSubtitles(node.text, duration);

    if (sharedEndNodes.has(nodeId)) {
      // Store template for shared nodes
      durations[`${nodeId}-template`] = {
        duration,
        chunks,
        startTimestamp: 0  // Template nodes start at 0, actual timestamps set later
      };
    } else {
      durations[nodeId] = {
        duration,
        chunks,
        startTimestamp: 0  // Template nodes start at 0, actual timestamps set later
      };
    }
  }

  // Calculate timestamps by traversing paths from start
  function calculateTimestamps(currentNode: string, currentTimestamp: number, visited: Set<string>) {
    const nodeData = nodes[currentNode];
    if (!nodeData || visited.has(currentNode)) return;
    
    visited.add(currentNode);
    
    // Get current node duration
    const currentDuration = sharedEndNodes.has(currentNode) 
      ? durations[`${currentNode}-template`]?.duration ?? 0
      : durations[currentNode]?.duration ?? 0;
    
    // Set timestamp for current node
    if (sharedEndNodes.has(currentNode)) {
      // For shared nodes, create path-specific variants based on previous node
      const prevNode = Array.from(visited).slice(-2)[0];
      if (prevNode) {
        const variantId = `${currentNode}-${prevNode}`;
        durations[variantId] = {
          duration: durations[`${currentNode}-template`]?.duration ?? 0,
          chunks: durations[`${currentNode}-template`]?.chunks ?? [],
          startTimestamp: Number(currentTimestamp.toFixed(DECIMAL_DIGITS))
        };
      }
    } else if(durations[currentNode]) {
      durations[currentNode].startTimestamp = Number(currentTimestamp.toFixed(DECIMAL_DIGITS));
    }

    const nextTimestamp = currentTimestamp + currentDuration;

    // Process linear path
    if (nodeData.nextNodeId) {
      calculateTimestamps(nodeData.nextNodeId, nextTimestamp, visited);
    }

    // Process choice paths in parallel - each with their own visited set
    if (nodeData.choices) {
      for (const choice of nodeData.choices) {
        calculateTimestamps(choice.nextNodeId, nextTimestamp, new Set(visited));
      }
    }
  }

  // Start timestamp calculation from the initial node
  console.log('\n=== Starting timestamp calculation ===');
  calculateTimestamps("start", 0, new Set());

  // Calculate total duration through all possible paths
  function findMaxDuration(currentNode: string, visited: Set<string>, currentDuration: number): number {
    console.log(`\nFinding max duration for node: ${currentNode}`);
    console.log(`Current accumulated duration: ${currentDuration}`);
    console.log(`Visited nodes: ${Array.from(visited).join(', ')}`);

    const nodeData = nodes[currentNode];
    if (!nodeData || visited.has(currentNode)) {
      console.log(`Node invalid or already visited, returning current duration: ${currentDuration}`);
      return currentDuration;
    }
    
    visited.add(currentNode);
    
    const nodeDuration = sharedEndNodes.has(currentNode) && visited.size > 1
      ? durations[`${currentNode}-${Array.from(visited).slice(-2)[0]}`]?.duration ?? 0
      : durations[currentNode]?.duration ?? 0;
    
    console.log(`Duration for this node: ${nodeDuration}`);

    const newDuration = currentDuration + nodeDuration;
    console.log(`New accumulated duration: ${newDuration}`);

    if (!nodeData.nextNodeId && (!nodeData.choices || nodeData.choices.length === 0)) {
      console.log(`End node reached, returning total duration: ${newDuration}`);
      return newDuration;
    }

    const pathDurations: number[] = [];

    if (nodeData.nextNodeId) {
      console.log(`Following linear path to: ${nodeData.nextNodeId}`);
      pathDurations.push(findMaxDuration(nodeData.nextNodeId, new Set(visited), newDuration));
    }

    if (nodeData.choices) {
      console.log(`Processing choices: ${nodeData.choices.map(c => c.nextNodeId).join(', ')}`);
      for (const choice of nodeData.choices) {
        pathDurations.push(findMaxDuration(choice.nextNodeId, new Set(visited), newDuration));
      }
    }

    const maxDuration = pathDurations.length > 0 ? Math.max(...pathDurations) : newDuration;
    console.log(`Max duration for paths from ${currentNode}: ${maxDuration}`);
    return maxDuration;
  }

  const totalDuration = findMaxDuration("start", new Set(), 0);

  // Write duration data to file
  const durationData: DurationMetadata = {
    totalDuration: Number(totalDuration.toFixed(DECIMAL_DIGITS)),
    nodes: durations
  };

  const durationPath = path.join(SAMPLES_DIR, `${storyId}-durations.yaml`);
  fs.writeFileSync(durationPath, yaml.dump(durationData, {
    lineWidth: -1,
    noRefs: true,
    forceQuotes: false,
  }));
}

/**
 * Main process function to handle all story texts
 */
async function processStoryTexts(): Promise<void> {
  for (const story of bookData) {
    for (const chapter of story.chapters) {
      const nodes = chapter.content.nodes;
      // First generate all audio and subtitle files
      for (const [nodeId, nodeData] of Object.entries(nodes)) {
        await generateSpeechAndSubtitles(story.label, nodeId, nodeData);
        // Add delay between API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Then generate the duration metadata file
      await generateChapterDuration(story.label, nodes);
    }
  }
}

// Start processing
processStoryTexts().catch(console.error);