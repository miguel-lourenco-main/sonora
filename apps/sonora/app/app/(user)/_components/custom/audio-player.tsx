"use client"

import { useEffect } from "react"
import { ContentNode } from "~/lib/types"
import { dataUrlToBlob } from "~/lib/utils/audio"

interface AudioPlayerProps {
  node: ContentNode
  isPlaying: boolean
  audioRef: React.RefObject<HTMLAudioElement | null>
  onTimeUpdate?: () => void
}

export function AudioPlayer({ 
  node, 
  audioRef,
  isPlaying,
  onTimeUpdate 
}: AudioPlayerProps) {

  // Effect for setting up audio source
  useEffect(() => {
    if (!audioRef.current || !node.audioUrl) return;

    const audio = audioRef.current;
    let blobUrl: string | null = null;
    
    // Convert data URL to blob URL if needed
    if (node.audioUrl.startsWith('data:')) {
      try {
        blobUrl = dataUrlToBlob(node.audioUrl);
        audio.src = blobUrl;
      } catch (error) {
        console.error('Failed to convert data URL to blob:', error);
        audio.src = node.audioUrl;
      }
    } else {
      audio.src = node.audioUrl;
    }

    // Log initial audio state
    console.log('🎵 [mount] Audio player mounted:', {
      src: audio.src.slice(0, 50) + '...',
      duration: audio.duration,
      readyState: audio.readyState,
      networkState: audio.networkState,
      paused: audio.paused,
      isPlaying
    });

    // Add event listeners for debugging
    const handleLoadedMetadata = () => {
      console.log('🎵 [loadedmetadata] Audio metadata loaded:', {
        duration: audio.duration,
        readyState: audio.readyState,
        networkState: audio.networkState,
        paused: audio.paused
      });
    };

    const handleDurationChange = () => {
      console.log('🎵 [durationchange] Audio duration changed:', {
        duration: audio.duration,
        readyState: audio.readyState,
        networkState: audio.networkState,
        paused: audio.paused
      });
    };

    const handleLoadStart = () => {
      console.log('🎵 [loadstart] Audio loading started:', {
        duration: audio.duration,
        readyState: audio.readyState,
        networkState: audio.networkState,
        paused: audio.paused
      });
    };

    const handleCanPlay = () => {
      console.log('🎵 [canplay] Audio can start playing:', {
        duration: audio.duration,
        readyState: audio.readyState,
        networkState: audio.networkState,
        paused: audio.paused
      });
    };

    const handleCanPlayThrough = () => {
      console.log('🎵 [canplaythrough] Audio can play through:', {
        duration: audio.duration,
        readyState: audio.readyState,
        networkState: audio.networkState,
        paused: audio.paused
      });
    };

    const handleError = () => {
      console.error('❌ [error] Audio error:', {
        error: audio.error,
        errorCode: audio.error?.code,
        errorMessage: audio.error?.message,
        networkState: audio.networkState,
        readyState: audio.readyState
      });
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleError);
      
      // Clean up blob URL
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
      
      console.log('🎵 [cleanup] Audio player cleanup');
    };
  }, [audioRef, node.audioUrl]); // Only re-run when audio source changes

  // Separate effect for handling play/pause state
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    console.log('🎵 [playback] Setting playback state:', {
      isPlaying,
      currentTime: audio.currentTime,
      paused: audio.paused,
      readyState: audio.readyState
    });

    if (isPlaying && audio.paused) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('❌ [error] Failed to play audio:', error);
        });
      }
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [isPlaying, audioRef]);

  // Separate effect for time updates
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      console.log('🎵 [timeupdate] Time updated:', {
        currentTime: audio.currentTime.toFixed(2),
        duration: audio.duration?.toFixed(2) ?? 'undefined',
        readyState: audio.readyState,
        networkState: audio.networkState,
        paused: audio.paused,
        isPlaying
      });
      onTimeUpdate?.();
    };

    const interval = window.setInterval(() => {
      if (isPlaying && audio.currentTime > 0) {
        handleTimeUpdate();
      }
    }, 16); // ~60fps

    return () => {
      window.clearInterval(interval);
    };
  }, [audioRef, onTimeUpdate, isPlaying]);

  return (
    <audio
      ref={audioRef}
      autoPlay={false}
      preload="auto"
      hidden
    />
  );
} 