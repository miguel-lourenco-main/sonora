import { FileUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { VOICE_MAX_DURATION, VOICE_MIN_DURATION, VOICE_RECOMMENDED_DURATION, formatDuration } from "~/lib/constants";

interface AudioFileUploadGuideProps {
    acceptedFileTypes: Record<string, string[]>;
    maxSamples: number;
}

export function AudioFileUploadGuide({ acceptedFileTypes, maxSamples }: AudioFileUploadGuideProps) {
    const { t } = useTranslation("ui");

    const getSupportedFileTypes = () => {
        const fileTypes = new Set<string>();
        Object.values(acceptedFileTypes).forEach(extensions => {
            extensions.forEach(ext => fileTypes.add(ext.toUpperCase()));
        });
        return Array.from(fileTypes).join(', ');
    };

    return (
        <div className="flex flex-col items-center space-y-3 text-gray-500 dark:text-gray-400">
            <FileUp className="size-4"/>
            
            <div className="flex flex-col gap-2 text-center">
                <p className="text-sm">
                    <span className="font-semibold">{t("clickToAdd")}</span>
                    &nbsp; {t("orDragAndDrop")}
                </p>

                <p className="text-sm">
                    {getSupportedFileTypes()}
                </p>

                <p className="text-xs text-muted-foreground">
                    Maximum {maxSamples} audio samples
                </p>

                <p className="text-xs text-muted-foreground">
                    Recommended samples duration total: {formatDuration(VOICE_RECOMMENDED_DURATION)}+
                </p>

                <p className="text-xs text-muted-foreground">
                    Samples duration range per sample: {formatDuration(VOICE_MIN_DURATION)} - {formatDuration(VOICE_MAX_DURATION)}
                </p>
            </div>
        </div>
    );
} 