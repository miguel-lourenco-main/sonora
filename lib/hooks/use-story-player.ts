import { useCallback, useEffect, useRef, useState } from 'react';
import { ContentNode } from '../types';

interface UseStoryPlayerProps {
  initialNodeId: string;
  nodes: Record<string, ContentNode>;
}

export function useStoryPlayer({ initialNodeId, nodes }: UseStoryPlayerProps) {
  const [currentNode, setCurrentNode] = useState<ContentNode>(() => {
    const node = nodes[initialNodeId];
    if (!node) {
      throw new Error(`Node with id ${initialNodeId} not found`);
    }
    return node;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [canReplay, setCanReplay] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const previousNodeDuration = useRef<number>(0);
  const lastNodeEndTime = useRef<number>(0);
  const isTransitioning = useRef<boolean>(false);

  const onTimeUpdate = useCallback(() => {
    if (!audioRef.current || isTransitioning.current) return;
    
    const rawTime = audioRef.current.currentTime;
    const totalTime = lastNodeEndTime.current + rawTime;
    console.log('⏱️ Time:', {
      raw: rawTime.toFixed(2),
      lastNodeEnd: lastNodeEndTime.current.toFixed(2),
      total: totalTime.toFixed(2),
      audioDuration: audioRef.current.duration?.toFixed(2),
      audioCurrentTime: audioRef.current.currentTime.toFixed(2),
      nodeId: currentNode.id
    });
    setCurrentTime(totalTime);

    // Check if audio has ended
    if (rawTime >= audioRef.current.duration) {
      console.log('📍 Audio ended:', {
        nodeId: currentNode.id,
        duration: audioRef.current.duration.toFixed(2),
        hasChoices: !!currentNode.choices,
        nextNodeId: currentNode.nextNodeId
      });
      
      setIsPlaying(false);
      setCanReplay(true);
      
      // If there are no choices and there's a next node, transition automatically
      if (!currentNode.choices && currentNode.nextNodeId) {
        const nextNode = nodes[currentNode.nextNodeId];
        if (nextNode) {
          isTransitioning.current = true;
          // Update cumulative time before changing nodes
          const duration = audioRef.current.duration;
          previousNodeDuration.current = duration;
          const newEndTime = lastNodeEndTime.current + duration;
          
          console.log('🔄 Auto Transition:', {
            from: currentNode.id,
            to: nextNode.id,
            previousEnd: lastNodeEndTime.current.toFixed(2),
            duration: duration.toFixed(2),
            newEnd: newEndTime.toFixed(2)
          });
          
          lastNodeEndTime.current = newEndTime;
          
          // Change to next node
          setTimeout(() => {
            setCurrentNode(nextNode);
            setCanReplay(false);
            setIsAudioReady(false);
            isTransitioning.current = false;
          }, 0);
        }
      }
    }
  }, [currentNode, nodes]);

  const makeChoice = useCallback((choiceIndex: number) => {
    if (!currentNode.choices?.[choiceIndex] || isTransitioning.current) return;

    const nextNodeId = currentNode.choices[choiceIndex].nextNodeId;
    const nextNode = nodes[nextNodeId];
    if (!nextNode) return;

    isTransitioning.current = true;

    // Update cumulative time before changing nodes
    if (audioRef.current) {
      const duration = audioRef.current.duration || previousNodeDuration.current;
      const newEndTime = lastNodeEndTime.current + duration;
      
      console.log('🔄 Choice Transition:', {
        from: currentNode.id,
        to: nextNode.id,
        previousEnd: lastNodeEndTime.current.toFixed(2),
        duration: duration.toFixed(2),
        newEnd: newEndTime.toFixed(2),
        audioCurrentTime: audioRef.current.currentTime.toFixed(2)
      });
      
      lastNodeEndTime.current = newEndTime;
    }

    setCurrentNode(nextNode);
    setIsPlaying(false);
    setCanReplay(false);
    setIsAudioReady(false);
    isTransitioning.current = false;
  }, [currentNode, nodes]);

  const playPause = useCallback(() => {
    if (!audioRef.current || isTransitioning.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      void audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const replay = useCallback(() => {
    if (!audioRef.current || isTransitioning.current) return;

    console.log('🔁 Replay:', {
      nodeId: currentNode.id,
      lastNodeEnd: lastNodeEndTime.current.toFixed(2),
      previousDuration: previousNodeDuration.current.toFixed(2)
    });

    const initialNode = nodes[initialNodeId];
    if (!initialNode) return;
    
    console.log('🔁 Replay - Initial Node State:', { 
      nodeId: initialNode.id,
      hasAudio: !!initialNode.audioUrl,
      voiceId: initialNode.voiceId
    });
    
    // Reset all state
    audioRef.current.currentTime = 0;
    setCurrentNode(initialNode);
    setCurrentTime(0);
    previousNodeDuration.current = 0;
    lastNodeEndTime.current = 0;
    setIsPlaying(false);
    setCanReplay(false);
    
    // Set audio ready state based on whether we have valid audio
    const hasValidAudio = !!initialNode.audioUrl;
    console.log('🔁 Replay - Audio State:', { hasValidAudio });
    setIsAudioReady(hasValidAudio);
  }, [currentNode.id, initialNodeId, nodes]);

  const shouldShowChoices = useCallback((node: ContentNode) => {
    if (!node.choices) return false;
    if (!audioRef.current) return false;
    return audioRef.current.ended && !isPlaying;
  }, [isPlaying]);

  // Reset audio position when node changes
  useEffect(() => {
    if (audioRef.current) {
      console.log('⏮️ Reset Position:', {
        nodeId: currentNode.id,
        previousTime: audioRef.current.currentTime.toFixed(2),
        lastNodeEnd: lastNodeEndTime.current.toFixed(2)
      });
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCanReplay(false);
    // Only set isAudioReady to false if we don't have audio yet
    if (!currentNode.audioUrl) {
      console.log('🎵 Audio not ready:', {
        nodeId: currentNode.id,
        audioUrl: currentNode.audioUrl
      });
      setIsAudioReady(false);
    }
  }, [currentNode]);

  // Handle audio loading
  useEffect(() => {
    if (!audioRef.current || !currentNode.audioUrl) return;

    const audio = audioRef.current;
    
    const handleCanPlay = () => {
      console.log('🎵 Audio Ready:', {
        nodeId: currentNode.id,
        duration: audio.duration?.toFixed(2),
        lastNodeEnd: lastNodeEndTime.current.toFixed(2)
      });
      setIsAudioReady(true);
      // Auto-play for non-initial nodes
      if (currentNode.id !== initialNodeId) {
        void audio.play();
        setIsPlaying(true);
      }
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.src = currentNode.audioUrl;

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentNode.audioUrl, currentNode.id, initialNodeId]);

  return {
    currentNode,
    setCurrentNode,
    isPlaying,
    currentTime,
    cumulativeTime: lastNodeEndTime.current,
    onTimeUpdate,
    playPause,
    makeChoice,
    audioRef,
    shouldShowChoices,
    isAudioReady,
    setIsAudioReady,
    canReplay,
    replay,
  };
}


