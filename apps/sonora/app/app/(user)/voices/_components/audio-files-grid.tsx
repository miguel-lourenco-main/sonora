import { Button } from "@kit/ui/button";
import { TrackableFile } from "@kit/ui/interfaces";
import { Download, Play, Square, Trash2Icon } from "lucide-react";
import { formatFileSize } from "@kit/ui/lib";
import { useCallback, useState, useRef, useEffect } from "react";
import { cn } from "@kit/ui/lib";
import { VOICE_MIN_DURATION, VOICE_RECOMMENDED_DURATION, VOICE_MAX_DURATION, formatDuration } from "~/lib/constants";

interface AudioFileItemProps {
    audioFile: TrackableFile;
    onRemove: (file: TrackableFile[]) => void;
    onDurationLoad: (duration: number, fileId: string) => void;
    onValidityChange: (fileId: string, isValid: boolean) => void;
}

const AudioFileItem = ({ audioFile, onRemove, onDurationLoad, onValidityChange }: AudioFileItemProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        const url = URL.createObjectURL(audioFile.fileObject);
        setAudioUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [audioFile]);

    const handlePlayPause = useCallback(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                void audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handleEnded = () => setIsPlaying(false);
            audio.addEventListener('ended', handleEnded);
            return () => audio.removeEventListener('ended', handleEnded);
        }
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handleLoadedMetadata = () => {
                setDuration(audio.duration);
                onDurationLoad(audio.duration, audioFile.fileObject.name);
            };
            
            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            return () => audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        }
    }, [onDurationLoad, audioFile.fileObject.name]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handleError = () => {
                setIsValid(false);
                onValidityChange(audioFile.fileObject.name, false);
            };
            
            audio.addEventListener('error', handleError);
            return () => audio.removeEventListener('error', handleError);
        }
    }, [audioFile.fileObject.name, onValidityChange]);

    useEffect(() => {
        const isValidDuration = duration >= VOICE_MIN_DURATION && duration <= VOICE_MAX_DURATION;
        onValidityChange(audioFile.fileObject.name, isValidDuration && isValid);
    }, [duration, isValid, audioFile.fileObject.name, onValidityChange]);

    const handleDownload = () => {
        if (audioUrl) {
            const link = document.createElement('a');
            link.href = audioUrl;
            link.download = audioFile.fileObject.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className={cn(
            "flex items-center justify-between p-2 rounded-md",
            (!isValid || duration < VOICE_MIN_DURATION || duration > VOICE_MAX_DURATION)
                ? "bg-destructive/10" 
                : "bg-muted/50"
        )}>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePlayPause}
                    className="h-8 w-8"
                >
                    {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <div className="flex flex-col">
                    <div className="text-sm font-medium">{audioFile.fileObject.name}</div>
                    <div className="text-xs text-muted-foreground">
                        {formatFileSize(audioFile.fileObject.size)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Duration: {formatDuration(Math.round(duration))}
                    </div>
                </div>
            </div>
            {duration > 0 && (
                <>
                    {duration < VOICE_MIN_DURATION && (
                        <span className="text-xs text-destructive">
                            Too short (min {formatDuration(VOICE_MIN_DURATION)})
                        </span>
                    )}
                    {duration > VOICE_MAX_DURATION && (
                        <span className="text-xs text-destructive">
                            Too long (max {formatDuration(VOICE_MAX_DURATION)})
                        </span>
                    )}
                    {duration < VOICE_RECOMMENDED_DURATION && duration >= VOICE_MIN_DURATION && (
                        <span className="text-xs text-warning">
                            Recommended {formatDuration(VOICE_RECOMMENDED_DURATION)}+
                        </span>
                    )}
                </>
            )}
            {!isValid && (
                <span className="text-xs text-destructive">
                    Invalid audio file
                </span>
            )}
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDownload}
                    className="h-8 w-8"
                >
                    <Download className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove([audioFile])}
                    className="h-8 w-8"
                >
                    <Trash2Icon className="h-4 w-4" />
                </Button>
            </div>
            <audio ref={audioRef} src={audioUrl ?? undefined} />
        </div>
    );
};

interface AudioFilesGridProps {
    audioFiles: TrackableFile[];
    onAudioFileRemove: (audioFile: TrackableFile[]) => void;
    onDeleteAll: () => void;
    onDurationLoad: (duration: number, fileId: string) => void;
    onValidityChange: (fileId: string, isValid: boolean) => void;
    totalDuration: number;
    disabled?: boolean;
}

export default function AudioFilesGrid({ 
    audioFiles, 
    onAudioFileRemove,
    onDeleteAll,
    onDurationLoad,
    onValidityChange,
    totalDuration,
    disabled 
}: AudioFilesGridProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [audioFiles.length]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">
                        Audio Samples
                        <span className="ml-2 text-sm text-muted-foreground">
                            ({audioFiles.length}/25)
                        </span>
                    </h3>
                </div>
                {audioFiles.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onDeleteAll}
                        disabled={disabled}
                    >
                        Delete All
                    </Button>
                )}
            </div>

            {/* Fixed height container with scroll for audio files */}
            <div className="h-[250px] overflow-y-auto border rounded-lg bg-muted/5">
                {audioFiles.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                        No audio samples added
                    </div>
                ) : (
                    <div className="space-y-2 p-2">
                        {audioFiles.map((audioFile) => (
                            <AudioFileItem
                                key={audioFile.fileObject.name}
                                audioFile={audioFile}
                                onRemove={onAudioFileRemove}
                                onDurationLoad={onDurationLoad}
                                onValidityChange={onValidityChange}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Duration info - only show when files exist */}
            {audioFiles.length > 0 && (
                <div className="text-sm text-muted-foreground">
                    Total Duration: {Math.floor(totalDuration / 60)}:{Math.floor(totalDuration % 60).toString().padStart(2, '0')}
                </div>
            )}
        </div>
    );
}