"use client";

import { Button } from "@kit/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Mic, Square } from "lucide-react";
import { cn } from "@kit/ui/lib";
import { VOICE_MAX_DURATION } from "~/lib/constants";
import { toast } from "sonner";
import { convertAudioToWav } from "~/lib/utils/audio-converter";

interface AudioFilesRecorderProps {
    onRecordAudioFile: (blob: Blob) => void;
    onStopRecording: () => void;
    maxDuration: number;
    goBack: () => void;
}

export default function AudioFilesRecorder({ 
    onRecordAudioFile,
    onStopRecording,
    maxDuration = VOICE_MAX_DURATION,
    goBack
}: AudioFilesRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [audioLevels, setAudioLevels] = useState<number[]>(Array(20).fill(0));
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | undefined>(undefined);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const startRecording = useCallback(async (e?: React.MouseEvent<HTMLButtonElement>) => {
        if (e) {
            e.stopPropagation();
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm'
            });
            mediaRecorderRef.current = mediaRecorder;

            // Setup audio analysis
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;
            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            // Handle audio data
            mediaRecorder.ondataavailable = (e) => {
                chunksRef.current.push(e.data);
            };

            // Start recording
            chunksRef.current = [];
            mediaRecorder.start(100); // Collect data every 100ms
            setIsRecording(true);

            // Start timer
            timerRef.current = setInterval(() => {
                setDuration(d => {
                    if (d >= maxDuration) {
                        void stopRecording();
                        return maxDuration;
                    }
                    return d + 1;
                });
            }, 1000);

            // Start visualizer
            const updateLevels = () => {
                if (!analyser) return;
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(dataArray);
                
                // Calculate audio levels for visualization
                const levels = Array(20).fill(0).map((_, i) => {
                    const start = Math.floor(i * dataArray.length / 20);
                    const end = Math.floor((i + 1) * dataArray.length / 20);
                    const segment = dataArray.slice(start, end);
                    return segment.reduce((a, b) => a + b, 0) / segment.length / 255;
                });
                
                setAudioLevels(levels);
                animationFrameRef.current = requestAnimationFrame(updateLevels);
            };
            
            updateLevels();
        } catch (err) {
            console.error('Failed to start recording:', err);
            toast.error('Failed to start recording');
        }
    }, [maxDuration]);

    const cleanup = useCallback(() => {
        if (audioContextRef.current) {
            void audioContextRef.current.close();
            audioContextRef.current = null;
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = undefined;
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = undefined;
        }
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            mediaRecorderRef.current = null;
        }
    }, []);

    const stopRecording = useCallback(async (e?: React.MouseEvent<HTMLButtonElement>) => {
        if (e) {
            e.stopPropagation();
        }
        
        if (!isRecording) return;

        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            const webmBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
            
            try {
                // Convert webm to wav
                const wavBlob = await convertAudioToWav(webmBlob);
                onRecordAudioFile(wavBlob);
            } catch (error) {
                console.error('Failed to convert audio:', error);
                toast.error('Failed to process audio recording');
            }
        }

        cleanup();
        setIsRecording(false);
        setDuration(0);
        setAudioLevels(Array(20).fill(0));
        onStopRecording();
    }, [onRecordAudioFile, onStopRecording, isRecording, cleanup]);

    // Auto-stop recording when reaching max duration
    useEffect(() => {
        if (duration >= (maxDuration ?? VOICE_MAX_DURATION)) {
            void stopRecording();
        }
    }, [duration, maxDuration, stopRecording]);

    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);

    return (
        <div className="flex flex-col size-full items-center space-y-6 p-4">
            <div className="flex flex-col w-full items-center">
                <Button className="self-start" variant="ghost" size="icon" 
                    onClick={(e) => {
                        e.stopPropagation();
                        goBack();
                }}>
                    <ArrowLeft className="size-4" />
                </Button>
                <Button
                    variant={isRecording ? "destructive" : "default"}
                    size="lg"
                    shape="circle"
                    onClick={(e) => isRecording ? stopRecording(e) : startRecording(e)}
                    className={cn("gap-2", isRecording && "animate-pulse")}
                >
                    {isRecording ? <Square className="size-4" /> : <Mic className="size-4" />}
                </Button>
            </div>

            <div className="flex items-end gap-0.5 h-16 w-full max-w-24">
                {audioLevels.map((level, i) => (
                    <div
                        key={i}
                        className="w-full bg-primary/80"
                        style={{
                            height: `${Math.max(4, level * 100)}%`,
                            transition: 'height 100ms ease'
                        }}
                    />
                ))}
            </div>

            <div className="text-lg font-medium">
                {`${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')} / ${Math.floor(maxDuration / 60)}:${(maxDuration % 60).toString().padStart(2, '0')}`}
            </div>
        </div>
    );
}