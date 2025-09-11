import { useCallback, useState, useRef } from "react";
import { Dispatch, SetStateAction } from "react";
import { VOICE_FILES_SUPPORTED_TYPES } from "~/lib/constants";
import FilesDragNDrop from "@kit/ui/files-drag-n-drop";
import { FileHandlers, TrackableFile } from "@kit/ui/interfaces";
import AudioFilesRecorder from "./audio-files-recorder";
import { Button } from "@kit/ui/button";
import AudioFilesGrid from "./audio-files-grid";
import { Textarea } from "@kit/ui/textarea";
import { VOICE_MAX_DURATION, VOICE_MAX_SAMPLES } from "~/lib/constants";
import { AudioFileUploadGuide } from "./audio-file-upload-guide";
import { toast } from "sonner";
import { Loader2, Check, X } from "lucide-react";
import { cn } from "@kit/ui/lib";
import { useTranslation } from "react-i18next";

interface AudioFilesUploaderProps {
    audioFiles?: TrackableFile[];
    setAudioFiles?: Dispatch<SetStateAction<TrackableFile[]>>;
    disabled?: boolean;
    maxDuration?: number;
    onAddFiles?: (files: TrackableFile[]) => void;
    onRemoveFiles?: (files: TrackableFile[]) => void;
    onSubmit?: (data: { 
        name: string; 
        description: string; 
        files: TrackableFile[]; 
    }) => Promise<void>;
    onSuccess?: () => void;
}

const getUniqueFileName = (fileName: string, existingFiles: TrackableFile[]): string => {
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
    const extension = fileName.slice(fileName.lastIndexOf('.'));
    let count = 1;
    let newName = fileName;

    while (existingFiles.some(file => file.fileObject.name === newName)) {
        newName = `${nameWithoutExt} (${count})${extension}`;
        count++;
    }

    return newName;
};

const MAX_SAMPLES = 25;

