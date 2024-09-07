'use client'

import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFileUploader from "./file-upload";
import { Button } from "../../../shadcn/button" 
import { Plus, Trash2 } from "lucide-react";
import TooltipComponent from "./tooltip-component";
import { FileBrowserInput } from "./file-browser-input";
import FilesGrid from "./files-grid";
import { useTranslation } from "react-i18next";
import { formSchema } from "../../_lib/schemas/translate-files";
import { FormData } from "../../_lib/types";
import { cn } from "../../../utils";
import LanguageMultiSelect from "./language-multi-select";

const languages = [
    { value: "english", label: "🇬🇧 English" },
    { value: "french", label: "🇫🇷 French" },
    { value: "spanish", label: "🇪🇸 Spanish" },
    { value: "german", label: "🇩🇪 German" },
    { value: "italian", label: "🇮🇹 Italian" },
    { value: "portuguese", label: "🇵🇹 Portuguese" },
    { value: "russian", label: "🇷🇺 Russian" },
    { value: "japanese", label: "🇯🇵 Japanese" },
    { value: "chinese", label: "🇨🇳 Chinese" },
    { value: "korean", label: "🇰🇷 Korean" },
  ]

export default function DragNDropGrid({ 
    initialFiles = [], 
    setFiles, 
    onSubmit, 
    submitButton, 
    submitButtonX, 
    submitButtonY 
}: { 
    initialFiles?: File[], 
    setFiles?: Dispatch<SetStateAction<File[]>>, 
    onSubmit?: (data: { files: File[], targetLanguage: string[] }) => void, 
    submitButton?: ReactNode, 
    submitButtonX?: "left" | "right" | "center", 
    submitButtonY?: "top" | "bottom" 
}) {
    const { t } = useTranslation('ui');
    const [localFiles, setLocalFiles] = useState<File[]>(initialFiles);
    const [targetLanguage, setTargetLanguage] = useState<string[]>([]);

    const files = setFiles ? initialFiles : localFiles;
    const updateFiles = setFiles ? setFiles : setLocalFiles;

    const handleDeleteAll = () => {
        updateFiles([]);
    };

    const handleAddFiles = (newFiles: File[]) => {
        const updatedFiles = [...files, ...newFiles];
        updateFiles(updatedFiles);
    };

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit({ files, targetLanguage });
        }
    };

    const submitButtonSection = (
        <div className={cn("flex w-full px-2", submitButtonX === "left" ? "justify-start" : submitButtonX === "right" ? "justify-end" : "justify-center")} >
            {submitButton ? submitButton : <Button onClick={handleSubmit}>Submit</Button>}
        </div>
    );

    return (
        <div className="flex flex-col justify-start size-full gap-4">
            {submitButtonY === "top" && submitButtonSection}
            <div className="flex items-end justify-between px-2">
                <div className="flex items-center gap-x-3">
                    <Button
                        type="button"
                        variant="light_foreground"
                        size="fit"
                        onClick={handleDeleteAll}
                        disabled={files.length === 0}
                        className="transition-opacity duration-400 ease-in-out"
                        style={{ opacity: files.length === 0 ? 0.5 : 1 }}
                    >
                        <TooltipComponent trigger={<Trash2 className="size-8 p-1.5" />} content={t('ui:deleteAllFiles')} />
                    </Button>
                    <FileBrowserInput
                        content={(handleFileUpload: () => void) => (
                            <Button type="button" variant="light_foreground" size="fit" onClick={handleFileUpload}>
                                <TooltipComponent 
                                    trigger={<Plus className="size-8 p-1.5"/>} 
                                    content={t('ui:addFiles')}
                                />
                            </Button>
                        )}
                        acceptsTypes=".pdf, .docx, .doc"
                        addDroppedFiles={handleAddFiles}
                    />
                </div>
                <div className="flex w-full flex-col items-center gap-y-1.5">
                    <LanguageMultiSelect 
                        className="w-1/3" 
                        languages={languages} 
                        externalValue={targetLanguage} 
                        externalSetValue={setTargetLanguage}
                    />
                </div>
                <div className="flex gap-x-1 px-2 whitespace-nowrap text-sm text-muted-foreground">
                    {files.length} {files.length === 1 ? t('ui:file') : t('ui:files')} {t('ui:added')}
                </div>
            </div>
            <CustomFileUploader
                acceptFiles={{"application/pdf": [".pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"], "application/msword": [".doc"]}}
                files={files}
                setFiles={updateFiles}
            >
                <FilesGrid files={files} setFiles={updateFiles} />
            </CustomFileUploader>
            {submitButtonY === "bottom" && submitButtonSection}
        </div>
    );
}

