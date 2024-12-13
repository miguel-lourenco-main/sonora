import { MAX_FILE_SIZE_STRING } from "@kit/shared/constants";
import { FileUp } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Props interface for the FileSvgDraw component
 */
interface FileSvgDrawProps {
  acceptedFileTypes: Record<string, string[]>;  // Map of MIME types to file extensions
}

/**
 * FileSvgDraw Component
 * Renders a visual representation for file upload areas with supported file types
 * and maximum file size information
 * 
 * Features:
 * - Displays upload icon
 * - Shows "click to add or drag and drop" text
 * - Lists supported file extensions
 * - Shows maximum file size limit
 * 
 * @param acceptedFileTypes - Object mapping MIME types to their file extensions
 */
export function FileSvgDraw({ acceptedFileTypes }: FileSvgDrawProps) {
  const { t } = useTranslation("ui");

  /**
   * Extracts and formats all supported file extensions
   * Converts extensions to uppercase and removes duplicates
   * 
   * @returns Comma-separated string of unique file extensions
   */
  const getSupportedFileTypes = () => {
    const fileTypes = new Set<string>();
    Object.values(acceptedFileTypes).forEach(extensions => {
      extensions.forEach(ext => fileTypes.add(ext.toUpperCase()));
    });
    return Array.from(fileTypes).join(', ');
  };

  return (
    <div className="flex flex-col items-center space-y-3 text-gray-500 dark:text-gray-400">
      {/* Upload icon */}
      <FileUp className="size-4"/>
      
      {/* Upload instructions */}
      <p className="text-sm text-center">
        <span className="font-semibold">{t("clickToAdd")}</span>
        &nbsp; {t("orDragAndDrop")}
      </p>
      
      {/* Supported file types */}
      <p className="text-xs">{getSupportedFileTypes()}</p>
      
      {/* Maximum file size limit */}
      <span className="whitespace-nowrap text-sm text-muted-foreground">
        {`Max file size: ${MAX_FILE_SIZE_STRING}`}
      </span>
    </div>
  );
} 