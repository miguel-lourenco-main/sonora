import { MAX_FILE_SIZE_STRING } from "@kit/shared/constants";
import { FileUp } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FileSvgDrawProps {
  acceptedFileTypes: Record<string, string[]>;
}

export function FileSvgDraw({ acceptedFileTypes }: FileSvgDrawProps) {
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
      <p className="text-sm text-center">
        <span className="font-semibold">{t("clickToAdd")}</span>
        &nbsp; {t("orDragAndDrop")}
      </p>
      <p className="text-xs">{getSupportedFileTypes()}</p>
      <span className="whitespace-nowrap text-sm text-muted-foreground">
        {`Max file size: ${MAX_FILE_SIZE_STRING}`}
      </span>
    </div>
  );
} 