export function DragNDropGridForm({ initialFiles = [], setFiles, onSubmit, submitButton, submitButtonX, submitButtonY }: { initialFiles?: File[], setFiles?: Dispatch<SetStateAction<File[]>>, onSubmit: (data: FormData) => void, submitButton?: ReactNode, submitButtonX?: "left" | "right" | "center", submitButtonY?: "top" | "bottom" }) {
    const { t } = useTranslation('ui');

    const [localFiles, setLocalFiles] = useState<File[]>([]);

    const files = setFiles ? initialFiles : localFiles;
    const updateFiles = setFiles ? setFiles : setLocalFiles;

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            files: [],
            targetLanguage: [],
        },
    });

    const handleDeleteAll = () => {
        updateFiles([]);
        setValue('files', []);
    };

    const handleAddFiles = (newFiles: File[]) => {
        const updatedFiles = [...files, ...newFiles];
        updateFiles(updatedFiles);
        setValue('files', updatedFiles, { shouldValidate: true });
    };

    const submitButtonSection = (
        <div className={cn("flex w-full px-2", submitButtonX === "left" ? "justify-start" : submitButtonX === "right" ? "justify-end" : "justify-center")} >
            {submitButton ? submitButton : <Button type="submit">Submit</Button>}
        </div>
    )

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-start size-full gap-4">
            {submitButtonY === "top" && submitButtonSection}
            <div className="flex items-end justify-between px-2">
                <div className="flex items-center gap-x-3">
                    <Button
                        type="button"
                        variant="light_foreground"
                        size="fit"
                        onClick={handleDeleteAll}
                        disabled={files.length === 0}
                        className="transition-opacity duration-400 ease-in-out"
                        style={{ opacity: files.length === 0 ? 0.5 : 1 }}
                    >
                        <TooltipComponent trigger={<Trash2 className="size-8 p-1.5" />} content={t('ui:deleteAllFiles')} />
                    </Button>
                    <Controller
                        name="files"
                        control={control}
                        render={({ field }) => (
                            <FileBrowserInput
                                content={(handleFileUpload: () => void) => (
                                    <Button type="button" variant="light_foreground" size="fit" onClick={handleFileUpload}>
                                        <TooltipComponent 
                                            trigger={<Plus className="size-8 p-1.5"/>} 
                                            content={t('ui:addFiles')}
                                        />
                                    </Button>
                                )}
                                acceptsTypes=".pdf, .docx, .doc"
                                addDroppedFiles={(newFiles) => {
                                    handleAddFiles(newFiles);
                                    field.onChange([...field.value, ...newFiles]);
                                }}
                            />
                        )}
                    />
                </div>
                <div className="flex w-full flex-col items-center gap-y-1.5">
                    <Controller
                        name="targetLanguage"
                        control={control}
                        render={({ field }) => (
                            <LanguageMultiSelect 
                                className="w-1/3" 
                                languages={languages} 
                                externalValue={field.value} 
                                externalSetValue={(value) => field.onChange(value)}
                            />
                        )}
                    />
                    {errors.targetLanguage && <p className="text-red-500">{errors.targetLanguage.message}</p>}
                </div>
                <div className="flex gap-x-1 px-2 whitespace-nowrap text-sm text-muted-foreground">
                    {files.length} {files.length === 1 ? t('ui:file') : t('ui:files')} {t('ui:added')}
                </div>
            </div>
            <CustomFileUploader
                acceptFiles={{"application/pdf": [".pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"], "application/msword": [".doc"]}}
                files={files}
                setFiles={(newFiles) => {
                    updateFiles(newFiles);
                    setValue('files', Array.isArray(newFiles) ? newFiles : newFiles(files), { shouldValidate: true });
                }}
            >
                <FilesGrid files={files} setFiles={(newFiles) => {
                    updateFiles(newFiles);
                    setValue('files', Array.isArray(newFiles) ? newFiles : newFiles(files), { shouldValidate: true });
                }} />
            </CustomFileUploader>
            {errors.files && <p className="text-red-500">{errors.files.message}</p>}
            {submitButtonY === "bottom" && submitButtonSection}
        </form>
    );
}
