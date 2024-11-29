"use client";

import { Input } from "../shadcn/input";
import { cn } from "../lib";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { FileRejection, DropEvent, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { CustomFileUploaderProps, DirectionOptions } from "./_lib/types";
import { FileSvgDraw } from "./file-svg-draw";
import FilesGrid from "./files-grid";
import { TrackableFile } from "@kit/shared/types";

const DEFAULT_ACCEPT = {
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

export const FilesDragNDrop = forwardRef<
  HTMLDivElement,
  CustomFileUploaderProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      files,
      addFiles,
      removeFiles,
      className,
      acceptFiles = DEFAULT_ACCEPT,
      orientation = "vertical",
      children,
      disabled
    },
    ref
  ) => {
    const [isFileTooBig, setIsFileTooBig] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [showCover, setShowCover] = useState(true);
    const { t } = useTranslation('ui');
    const maxSize = 256 * 1024 * 1024; // 256MB
    const direction: DirectionOptions = "ltr";

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!acceptedFiles?.length) {
        toast.error("file error, probably too big");
        return;
      }
      
      // Use setFiles as an add operation
      addFiles(acceptedFiles);

      if (rejectedFiles.length > 0) {
        for (const rejectedFile of rejectedFiles) {
          if (maxSize && rejectedFile?.errors[0]?.code === "file-too-large") {
            toast.error(`${t("fileTooLarge")} ${maxSize / 1024 / 1024}MB`);
            break;
          }
          if (rejectedFile?.errors[0]?.message) {
            toast.error(rejectedFile?.errors[0]?.message);
            break;
          }
        }
      }
    }, [addFiles, maxSize, t]);

    const handleRemoveFile = useCallback((filteredFiles: TrackableFile[]) => {
      removeFiles(filteredFiles);
    }, [removeFiles]);

    const dropzone = useDropzone({
      accept: acceptFiles,
      maxFiles: 1000,
      maxSize,
      multiple: true,
      onDragEnter: () => setShowCover(true),
      onDragLeave: () => setShowCover(false),
      onDrop,
      onDropRejected: () => setIsFileTooBig(true),
      onDropAccepted: () => setIsFileTooBig(false),
    });

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

        const prevKey = orientation === "horizontal"
          ? direction === "ltr" ? "ArrowLeft" : "ArrowRight"
          : "ArrowUp";

        const nextKey = orientation === "horizontal"
          ? direction === "ltr" ? "ArrowRight" : "ArrowLeft"
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
            removeFiles(files.filter((_, index) => index !== activeIndex));
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
      [files, activeIndex, removeFiles, orientation, direction, dropzone.inputRef]
    );

    useEffect(() => {
      setShowCover(files.length === 0);
    }, [files]);

    return (
      <div
        ref={ref}
        tabIndex={0}
        onKeyDownCapture={handleKeyDown}
        className={cn("relative flex w-full h-full gap-4 p-2 focus:outline-none overflow-hidden", className)}
        dir={direction}
        {...dropzone.getRootProps({
          onClick: (e) => {
            // Check if we're clicking a file or its controls
            const isFileClick = (e.target as HTMLElement).closest('[data-delete-file-item]');
            if (!isFileClick) {
              dropzone.open();
            }
          },
        })}
      >
        <div className={cn("absolute top-0 left-0 z-10 items-center justify-center w-full h-full p-2 bg-background/80", showCover || files.length === 0 ? "flex" : "hidden")}>
          <div
            className={cn(
              "flex flex-col items-center justify-center size-full rounded-lg duration-300 ease-in-out outline-dashed outline-1 outline-foreground cursor-pointer",
              dropzone.isDragAccept ? "border-green-500" : 
              dropzone.isDragReject || isFileTooBig ? "border-red-500" : "border-gray-300"
            )}
          >
            <FileSvgDraw acceptedFileTypes={acceptFiles} />
          </div>
          <Input
            ref={dropzone.inputRef}
            disabled={disabled}
            {...dropzone.getInputProps()}
          />
        </div>
        {files.length > 0 && (
          <div className={cn("absolute top-0 left-0 w-full h-full overflow-hidden", showCover ? "disabled" : "")}>
            {children ?? <FilesGrid files={files} onFileRemove={handleRemoveFile} disabled={disabled} />}
          </div>
        )}
      </div>
    );
  }
);

FilesDragNDrop.displayName = "FilesDragNDrop";

export default FilesDragNDrop;