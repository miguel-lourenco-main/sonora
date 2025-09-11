import { AudioFilesUploader } from "./audio-files-uploader";
import { useVoiceManager } from "~/lib/hooks/use-voice-manager";
import { Dispatch, SetStateAction } from "react";
import { TrackableFile } from "@kit/ui/interfaces";


interface VoiceFileFormProps {
    files?: TrackableFile[];
    setFiles?: Dispatch<SetStateAction<TrackableFile[]>>;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    onStartSubmit?: () => void;
    onFinishSubmit?: (success: boolean) => void;
    submitButton?: {
        content: React.ReactNode;
        x: 'right' | 'left';
        y: 'top' | 'bottom';
    };
    maxDuration?: number;
}

export function VoiceFileForm({ files, setFiles, onFinishSubmit, maxDuration }: VoiceFileFormProps) {
    const { createVoice } = useVoiceManager();

    const handleSubmit = async (data: { 
        name: string; 
        description: string; 
        files: TrackableFile[]; 
    }) => {
        try {
            await createVoice({
                name: data.name,
                description: data.description,
                files: data.files.map(f => f.fileObject)
            });
            onFinishSubmit?.(true);
        } catch (error) {
            console.error('VoiceFileForm: error caught:', error);
            onFinishSubmit?.(false);
            throw error;
        }
    };

    return (
        <AudioFilesUploader
            audioFiles={files}
            setAudioFiles={setFiles}
            onSubmit={handleSubmit}
            maxDuration={maxDuration}
        />
    );
} 