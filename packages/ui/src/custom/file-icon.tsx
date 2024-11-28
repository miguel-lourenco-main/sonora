import { File } from "lucide-react";
import { IconPDF, IconDOCX, IconDOC, IconPPTX } from "./icons";
import { FILE_SUPPORTED_TYPES } from "@kit/shared/constants";

interface FileIconProps {
  file: File;
  className?: string;
}

export function FileIcon({ file, className = "size-12" }: FileIconProps) {
  const extensions = FILE_SUPPORTED_TYPES[file.type as keyof typeof FILE_SUPPORTED_TYPES] || [];

  if (extensions.includes(".pdf")) {
    return <IconPDF className={className} />;
  } else if (extensions.includes(".docx")) {
    return <IconDOCX className={className} />;
  } else if (extensions.includes(".doc")) {
    return <IconDOC className={className} />;
  } else if (extensions.includes(".pptx")) {
    return <IconPPTX className={className} />;
  }
  return <File className={className} />;
} 