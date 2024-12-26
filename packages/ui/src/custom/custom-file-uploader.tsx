import { Button } from "@kit/ui/button";
import { FileInputButton } from "@kit/ui/files-input-button";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import TooltipComponent from "@kit/ui/tooltip-component";
import { FILE_SUPPORTED_TYPES, FILE_SUPPORTED_TYPES_VALUES_STRING } from "@kit/shared/constants";
import FilesDragNDrop from "@kit/ui/files-drag-n-drop";
import FilesGrid from "@kit/ui/files-grid";
import { TrackableFile } from "../lib/interfaces";

/**
 * Props interface for the CustomFileUploader component
 * Supports both controlled and uncontrolled usage through optional props
 */
interface CustomFileUploadProps {
    files?: TrackableFile[];              // External files array for controlled usage
    setFiles?: Dispatch<SetStateAction<TrackableFile[]>>;  // External setState for controlled usage
    disabled?: boolean;      // Flag to disable the uploader
    disableFileNumber?: boolean;          // Flag to disable the file number display
    onAddFiles?: (files: TrackableFile[]) => void;         // Callback when files are added
    onRemoveFiles?: (files: TrackableFile[]) => void;      // Callback when files are removed
}

/**
 * Interface defining the core file operation handlers
 */
interface FileHandlers {
    handleDeleteAll: () => void;
    handleAddFiles: (newFiles: TrackableFile[]) => void;
    handleFileRemove: (filteredFiles: TrackableFile[]) => void;
}

/**
 * FileActionsBar Component
 * Renders the top action bar containing delete all and add files buttons
 */
const FileActionsBar = ({ 
    files, 
    disabled, 
    handlers 
}: { 
    files: TrackableFile[], 
    disabled?: boolean, 
    handlers: Pick<FileHandlers, 'handleDeleteAll' | 'handleAddFiles'> 
}) => {
    const { t } = useTranslation('custom');

    return (
        <div className="flex items-end justify-between px-2">
            <div className="flex items-center gap-x-3">
                {/* Delete all files button with tooltip */}
                <Button
                    type="button"
                    variant="outline"
                    size="fit"
                    onClick={handlers.handleDeleteAll}
                    disabled={files.length === 0 || disabled}
                    className="transition-opacity duration-400 ease-in-out"
                    style={{ opacity: files.length === 0 ? 0.5 : 1 }}
                >
                    <TooltipComponent 
                        trigger={<Trash2 className="size-8 p-1.5" />} 
                        content={t('deleteAllFiles')} 
                    />
                </Button>
                {/* Add files button with tooltip */}
                <FileInputButton
                    content={(handleFileUpload: () => void) => (
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="fit" 
                            onClick={handleFileUpload}
                            disabled={disabled}
                        >
                            <TooltipComponent 
                                trigger={<Plus className="size-8 p-1.5"/>} 
                                content={t('addFiles')}
                            />
                        </Button>
                    )}
                    acceptsTypes={FILE_SUPPORTED_TYPES_VALUES_STRING}
                    addDroppedFiles={(files: File[]) => handlers.handleAddFiles(files.map(file => ({fileObject: file})))}
                />
            </div>
            {/* File count display */}
            <span className="whitespace-nowrap text-sm text-muted-foreground">
                {`${files.length} ${files.length === 1 ? t('file') : t('files')} ${t('added')}`}
            </span>
        </div>
    );
};

/**
 * CustomFileUploader Component
 * Main component that handles file upload functionality with drag-and-drop support
 */
export function CustomFileUploader({
    files: externalFiles,
    setFiles: externalSetFiles,
    disabled,
    disableFileNumber,
    onAddFiles,
    onRemoveFiles
}: CustomFileUploadProps) {

    // Internal state for uncontrolled usage
    const [internalFiles, setInternalFiles] = useState<TrackableFile[]>([]);
    const files = externalFiles ?? internalFiles;

    // Unified setter that handles both controlled and uncontrolled modes
    const setFiles = useCallback((newFiles: SetStateAction<TrackableFile[]>) => {
        const updatedFiles = typeof newFiles === 'function' ? newFiles(files) : newFiles;
        if (externalSetFiles) {
            externalSetFiles(updatedFiles);
        } else {
            setInternalFiles(updatedFiles);
        }
    }, [externalSetFiles, files]);

    // File operation handlers
    const fileHandlers: FileHandlers = {
        // Handler to delete all files
        handleDeleteAll: useCallback(() => {
            setFiles([]);
        }, [setFiles]),

        // Handler to add new files
        handleAddFiles: useCallback((newFiles: TrackableFile[]) => {
            if (onAddFiles) {
                onAddFiles(newFiles);
            } else {
                setFiles(prevFiles => [...prevFiles, ...newFiles]);
            }
        }, [setFiles, onAddFiles]),

        // Handler to remove specific files
        handleFileRemove: useCallback((filterFiles: TrackableFile[]) => {
            if (onRemoveFiles) {
                onRemoveFiles(filterFiles);
            } else {
                setFiles(prevFiles => prevFiles.filter(file => !filterFiles.includes(file)));
            }
        }, [setFiles, onRemoveFiles])
    };

    return (
        <div className="flex flex-col gap-4 size-full">
            {/* Top action bar */}
            <FileActionsBar 
                files={files} 
                disabled={disabled} 
                handlers={fileHandlers} 
            />
            {/* Drag and drop zone with file grid */}
            <FilesDragNDrop
                acceptFiles={FILE_SUPPORTED_TYPES}
                files={files}
                addFiles={fileHandlers.handleAddFiles}
                removeFiles={fileHandlers.handleFileRemove}
                disabled={disabled}
            >
                <FilesGrid 
                    files={files} 
                    onFileRemove={fileHandlers.handleFileRemove}
                    disabled={disabled} 
                />
            </FilesDragNDrop>
        </div>
    );
} 