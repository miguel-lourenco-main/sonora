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
    <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
      <FileUp className="size-4"/>
      <p className="p-2 mb-1 text-sm text-center">
        <span className="font-semibold">{t("clickToAdd")}</span>
        &nbsp; {t("orDragAndDrop")}
      </p>
      <p className="text-xs">{getSupportedFileTypes()}</p>
    </div>
  );
} 