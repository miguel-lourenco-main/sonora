"use client";

import { Input } from "../shadcn/input";
import { cn } from "../utils";
import {
  Dispatch,
  SetStateAction,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  useDropzone,
  FileRejection,
  DropEvent,
} from "react-dropzone";
import { toast } from "sonner";
import { Paperclip, Send, Trash2Icon, X } from "lucide-react";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "../shadcn/tooltip";
import { useTranslation } from "react-i18next";
import { CustomFileUploaderProps, DirectionOptions } from "./_lib/types";
import { IconCloudDownload } from "./icons";

export const FilesDragNDrop = forwardRef<
  HTMLDivElement,
  CustomFileUploaderProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      files,
      setFiles,
      className,
      acceptFiles,
      orientation = "vertical",
      children 
    },
    ref
  ) => {

    const [isFileTooBig, setIsFileTooBig] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [showCover, setShowCover] = useState(true);

    const { t } = useTranslation('ui')

    const maxSize = 1024 * 1024 * 4;
    const multiple = true;

    const accept = acceptFiles ?? {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
      "text/plain": [".txt"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    };

    const direction: DirectionOptions = "ltr";

    const removeFileFromSet = useCallback(
      (i: number) => {
        if (!files) return;
        const newFiles = files.filter((_, index) => index !== i);
        setFiles(newFiles);
      },
      [files, setFiles]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!files) return;

        const moveNext = () => {
          const nextIndex = activeIndex + 1;
          setActiveIndex(nextIndex > files.length - 1 ? 0 : nextIndex);
        };

        const movePrev = () => {
          const nextIndex = activeIndex - 1;
          setActiveIndex(nextIndex < 0 ? files.length - 1 : nextIndex);
        };

        const prevKey =
          orientation === "horizontal"
            ? direction === "ltr"
              ? "ArrowLeft"
              : "ArrowRight"
            : "ArrowUp";

        const nextKey =
          orientation === "horizontal"
            ? direction === "ltr"
              ? "ArrowRight"
              : "ArrowLeft"
            : "ArrowDown";

        if (e.key === nextKey) {
          moveNext();
        } else if (e.key === prevKey) {
          movePrev();
        } else if (e.key === "Enter" || e.key === "Space") {
          if (activeIndex === -1) {
            dropzone.inputRef.current?.click();
          }
        } else if (e.key === "Delete" || e.key === "Backspace") {
          if (activeIndex !== -1) {
            removeFileFromSet(activeIndex);
            if (files.length - 1 === 0) {
              setActiveIndex(-1);
              return;
            }
            movePrev();
          }
        } else if (e.key === "Escape") {
          setActiveIndex(-1);
        }
      },
      [files, activeIndex, removeFileFromSet]
    );

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[], event: DropEvent) => {

      if (!acceptedFiles) {
        toast.error("file error , probably too big");
        return;
      }

      setFiles((prevFiles: File[]) => [...prevFiles, ...acceptedFiles]);

      if (rejectedFiles.length > 0) {
        for (let i = 0; i < rejectedFiles.length; i++) {
          if (maxSize && rejectedFiles[i]?.errors[0]?.code === "file-too-large") {
            toast.error(
              `${t("fileTooLarge")} ${maxSize / 1024 / 1024}MB`
            );
            break;
          }
          if (rejectedFiles[i]?.errors[0]?.message) {
            toast.error(rejectedFiles[i]?.errors[0]?.message);
            break;
          }
        }
      }
    }, [setFiles]);

    /*
    TODO: hardcoded max files number that allows the user to upload as many files as possible 
          without affecting the UX too much. If this is the way to go, investigate how to calculate
          what it should be
    */ 
    const opts = { accept, maxFiles: 1000, maxSize, multiple };

    const dropzone = useDropzone({
      ...opts,
      onDragEnter: () => setShowCover(true),
      onDragLeave: () => setShowCover(false),
      onDrop,
      onDropRejected: () => setIsFileTooBig(true),
      onDropAccepted: () => setIsFileTooBig(false),
    })

    const clickInput = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
      if(!showCover) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, [showCover]);

    useEffect(() => {
      if(files.length > 0) {
        setShowCover(false);
      }else{
        setShowCover(true);
      }
    }, [files]);

    return (
      <div
        ref={ref}
        tabIndex={0}
        onKeyDownCapture={handleKeyDown}
        className={cn("relative flex w-full h-full gap-4 p-2 focus:outline-none overflow-hidden", className)}
        dir={direction}
        {...dropzone.getRootProps()}

      >
        <div className={cn("absolute top-0 left-0 items-center justify-center w-full h-full p-2 bg-background/80", showCover || files.length === 0 ? "flex" : "hidden")}>
          <div
            className={cn(
            `flex flex-col items-center justify-center size-full rounded-lg duration-300 ease-in-out
              outline-dashed outline-1 outline-foreground cursor-pointer
              ${
                dropzone.isDragAccept
                ? "border-green-500"
                : dropzone.isDragReject || isFileTooBig
                ? "border-red-500"
                : "border-gray-300"
              }`,
            )}
          >
            <FileSvgDraw acceptedFileTypes={accept} />
          </div>
          <Input
            ref={dropzone.inputRef}
            disabled={/*isLOF*/ false}
            {...dropzone.getInputProps()}
            onClick={clickInput}
          />
        </div>
        { files.length > 0 && (
          <div className={cn("absolute top-0 left-0 w-full h-full overflow-hidden", showCover ? "disabled" : "")}>
            {children ?? <DefaultFilesListComponent files={files} setFiles={setFiles} />}
          </div>
        )}
      </div>
    );
  }
);

