"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@kit/ui/lib"
import { ContentNode, ElevenLabsContentNode, Story } from "~/lib/types"
import { useStoryPlayer } from "~/lib/hooks/use-story-player"
import { AudioPlayer } from "./audio-player"
import { HighlightedText } from "./highlighted-text"
import { useState, useEffect, useCallback, useRef } from "react"
import { AnimatePresence, motion } from "motion/react"
import { BlurFade } from "@kit/ui/magic-ui/blur-fade"
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
import { useSpeechRecognition } from "~/lib/hooks/use-speech-recognition"
import { previewVoice } from "~/lib/client/elevenlabs"
import { ArrowLeft, Loader2, Mic, Sparkles } from "lucide-react"
import ChoiceStatus from "./choice-status"
import { hasPreRecordedAudio } from "~/lib/utils/audio-availability"
import { getProgressChapterNumber } from "~/lib/utils/chapter-progress"
import { toast } from "sonner"
import { PageContainer, StaggerGroup, StaggerItem } from "@/components/sonora"
import { useListeningProgress } from "~/lib/hooks/use-listening-progress"
import { fadeUp } from "~/lib/motion/variants"
import { ChoiceCard } from "./choice-card"
import { PlayerBackdrop } from "./player-backdrop"
import { PlayerFooter } from "./player-footer"


interface StoryPlayerProps {
  story: Story;
  initialVoiceId?: string;
}

