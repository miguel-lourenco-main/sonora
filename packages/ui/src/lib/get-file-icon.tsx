import { 
  IconPDF, 
  IconDOCX, 
  IconPPTX, 
  /**
      IconCSV, 
      IconHTML, 
      IconXML, 
      IconTXT, 
      IconPHP, 
      IconJSON, 
      IconGO
   */ 
} from "../custom/icons";
import { FileIcon } from "lucide-react";

export function getFileIcon(format: string, className?: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    Pdf: <IconPDF className={className} />,
    Docx: <IconDOCX className={className} />,
    Pptx: <IconPPTX className={className} />,
    /**
      Csv: <IconCSV className={className} />,
      Html: <IconHTML className={className} />,
      Xml: <IconXML className={className} />,
      Txt: <IconTXT className={className} />,
      Json: <IconJSON className={className} />,
      Php: <IconPHP className={className} />,
      Go: <IconGO className={className} />,
     */
  };

  return iconMap[format] ?? <FileIcon className={className} />
}