FilesDragNDrop.displayName = "FilesDragNDrop";

export default FilesDragNDrop

const FileSvgDraw = ({ acceptedFileTypes }: { acceptedFileTypes: Record<string, string[]> }) => {
  const { t } = useTranslation("ui");

  const getSupportedFileTypes = () => {
    const fileTypes = new Set<string>();
    Object.values(acceptedFileTypes).forEach(extensions => {
      extensions.forEach(ext => fileTypes.add(ext.toUpperCase()));
    });
    return Array.from(fileTypes).join(', ');
  };

  return (
    <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
      <IconCloudDownload />
      <p className="p-2 mb-1 text-sm text-center">
        <span className="font-semibold">{t("clickToAdd")}</span>
        &nbsp; {t("orDragAndDrop")}
      </p>
      <p className="text-xs">
        {getSupportedFileTypes()}
      </p>
    </div>
  );
};

const DefaultFilesListComponent = ({ files, setFiles }: { files: File[], setFiles: Dispatch<SetStateAction<File[]>> }) => {
  return (
    <div className="flex flex-col size-full">
      <FileUploaderHeader setFiles={setFiles} />
      <div className="flex gap-2 p-4 h-[calc(100%-3rem)] custom-scrollbar">
        {files &&
          files.length > 0 &&
          files.map((file, i) => (
            <FileUploaderItem key={i} currentFile={file} i={i} files={files} setFiles={setFiles} />
          ))
        }
      </div>
    </div>
  )
}

function FileUploaderHeader({ setFiles }: { setFiles: Dispatch<SetStateAction<File[]>> }) {
  
  const {t} = useTranslation("ui");

  return (
    <div className="flex items-center justify-between px-4 pt-2 pb-1">
      <p className="text-base">{t("files")}</p>
      <div className="flex space-x-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Send
                className="h-[18px] w-[18px] stroke-foreground"
                onClick={() => {
                  console.log("submitAll");
                }}
              />
            </TooltipTrigger>
            <TooltipContent>
              {t("submitAll")}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Trash2Icon
                onClick={(e) => {
                  setFiles([]);
                  e.stopPropagation();
                }}
                className="h-[18px] w-[18px] stroke-foreground" 
              />
            </TooltipTrigger>
            <TooltipContent>
              {t("deleteAll")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

function FileUploaderItem({ currentFile, i, files, setFiles }: { currentFile: File, i: number, files: File[], setFiles: Dispatch<SetStateAction<File[]>> }) {

  return (
    <div key={i} className="flex items-center justify-between gap-2 w-full h-fit">
      <div className="flex items-center gap-2">
        <Paperclip className="h-3.5 w-3.5 stroke-current" />
        <span className="flex-1 truncate">{currentFile.name}</span>
      </div>
      <X 
      onClick={() => {
          setFiles(files.filter((_, index) => index !== i));
      }}
      className="h-4 w-4 stroke-current cursor-pointer" 
      />
    </div>
  );
}
