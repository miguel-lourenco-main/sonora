"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@kit/ui/shadcn/button"
import { cn } from "@kit/ui/lib"
import { ContentNode, ElevenLabsContentNode, Story } from "~/lib/types"
import { useStoryPlayer } from "~/lib/hooks/use-story-player"
import { AudioPlayer } from "./audio-player"
import { HighlightedText } from "./highlighted-text"
import { useState, useEffect, useCallback, useRef } from "react"
import { BlurFade } from "@kit/ui/magic-ui/blur-fade"
import { SparkleBorder } from "@kit/ui/magic-ui/sparkle-border"
import { useAudioTimings } from "~/lib/hooks/use-audio-timings"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kit/ui/shadcn/select"
import { useVoices } from "~/lib/hooks/use-voices"
import { VoiceControl } from "./voice-control"
import Slider from "@kit/ui/shadcn/slider"
import { useSpeechRecognition } from "~/lib/hooks/use-speech-recognition"
import { generateSpeech } from "~/lib/actions"
import { Loader2 } from "lucide-react"
import ChoiceStatus from "./choice-status"
import { hasPreRecordedAudio } from "~/lib/utils/audio-availability"


interface StoryPlayerProps {
  story: Story;
  initialVoiceId?: string;
}

export function StoryPlayer({ story, initialVoiceId }: StoryPlayerProps) {

  const nodes = story.chapters[0]?.content.nodes ?? {};
  const initialNodeId = story.chapters[0]?.content.initialNodeId ?? '';
  
  // Add state to track all nodes with their audio URLs
  const [storyNodes, setStoryNodes] = useState<Record<string, ContentNode>>(nodes);

  const { 
    currentNode,
    setCurrentNode,
    isPlaying,
    currentTime,
    cumulativeTime,
    onTimeUpdate,
    playPause,
    makeChoice,
    audioRef,
    shouldShowChoices,
    isAudioReady,
    canReplay,
    replay,
  } = useStoryPlayer({
    initialNodeId: initialNodeId,
    nodes: storyNodes  // Use storyNodes instead of nodes
  });

  const { 
    isListening,
    hasPermission,
    isProcessing,
    requestPermission,
    startRecording,
    stopRecording
  } = useSpeechRecognition({
    choices: currentNode.choices,
    onChoiceMade: (index) => {
      setSelectedChoice(index);
      
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          makeChoice(index);
          setIsTransitioning(false);
          setSelectedChoice(null);
        }, 1500);
      }, 2000);
    }
  });

  const [selectedVoice, setSelectedVoice] = useState<string>(initialVoiceId ?? 'default');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(
    !currentNode?.audioUrl || currentNode.voiceId !== initialVoiceId
  );
  const { voices, isLoading: isLoadingVoices } = useVoices();

  // Track nodes being generated to prevent duplicate generation
  const generatingNodes = useRef(new Set<string>());

  const handleChoiceClick = (index: number) => {
    setSelectedChoice(index);
    
    setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        makeChoice(index);
        setIsTransitioning(false);
        setSelectedChoice(null);
      }, 1500);
    }, 2500);
  };

  const generateNodeSpeech = useCallback(async (id: string) => {
    // Skip if already generating speech for this node
    if (generatingNodes.current.has(id)) {
      console.log('Already generating speech for node:', id);
      return;
    }

    const node = storyNodes[id];

    if (!node?.text || !selectedVoice) {
      console.log('Missing required data:', { 
        hasText: !!node?.text, 
        selectedVoice,
      });
      return;
    }
    
    // Skip if we already have audio for this voice
    if (node.audioUrl && node.voiceId === selectedVoice) {
      return;
    }

    try {
      console.log('Generating speech for node:', id);
      setIsGeneratingSpeech(true);
      generatingNodes.current.add(id);
      
      // Use pre-recorded default audio if selected
      if (selectedVoice === 'default' && hasPreRecordedAudio(story.label)) {
        const sampleUrl = `/samples/${story.label}-${id}.mp3`;
        try {
          const head = await fetch(sampleUrl, { method: 'HEAD' });
          if (!head.ok) throw new Error('Sample not found');
          const updatedNode: ContentNode = {
            ...node,
            audioUrl: sampleUrl,
            voiceId: 'default',
          };
          if (id === currentNode.id) {
            setCurrentNode(updatedNode);
          }
          setStoryNodes(prev => ({
            ...prev,
            [id]: updatedNode
          }));
          return;
        } catch (e) {
          console.warn('No pre-recorded sample found for', sampleUrl, e);
        }
      }

      const result = await generateSpeech({
        text: node.text,
        voiceId: selectedVoice,
      });
      
      if (!result?.audioUrl) {
        throw new Error('No audio URL returned from speech generation');
      }

      console.log('Speech generated successfully:', {
        nodeId: id,
        audioUrl: result.audioUrl.slice(0, 50) + '...',
        provider: result.provider
      });
      
      const updatedNode: ContentNode = {
        ...node,
        audioUrl: result.audioUrl,
        voiceId: selectedVoice,
        ...(result.provider === 'elevenlabs' && { wordTimings: result.wordTimings })
      };

      // Update both the current node and the nodes map
      if (id === currentNode.id) {
        setCurrentNode(updatedNode);
      }
      
      // Always update the storyNodes map
      setStoryNodes(prev => ({
        ...prev,
        [id]: updatedNode
      }));
    } catch (error) {
      console.error('Error generating speech:', error);
      // Remove the node from generating set even if it failed
      generatingNodes.current.delete(id);
      
      // Reset the node's audio state
      const resetNode = node.voiceId === 'default' 
        ? {
            ...node,
            audioUrl: undefined
          }
        : {
            ...node,
            audioUrl: undefined,
            voiceId: undefined as unknown as string,
            wordTimings: undefined
          };

      if (id === currentNode.id) {
        setCurrentNode(resetNode);
      }
      
      setStoryNodes(prev => ({
        ...prev,
        [id]: resetNode
      }));
    } finally {
      generatingNodes.current.delete(id);
      setIsGeneratingSpeech(false);
    }
  }, [selectedVoice, setCurrentNode, currentNode.id, storyNodes, story.label]);

  // Generate speech for the initial node
  useEffect(() => {
    const node = storyNodes[initialNodeId];
    if (node && selectedVoice && (!node.audioUrl || node.voiceId !== selectedVoice)) {
      console.log('Generating initial node speech:', {
        nodeId: initialNodeId,
        hasAudio: !!node.audioUrl,
        currentVoice: node.voiceId,
        selectedVoice
      });
      void generateNodeSpeech(initialNodeId);
    }
  }, [selectedVoice, initialNodeId, storyNodes, generateNodeSpeech]);

  // Generate speech for next nodes while current node is playing
  useEffect(() => {
    if (!isPlaying || isGeneratingSpeech) return;

    // Only check for next nodes when we're not at the end of the current audio
    if (!audioRef.current || audioRef.current.ended) return;

    const nextNodeIds = new Set<string>();

    // Collect next node IDs from choices
    if (currentNode.choices) {
      currentNode.choices.forEach(choice => {
        if (choice.nextNodeId) {
          const nextNode = storyNodes[choice.nextNodeId];
          if (nextNode && (!nextNode.audioUrl || nextNode.voiceId !== selectedVoice)) {
            nextNodeIds.add(choice.nextNodeId);
          }
        }
      });
    } 
    // Or collect single next node
    else if (currentNode.nextNodeId) {
      const nextNode = storyNodes[currentNode.nextNodeId];
      if (nextNode && (!nextNode.audioUrl || nextNode.voiceId !== selectedVoice)) {
        nextNodeIds.add(currentNode.nextNodeId);
      }
    }

    // Generate speech for collected nodes
    if (nextNodeIds.size > 0) {
      console.log('Preparing next nodes:', Array.from(nextNodeIds));
      for (const nodeId of nextNodeIds) {
        void generateNodeSpeech(nodeId);
      }
    }
  }, [
    isPlaying,
    isGeneratingSpeech,
    currentNode.choices,
    currentNode.nextNodeId,
    storyNodes,
    selectedVoice,
    generateNodeSpeech,
    audioRef
  ]);

  // Type guard for ElevenLabs nodes
  const isElevenLabsNode = (node: ContentNode): node is ElevenLabsContentNode => 
    node.voiceId !== 'default';

  // Add audio timing hook
  const audioTimingsProps = currentNode.voiceId === 'default' 
    ? {
        audioUrl: currentNode.audioUrl ?? '',
        text: currentNode.text,
        provider: 'openai' as const
      }
    : {
        audioUrl: currentNode.audioUrl ?? '',
        provider: 'elevenlabs' as const,
        wordTimings: isElevenLabsNode(currentNode) ? (currentNode.wordTimings ?? []) : []
      };

  const { wordTimings, isLoading: isLoadingTimings, error: timingsError } = useAudioTimings(audioTimingsProps);

  // Combine loading states
  const isLoading = isGeneratingSpeech || (isLoadingTimings && currentNode.audioUrl);
  const showLoadingUI = isLoading && !isPlaying && (!currentNode.audioUrl || currentNode.voiceId !== selectedVoice);

  // Show error state if speech generation failed
  useEffect(() => {
    if (timingsError) {
      console.error('Error loading audio timings:', timingsError);
    }
  }, [timingsError]);

  if (!story.chapters[0]) {
    return <div>No chapters available</div>;
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const showGeneratingSpeech = isGeneratingSpeech && !isPlaying && !currentNode.audioUrl 
  const isCapturing = selectedChoice !== null && !isTransitioning;
  const isMakingChoice = selectedChoice !== null && isTransitioning;

  // Disable playback controls while generating audio for a different voice than the one currently on the node
  const shouldDisablePlayback = !isAudioReady || (isGeneratingSpeech && currentNode.voiceId !== selectedVoice);

  console.log('isCapturing', isCapturing)
  console.log('isMakingChoice', isMakingChoice)
  console.log('isProcessing', isProcessing)

  return (
    <div className="flex h-screen flex-col bg-background p-6">
      <header className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Button>
        </Link>
        <div className="w-full max-w-xs">
          <Select
            value={selectedVoice}
            onValueChange={setSelectedVoice}
            disabled={isLoadingVoices || isGeneratingSpeech || undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={'default'} value={'default'}>
                Pre-Recorded
              </SelectItem>
              {(voices ?? []).map((voice) => (
                <SelectItem key={voice.voice_id} value={voice.voice_id}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>
      <div className="flex flex-1 flex-col items-center justify-start gap-8 p-4 md:flex-row md:items-start md:justify-center">
        <div className="relative aspect-[3/4] w-48 flex-shrink-0 overflow-hidden rounded-lg shadow-lg md:w-64">
          <Image
            src={story.coverUrl}
            alt={story.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col items-center md:items-start md:pl-8">
          <h1 className="mb-2 text-3xl font-bold">{story.title}</h1>
          <p className="mb-4 text-lg text-muted-foreground">By {story.author}</p>
          
          <div className="relative h-48 w-full max-w-md rounded-md border p-4 md:h-64">
            {showLoadingUI && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isGeneratingSpeech ? 'Generating speech...' : 'Loading audio...'}
                </p>
              </div>
            )}
            <HighlightedText
              text={currentNode.text}
              currentTime={currentTime - cumulativeTime}
              wordTimings={wordTimings}
              isPlaying={isPlaying}
            />
          </div>
        </div>
      </div>
      <div className={cn(
        "flex flex-col gap-4 p-4 transition-all duration-300 ease-in-out",
        {
          "min-h-[12rem] max-h-[20rem]": (currentNode.choices?.length ?? 0) > 0 && 
            shouldShowChoices(currentNode) && 
            !isPlaying,
          
          "min-h-[11rem] max-h-[11rem]": !(currentNode.choices?.length ?? 0) || 
            !shouldShowChoices(currentNode) || 
            isPlaying
        }
      )}>
        <div className="flex flex-col w-full items-center justify-center mb-4">
          <Slider
            value={[canReplay && currentTime > 0  && (!currentNode.nextNodeId || currentNode.nextNodeId === '' || currentNode.choices?.length === 0) ? 100 : 0]}
            max={100}
            step={1}
            className="w-full"
            disabled={!!(isLoading ?? !currentNode.audioUrl)}
          />
          <div className="flex w-full justify-between mt-3 text-sm text-muted-foreground">
            {formatTime(currentTime)}
            <span>--:--</span>
          </div>
        </div>
        {currentNode.choices && 
          currentNode.choices.length > 0 && 
          shouldShowChoices(currentNode) ? (
          <div className="flex flex-col items-center gap-4">
            {!isPlaying && (
                <>
                  <BlurFade
                    show={true}
                    duration={1.0}
                    delay={0.1}
                    direction="down"
                    offset={12}
                    inView
                    useLayout={true}
                  >
                    <div className="flex flex-col items-center gap-2 mb-2">
                      {isProcessing || isCapturing || isMakingChoice ? (
                        <ChoiceStatus
                          isProcessing={isProcessing}
                          isCapturing={isCapturing}
                          isMakingChoice={isMakingChoice}
                        />
                      ) : (
                        <>
            <p className="text-lg font-semibold">Make a choice:</p>
            <div className="flex flex-col items-center w-full">
              <VoiceControl
                isListening={isListening}
                hasPermission={hasPermission}
                onRequestPermission={requestPermission}
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
              />
            </div>
                        </>
                      )}
                    </div>
                  </BlurFade>
                  <div className={cn(
                    "flex flex-col items-center gap-4",
                    isTransitioning ? "h-0 overflow-hidden" : "h-auto"
                  )}>
                    {currentNode.choices.map((choice, index) => (
                      <BlurFade
                        key={`choice-${choice.text}`}
                        show={!isTransitioning}
                        duration={1.0}
                        delay={index * 0.1}
                        direction="down"
                        offset={12}
                        inView
                        useLayout={true}
                      >
                        <SparkleBorder
                          isSelected={selectedChoice === index}
                          className="w-fit"
                        >
                          <Button
                            variant="outline"
                            onClick={() => handleChoiceClick(index)}
                            disabled={selectedChoice !== null && selectedChoice !== index}
                            className={cn(
                              "text-left text-lg w-fit border-0 bg-background hover:bg-background/80",
                              "text-foreground",
                              selectedChoice === index && "text-foreground"
                            )}
                          >
                            {choice.text}
                          </Button>
                        </SparkleBorder>
                      </BlurFade>
                    ))}
                  </div>
                </>
              )}
          </div>
        ) : (
          <BlurFade
            show={true}
            duration={0.5}
            offset={12}
            inView
            useLayout={true}
            className="flex flex-col relative items-center justify-center gap-4"
          >
            <div className="relative">
              {canReplay ? (
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={shouldDisablePlayback || undefined}
                  className={cn(
                    "relative h-16 w-16 rounded-full transition-all duration-1000",
                    isPlaying ? "bg-primary text-primary-foreground" : "",
                    (shouldDisablePlayback) && "opacity-50"
                  )}
                  onClick={replay}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8"
                  >
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </Button>
              ) : (
            <Button
              variant="ghost"
              size="icon"
                  disabled={shouldDisablePlayback || undefined}
              className={cn(
                    "relative h-16 w-16 rounded-full transition-all duration-1000",
                isPlaying ? "bg-primary text-primary-foreground" : "",
                    (shouldDisablePlayback) && "opacity-50"
              )}
              onClick={playPause}
            >
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </Button>
              )}
          </div>
          </BlurFade>
        )}
        <div className="text-center text-base text-muted-foreground">
          Chapter {story.currentChapter} of {story.totalChapters}
        </div>
      </div>
        <AudioPlayer
          node={currentNode}
          isPlaying={isPlaying}
          audioRef={audioRef}
        onTimeUpdate={onTimeUpdate}
        />
    </div>
  );
}