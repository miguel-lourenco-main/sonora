import { AudioFilesUploader } from "./audio-files-uploader";
import { createVoice as createVoiceApi } from "~/lib/client/elevenlabs";
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

    const handleSubmit = async (data: { 
        name: string; 
        description: string; 
        files: TrackableFile[]; 
    }) => {
        try {
            await createVoiceApi({
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