export function AudioFilesUploader({
    audioFiles: externalAudioFiles,
    setAudioFiles: externalSetAudioFiles,
    disabled,
    maxDuration = VOICE_MAX_DURATION,
    onAddFiles,
    onRemoveFiles,
    onSubmit,
    onSuccess,
}: AudioFilesUploaderProps) {
    
    const [internalAudioFiles, setInternalAudioFiles] = useState<TrackableFile[]>([]);
    const audioFiles = externalAudioFiles ?? internalAudioFiles;
    const [recording, setRecording] = useState(false);
    const [totalDuration, setTotalDuration] = useState(0);
    const durationsMapRef = useRef<Map<string, number>>(new Map());
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const STATUS_DURATION = 3000;
    const [invalidFiles, setInvalidFiles] = useState<Set<string>>(new Set());

    const handleDurationLoad = useCallback((duration: number, fileId: string) => {
        if (!fileId) return;
        
        durationsMapRef.current.set(fileId, duration);
        
        // Calculate total duration from all files
        const total = Array.from(durationsMapRef.current.values())
            .reduce((sum, duration) => sum + duration, 0);
        
        setTotalDuration(total);
    }, []);

    const setFiles = useCallback((newFiles: SetStateAction<TrackableFile[]>) => {
        const updatedFiles = typeof newFiles === 'function' ? newFiles(audioFiles) : newFiles;
        if (externalSetAudioFiles) {
            externalSetAudioFiles(updatedFiles);
        } else {
            setInternalAudioFiles(updatedFiles);
        }
    }, [externalSetAudioFiles, audioFiles]);

    const fileHandlers: FileHandlers = {
        handleDeleteAll: useCallback(() => {
            setFiles([]);
            durationsMapRef.current.clear();
            setTotalDuration(0);
            setInvalidFiles(new Set());
        }, [setFiles]),

        handleAddFiles: useCallback((newFiles: TrackableFile[]) => {
            // Check if adding these files would exceed the limit
            if (audioFiles.length + newFiles.length > VOICE_MAX_SAMPLES) {
                toast.error(`Cannot add more than ${VOICE_MAX_SAMPLES} audio samples`);
                return;
            }

            // First, ensure unique filenames for all new files
            const filesWithUniqueNames = newFiles.map(file => {
                const uniqueFileName = getUniqueFileName(file.fileObject.name, audioFiles);
                return uniqueFileName === file.fileObject.name 
                    ? file 
                    : {
                        ...file,
                        fileObject: new File([file.fileObject], uniqueFileName, {
                            type: file.fileObject.type
                        })
                    };
            });

            // Process all files at once
            const processFiles = async () => {
                const processedFiles: TrackableFile[] = [];

                for (const file of filesWithUniqueNames) {
                    try {
                        const audio = new Audio(URL.createObjectURL(file.fileObject));
                        await new Promise((resolve, reject) => {
                            audio.addEventListener('loadedmetadata', () => {
                                if (audio.duration > maxDuration) {
                                    reject(Error(`Audio sample "${file.fileObject.name}" exceeds ${Math.floor(maxDuration / 60)} minutes`));
                                    return;
                                }
                                resolve(audio.duration);
                            });
                            audio.addEventListener('error', () => reject(Error('Error loading audio')));
                        });
                        processedFiles.push(file);
                    } catch (error) {
                        toast.error(error as string);
                    }
                }

                if (processedFiles.length > 0) {
                    if (onAddFiles) {
                        onAddFiles(processedFiles);
                    } else {
                        setFiles(prev => [...prev, ...processedFiles]);
                    }
                }
            };

            void processFiles().catch(error => {
                console.error('Error processing files:', error);
                toast.error('Failed to process audio files');
            });
        }, [maxDuration, onAddFiles, setFiles, audioFiles]),

        handleFileRemove: useCallback((filterFiles: TrackableFile[]) => {
            filterFiles.forEach(file => {
                const fileId = file.fileObject.name;
                durationsMapRef.current.delete(fileId);
                setInvalidFiles(prev => {
                    const next = new Set(prev);
                    next.delete(fileId);
                    return next;
                });
            });
            
            const total = Array.from(durationsMapRef.current.values())
                .reduce((sum, duration) => sum + duration, 0);
            setTotalDuration(total);

            if (onRemoveFiles) {
                onRemoveFiles(filterFiles);
            } else {
                setFiles(prevFiles => prevFiles.filter(file => !filterFiles.includes(file)));
            }
        }, [setFiles, onRemoveFiles])
    };

    const handleRecordedAudio = useCallback((audioBlob: Blob) => {
        const file = new File([audioBlob], `recording-${Date.now()}.webm`, {
            type: 'audio/webm'
        });
        
        fileHandlers.handleAddFiles([{
            fileObject: file,
            uploadingStatus: 'client' as const
        }]);
        
        setRecording(false);
    }, [fileHandlers]);

    const handleStopRecording = useCallback(() => {
        setRecording(false);
    }, []);

    const isValid = useCallback(() => {
        const valid = name.trim().length > 0;
        console.log('AudioFilesUploader: isValid check:', { 
            valid,
            nameLength: name.trim().length,
            filesCount: audioFiles.length,
        });
        return valid;
    }, [name]);

    const handleValidityChange = useCallback((fileId: string, isValid: boolean) => {
        setInvalidFiles(prev => {
            const next = new Set(prev);
            if (isValid) {
                next.delete(fileId);
            } else {
                next.add(fileId);
            }
            return next;
        });
    }, []);

    const handleSubmit = useCallback(async (data: { 
        name: string; 
        description: string; 
        files: TrackableFile[]; 
    }) => {
        if (invalidFiles.size > 0) {
            // Filter out invalid files
            const validFiles = data.files.filter(f => !invalidFiles.has(f.fileObject.name));
            if (validFiles.length === 0) {
                toast.error('No valid audio files to submit');
                return;
            }
            
            const proceed = window.confirm(
                `${invalidFiles.size} invalid audio file(s) will be skipped. Do you want to proceed?`
            );
            
            if (!proceed) return;
            
            // Continue with valid files only
            data.files = validFiles;
        }

        setSubmitStatus('loading');
        try {
            await onSubmit?.(data);
            setSubmitStatus('success');
            onSuccess?.();
            setTimeout(() => setSubmitStatus('idle'), STATUS_DURATION);
        } catch (error) {
            console.error(error);
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), STATUS_DURATION);
        }
    }, [invalidFiles, onSubmit, onSuccess]);

    const getButtonContent = () => {

        console.log('AudioFilesUploader: submitStatus', submitStatus);
        switch (submitStatus) {
            case 'loading':
                return <Loader2 className="size-4 animate-spin" />;
            case 'success':
                return <Check className="size-4" />;
            case 'error':
                return <X className="size-4" />;
            default:
                return 'Create Voice';
        }
    };

    const { t } = useTranslation('custom');

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex-1 overflow-y-auto px-2 pb-20">
                <div className="flex flex-col gap-y-4">
                    <FilesDragNDrop
                        acceptFiles={VOICE_FILES_SUPPORTED_TYPES}
                        files={audioFiles}
                        addFiles={fileHandlers.handleAddFiles}
                        disabled={disabled ?? audioFiles.length >= MAX_SAMPLES}
                        removeFiles={fileHandlers.handleFileRemove}
                        className="h-72"
                    >
                        {!recording ? (
                            <div className="flex flex-col gap-y-4">
                                <AudioFileUploadGuide 
                                    acceptedFileTypes={VOICE_FILES_SUPPORTED_TYPES}
                                    maxSamples={MAX_SAMPLES}
                                />
                                <div className="flex items-center gap-x-4">
                                    <div className="h-1 flex-1 bg-foreground/80"/>
                                    <span className="text-sm text-muted-foreground">or</span>
                                    <div className="h-1 flex-1 bg-foreground/80"/>
                                </div>
                                <Button 
                                    variant="outline"
                                    shape="circle"
                                    size="lg"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setRecording(true);
                                    }}
                                >
                                    {t('goToRecorder')}
                                </Button>
                            </div>
                        ) : (
                            <AudioFilesRecorder 
                                onRecordAudioFile={handleRecordedAudio}
                                onStopRecording={handleStopRecording}
                                maxDuration={maxDuration}
                                goBack={() => setRecording(false)}
                            />
                        )}
                    </FilesDragNDrop>

                    <AudioFilesGrid
                        audioFiles={audioFiles}
                        onAudioFileRemove={fileHandlers.handleFileRemove}
                        onDeleteAll={fileHandlers.handleDeleteAll}
                        onDurationLoad={handleDurationLoad}
                        onValidityChange={handleValidityChange}
                        totalDuration={totalDuration}
                        disabled={disabled ?? submitStatus === 'loading'}
                    />

                    {invalidFiles.size > 0 && (
                        <div className="text-sm text-destructive">
                            {invalidFiles.size} audio file(s) are invalid and will be skipped
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <p className="text-lg font-medium text-foreground">Name</p>
                        <input 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Adam Sandler" 
                            className="flex-1 bg-transparent border border-muted selected:border-foreground p-2 text-sm rounded-md outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <p className="text-lg font-medium text-foreground">Description</p>
                        <Textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your voice" 
                            className="h-40 resize-none"
                        />
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background">
                <Button
                    onClick={(_e) => {
                        console.log('AudioFilesUploader: Raw button click');
                        void handleSubmit({
                            name: name.trim(),
                            description: description.trim(),
                            files: audioFiles
                        });
                    }}
                    disabled={!isValid() || (disabled ?? false) || submitStatus !== 'idle'}
                    className={cn(
                        "w-full",
                        submitStatus === 'success' && "bg-green-600 hover:bg-green-700",
                        submitStatus === 'error' && "bg-red-600 hover:bg-red-700"
                    )}
                >
                    {getButtonContent()}
                </Button>
            </div>
        </div>
    );
}