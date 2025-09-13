import { 
  IconPDF, 
  IconDOCX, 
  IconPPTX, 
} from "../custom/icons";
import { FileIcon } from "lucide-react";

import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFileIcon(format: string, className?: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    Pdf: <IconPDF className={className} />,
    Docx: <IconDOCX className={className} />,
    Pptx: <IconPPTX className={className} />,
  };

  return iconMap[format] ?? <FileIcon className={className} />
}

export function getCountryFlag(country: string): string {
    // Convert country code to uppercase for consistency
    const input = country.toUpperCase();
    
    const countryMap: Record<string, string> = {
      // European Countries
      'ENGLISH': '🇬🇧',
      'EN': '🇬🇧',
      'FRENCH': '🇫🇷',
      'FR': '🇫🇷',
      'GERMAN': '🇩🇪',
      'DE': '🇩🇪',
      'ITALIAN': '🇮🇹',
      'IT': '🇮🇹',
      'SPANISH': '🇪🇸',
      'ES': '🇪🇸',
      'PORTUGUESE': '🇵🇹',
      'PT': '🇵🇹',
      'DUTCH': '🇳🇱',
      'NL': '🇳🇱',
      'GREEK': '🇬🇷',
      'GR': '🇬🇷',
      'POLISH': '🇵🇱',
      'PL': '🇵🇱',
      'ROMANIAN': '🇷🇴',
      'RO': '🇷🇴',
      'SWEDISH': '🇸🇪',
      'SE': '🇸🇪',
      'NORWEGIAN': '🇳🇴',
      'NO': '🇳🇴',
      'DANISH': '🇩🇰',
      'DK': '🇩🇰',
      'FINNISH': '🇫🇮',
      'FI': '🇫🇮',
  
      // Asian Countries
      'CHINESE': '🇨🇳',
      'ZH': '🇨🇳',
      'JAPANESE': '🇯🇵',
      'JA': '🇯🇵',
      'KOREAN': '🇰🇷',
      'KO': '🇰🇷',
      'VIETNAMESE': '🇻🇳',
      'VI': '🇻🇳',
      'THAI': '🇹🇭',
      'TH': '🇹🇭',
      'INDONESIAN': '🇮🇩',
      'ID': '🇮🇩',
      'MALAY': '🇲🇾',
      'MS': '🇲🇾',
      'HINDI': '🇮🇳',
      'HI': '🇮🇳',
      'BENGALI': '🇧🇩',
      'BN': '🇧🇩',
      'URDU': '🇵🇰',
      'UR': '🇵🇰',
  
      // Middle Eastern Countries
      'ARABIC': '🇸🇦',
      'AR': '🇸🇦',
      'HEBREW': '🇮🇱',
      'HE': '🇮🇱',
      'TURKISH': '🇹🇷',
      'TR': '🇹🇷',
      'PERSIAN': '🇮🇷',
      'FA': '🇮🇷',
  
      // American Countries
      'ENGLISH_US': '🇺🇸',
      'EN_US': '🇺🇸',
      'PORTUGUESE_BR': '🇧🇷',
      'PT_BR': '🇧🇷',
      'SPANISH_MX': '🇲🇽',
      'ES_MX': '🇲🇽',
      'FRENCH_CA': '🇨🇦',
      'FR_CA': '🇨🇦',
  
      // Other Major Countries
      'RUSSIAN': '🇷🇺',
      'RU': '🇷🇺',
      'UKRAINIAN': '🇺🇦',
      'UK': '🇺🇦',
      'CZECH': '🇨🇿',
      'CS': '🇨🇿',
      'SLOVAK': '🇸🇰',
      'SK': '🇸🇰',
      'HUNGARIAN': '🇭🇺',
      'HU': '🇭🇺',
      'BULGARIAN': '🇧🇬',
      'BG': '🇧🇬',
      'CROATIAN': '🇭🇷',
      'HR': '🇭🇷',
      'SERBIAN': '🇷🇸',
      'SR': '🇷🇸',
      'SLOVENIAN': '🇸🇮',
      'SL': '🇸🇮'
    };
  
    return countryMap[input] ?? '🏳️'; // Returns white flag if country not found
  }