export function StoryPlayer({ story, initialVoiceId }: StoryPlayerProps) {

  const nodes = story.chapters[0]?.content.nodes ?? {};
  const initialNodeId = story.chapters[0]?.content.initialNodeId ?? '';
  
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
    seekTo,
  } = useStoryPlayer({
    initialNodeId: initialNodeId,
    nodes: storyNodes
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
  const { recordProgress } = useListeningProgress();

  const generatingNodes = useRef(new Set<string>());
  const unavailableNodes = useRef(new Set<string>());

  // Keep the home page "Continue listening" rail in sync with playback
  useEffect(() => {
    const chapter = getProgressChapterNumber(
      storyNodes,
      initialNodeId,
      currentNode.id,
      story.totalChapters,
    );
    recordProgress({
      storyId: story.id,
      nodeId: currentNode.id,
      percent: story.totalChapters > 0 ? (chapter / story.totalChapters) * 100 : 0,
      chapterLabel: `Chapter ${chapter} of ${story.totalChapters}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode.id]);

  useEffect(() => {
    if (!hasPreRecordedAudio(story.label) && selectedVoice === 'default' && !isLoadingVoices) {
      const firstVoice = (voices ?? [])[0]?.voice_id;
      if (firstVoice) {
        setSelectedVoice(firstVoice);
      }
    }
  }, [story.label, selectedVoice, isLoadingVoices, voices]);

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
    if (generatingNodes.current.has(id)) {
      return;
    }

    const unavailableKey = `${id}:${selectedVoice}`;
    if (unavailableNodes.current.has(unavailableKey)) {
      return;
    }

    const node = storyNodes[id];

    if (!node?.text || !selectedVoice) {
      return;
    }
    
    if (node.audioUrl && node.voiceId === selectedVoice) {
      return;
    }

    try {
      setIsGeneratingSpeech(true);
      generatingNodes.current.add(id);
      
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

      if (selectedVoice === 'default') {
        unavailableNodes.current.add(unavailableKey);
        return;
      }

      const audioUrl = await previewVoice(selectedVoice, node.text);

      const updatedNode: ContentNode = {
        ...node,
        audioUrl,
        voiceId: selectedVoice,
      };

      if (id === currentNode.id) {
        setCurrentNode(updatedNode);
      }
      
      setStoryNodes(prev => ({
        ...prev,
        [id]: updatedNode
      }));
    } catch (error) {
      console.error('Error generating speech:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate speech';
      toast.error(errorMessage);
      
      generatingNodes.current.delete(id);
      
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

      unavailableNodes.current.add(unavailableKey);
    } finally {
      generatingNodes.current.delete(id);
      setIsGeneratingSpeech(false);
    }
  }, [selectedVoice, setCurrentNode, currentNode.id, storyNodes, story.label]);

  useEffect(() => {
    const node = storyNodes[initialNodeId];
    if (node && selectedVoice && (!node.audioUrl || node.voiceId !== selectedVoice)) {
      void generateNodeSpeech(initialNodeId);
    }
  }, [selectedVoice, initialNodeId, storyNodes, generateNodeSpeech]);

  useEffect(() => {
    if (!isPlaying || isGeneratingSpeech) return;
    if (!audioRef.current || audioRef.current.ended) return;

    const nextNodeIds = new Set<string>();

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
    else if (currentNode.nextNodeId) {
      const nextNode = storyNodes[currentNode.nextNodeId];
      if (nextNode && (!nextNode.audioUrl || nextNode.voiceId !== selectedVoice)) {
        nextNodeIds.add(currentNode.nextNodeId);
      }
    }

    if (nextNodeIds.size > 0) {
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

  const isElevenLabsNode = (node: ContentNode): node is ElevenLabsContentNode => 
    node.voiceId !== 'default';

  const audioTimingsProps =
    currentNode.voiceId === 'default' || (isElevenLabsNode(currentNode) && (!currentNode.wordTimings || currentNode.wordTimings.length === 0))
      ? {
          audioUrl: currentNode.audioUrl ?? '',
          text: currentNode.text,
          provider: 'openai' as const,
        }
      : {
          audioUrl: currentNode.audioUrl ?? '',
          text: currentNode.text,
          provider: 'elevenlabs' as const,
          wordTimings: (currentNode as ElevenLabsContentNode).wordTimings!,
        };

  const {
    wordTimings,
    duration: timingsDuration,
    syncMode,
    isLoading: isLoadingTimings,
    error: timingsError,
  } = useAudioTimings(audioTimingsProps);

  const isLoading = isGeneratingSpeech || (isLoadingTimings && currentNode.audioUrl);
  const showLoadingUI = isLoading && !isPlaying && (!currentNode.audioUrl || currentNode.voiceId !== selectedVoice);

  useEffect(() => {
    if (timingsError) {
      console.error('Error loading audio timings:', timingsError);
    }
  }, [timingsError]);

  if (!story.chapters[0]) {
    return <div>No chapters available</div>;
  }

  const isCapturing = selectedChoice !== null && !isTransitioning;
  const isMakingChoice = selectedChoice !== null && isTransitioning;
  const shouldDisablePlayback = !isAudioReady || (isGeneratingSpeech && currentNode.voiceId !== selectedVoice);
  const showChoices = currentNode.choices && currentNode.choices.length > 0 && shouldShowChoices(currentNode) && !isPlaying;

  const nodeLocalTime = Math.max(0, currentTime - cumulativeTime);
  const audioDuration = audioRef.current?.duration ?? 0;
  const progressPercent = audioDuration > 0
    ? (nodeLocalTime / audioDuration) * 100
    : canReplay && currentTime > 0 ? 100 : 0;

  const progressChapter = getProgressChapterNumber(
    storyNodes,
    initialNodeId,
    currentNode.id,
    story.totalChapters,
  );
  const chapterLabel = `Chapter ${progressChapter} of ${story.totalChapters}`;
  const hasPreRecorded = hasPreRecordedAudio(story.label);

  return (
    <div className="flex min-h-full flex-col bg-transparent">
      <PlayerBackdrop coverUrl={story.coverUrl} />
      <PageContainer wide className="flex flex-grow flex-col gap-8 py-8 md:py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/story/${story.id}`}
              aria-label="Back to story details"
              className="glow-focus flex size-11 shrink-0 items-center justify-center rounded-full glass-card text-primary transition-transform hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </Link>
            <div>
              <h1 className="font-headline-lg text-headline-lg-mobile text-primary md:text-headline-lg">
                {story.title}
              </h1>
              <p className="mt-0.5 font-body-md text-body-md italic text-on-surface-variant opacity-80">
                By {story.author}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <section className="flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-[400px] lg:max-w-none">
              <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-xl bg-ink-blue/10 blur-xl" />
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl book-frame bg-surface-container-lowest shadow-2xl ring-2 ring-primary/10 transition-transform duration-500 hover:scale-[1.02] md:rounded-xl">
                <Image
                  src={story.coverUrl}
                  alt={story.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 400px, 420px"
                  priority
                />
                {showLoadingUI && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                    <p className="flex items-center gap-2 font-label-lg text-label-lg text-on-surface-variant">
                      <Loader2 className="size-4 animate-spin" />
                      {isGeneratingSpeech ? 'Generating speech...' : 'Loading audio...'}
                    </p>
                  </div>
                )}
                <div className="absolute inset-0 paper-texture opacity-20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent md:hidden" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:hidden">
                  <h2 className="font-headline-md text-headline-md text-white drop-shadow-md">{story.title}</h2>
                </div>
              </div>
              {isGeneratingSpeech && (
                <div className="absolute -right-2 -top-2 flex items-center gap-2 rounded-full border border-outline-variant/30 bg-surface px-4 py-2 shadow-lg">
                  <Sparkles className="size-4 text-tertiary" />
                  <span className="font-label-lg text-label-lg text-primary">Generating...</span>
                </div>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-6 lg:col-span-7">
            <div className="glass-card paper-texture relative min-h-[280px] overflow-hidden rounded-[32px] border-outline-variant/20 p-8 shadow-sm md:min-h-[400px] md:p-10">
              {showLoadingUI && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/80 backdrop-blur-sm">
                  <p className="flex items-center gap-2 font-body-md text-on-surface-variant">
                    <Loader2 className="size-4 animate-spin" />
                    {isGeneratingSpeech ? 'Generating speech...' : 'Loading audio...'}
                  </p>
                </div>
              )}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 animate-pulse rounded-full bg-tertiary shadow-[0_0_8px_rgba(112,93,0,0.6)]" />
                  <span className="font-label-lg text-label-lg uppercase tracking-widest text-on-surface-variant">
                    {isPlaying ? 'Narration Active' : 'Ready to Listen'}
                  </span>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-lowest/80 px-4 py-2 font-label-lg text-label-lg text-primary">
                  <Mic className="size-4" />
                  {hasPreRecorded && selectedVoice === 'default' ? 'Pre-Recorded' : 'AI Voice'}
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentNode.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  className="h-full"
                >
                  <HighlightedText
                    text={currentNode.text}
                    currentTime={nodeLocalTime}
                    audioDuration={audioDuration || timingsDuration}
                    wordTimings={wordTimings}
                    syncMode={syncMode}
                    isPlaying={isPlaying}
                    audioRef={audioRef}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Select
                value={selectedVoice}
                onValueChange={setSelectedVoice}
                disabled={isLoadingVoices || isGeneratingSpeech || isPlaying || undefined}
              >
                <SelectTrigger className="glass-card h-12 min-w-[200px] rounded-full font-label-lg text-label-lg shadow-sm hover:bg-surface-container-high/60 focus:ring-2 focus:ring-tertiary-fixed/60">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    <span className="font-body-md">Pre-Recorded</span>
                  </SelectItem>
                  {(voices ?? []).map((voice) => (
                    <SelectItem key={voice.voice_id} value={voice.voice_id}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>
        </div>

        <div className={cn(
          "w-full transition-all duration-300",
          showChoices ? "min-h-[12rem]" : "min-h-0",
        )}>
          {showChoices ? (
            <div className="flex flex-col items-center gap-6">
              <BlurFade show duration={1.0} delay={0.1} direction="down" offset={12} inView useLayout>
                <div className="flex flex-col items-center gap-3 text-center">
                  {isProcessing || isCapturing || isMakingChoice ? (
                    <ChoiceStatus
                      isProcessing={isProcessing}
                      isCapturing={isCapturing}
                      isMakingChoice={isMakingChoice}
                    />
                  ) : (
                    <>
                      <h3 className="font-headline-md text-headline-md text-primary">
                        What should our hero do next?
                      </h3>
                      <VoiceControl
                        isListening={isListening}
                        hasPermission={hasPermission}
                        onRequestPermission={requestPermission}
                        onStartRecording={startRecording}
                        onStopRecording={stopRecording}
                      />
                    </>
                  )}
                </div>
              </BlurFade>
              <StaggerGroup
                inView={false}
                stagger={0.09}
                className={cn(
                  "grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2",
                  isTransitioning && "pointer-events-none opacity-0 transition-opacity duration-300",
                )}
              >
                {currentNode.choices?.map((choice, index) => (
                  <StaggerItem key={`choice-${choice.text}`} variant="scaleIn">
                    <ChoiceCard
                      text={choice.text}
                      index={index}
                      selected={selectedChoice === index}
                      dimmed={selectedChoice !== null && selectedChoice !== index}
                      disabled={selectedChoice !== null && selectedChoice !== index}
                      onClick={() => handleChoiceClick(index)}
                    />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          ) : null}
        </div>
      </PageContainer>

      {!showChoices && (
        <PlayerFooter
          isPlaying={isPlaying}
          currentTime={nodeLocalTime}
          duration={audioDuration}
          progressPercent={progressPercent}
          chapterLabel={chapterLabel}
          disabled={shouldDisablePlayback}
          seekDisabled={shouldDisablePlayback || audioDuration <= 0}
          canReplay={canReplay}
          onPlayPause={playPause}
          onReplay={replay}
          onSeek={seekTo}
        />
      )}

      <AudioPlayer
        node={currentNode}
        isPlaying={isPlaying}
        audioRef={audioRef}
        onTimeUpdate={onTimeUpdate}
      />
    </div>
  );
}
