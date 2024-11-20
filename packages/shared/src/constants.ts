import { z } from 'zod';
import { Language } from './interfaces';

export const EDGEN_BACKEND_URL = process.env.EDGEN_BACKEND_URL || "http://127.0.0.1:30000";

export const FILE_SUPPORTED_TYPES = {
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
}

export const FILE_FORMAT_GROUPS = [
    {
        name: "MS Office",
        formats: ["Docx", "Pptx"]
    },
    {
        name: "Adobe",
        formats: ["Pdf"]
    },
    {
        name: "Code",
        formats: ["Json", "Html", "Xml", "Go", "Yml", "Yaml", "Php"]
    },
    {
        name: "Other",
        formats: ["Txt", "Csv"]
    }
];

export const FILE_SUPPORTED_TYPES_KEYS = Object.keys(FILE_SUPPORTED_TYPES)
export const FILE_SUPPORTED_TYPES_VALUES = Object.values(FILE_SUPPORTED_TYPES).flat()

export const FILE_SUPPORTED_TYPES_VALUES_STRING = Object.values(FILE_SUPPORTED_TYPES).flat().join(",")

export const COLLAPSIBLE_SIZE = 4

export const DEFAULT_FILE_TREE = {name: "root_generated", children: [], id: "root_generated", isSelectable: true}

/////////// PATHS ///////////////
export const EDGEN_CHAT_PAGE_PATH = "/app/chat"
export const EDGEN_CHAT_PAGE_WITH_ID_PATH = "/app/chat/[chatId]"
export const EDGEN_COLLECTIONS_PAGE_PATH = "/app/collections"
export const POLYDOC_FILE_TRANSLATIONS_PAGE_PATH = "/app/file-translations"
export const POLYDOC_BILLING_UPGRADE_PAGE_PATH = "/app/billing/upgrade"
export const CONNECTOR_DRAG_N_DROP_HEIGHT = "25rem"

export const COLLAPSE_PATHS_FROM = [EDGEN_CHAT_PAGE_PATH]

export const COLLAPSE_PATHS = [EDGEN_CHAT_PAGE_PATH]

export const EDGEN_CUSTOM_PATHS_SCHEMA = {
    app: z.string().min(1),
    chatWithID: z.string().min(1),
    collections: z.string().min(1),
}

export const EDGEN_CUSTOM_PATHS = {
    app: EDGEN_CHAT_PAGE_PATH,
    chatWithID: EDGEN_CHAT_PAGE_WITH_ID_PATH,
    collections: EDGEN_COLLECTIONS_PAGE_PATH,
}

export const POLYDOC_CUSTOM_PATHS_SCHEMA = {
    upgrade: z.string().min(1)
}

export const POLYDOC_CUSTOM_PATHS = {
    upgrade: POLYDOC_BILLING_UPGRADE_PAGE_PATH
}

export const LANGUAGES_BY_REGION: Record<string, Language[]> = {
  "Asia": [
    { value: "arabic", shortValue: "ar", label: "🇸🇦 Arabic" },
    { value: "armenian", shortValue: "hy", label: "🇦🇲 Armenian" },
    { value: "azerbaijani", shortValue: "az", label: "🇦🇿 Azerbaijani" },
    { value: "bengali", shortValue: "bn", label: "🇧🇩 Bengali" },
    { value: "burmese", shortValue: "my", label: "🇲🇲 Burmese" },
    { value: "cantonese", shortValue: "yue", label: "🇭🇰 Cantonese" },
    { value: "filipino", shortValue: "fil", label: "🇵🇭 Filipino" },
    { value: "gujarati", shortValue: "gu", label: "🇮🇳 Gujarati" },
    { value: "hebrew", shortValue: "he", label: "🇮🇱 Hebrew" },
    { value: "hindi", shortValue: "hi", label: "🇮🇳 Hindi" },
    { value: "indonesian", shortValue: "id", label: "🇮🇩 Indonesian" },
    { value: "japanese", shortValue: "ja", label: "🇯🇵 Japanese" },
    { value: "japanese_honorific", shortValue: "ja_hon", label: "🇯🇵 Japanese (Honorifics)" },
    { value: "japanese_humble", shortValue: "ja_hum", label: "🇯🇵 Japanese (Humble)" },
    { value: "japanese_polite", shortValue: "ja_pol", label: "🇯🇵 Japanese (Polite)" },
    { value: "korean", shortValue: "ko", label: "🇰🇷 Korean" },
    { value: "kazakh", shortValue: "kk", label: "🇰🇿 Kazakh" },
    { value: "khmer", shortValue: "km", label: "🇰🇭 Khmer" },
    { value: "kannada", shortValue: "kn", label: "🇮🇳 Kannada" },
    { value: "lao", shortValue: "lo", label: "🇱🇦 Lao" },
    { value: "malay", shortValue: "ms", label: "🇲🇾 Malay" },
    { value: "mongolian", shortValue: "mn", label: "🇲🇳 Mongolian (Cyrillic)" },
    { value: "marathi", shortValue: "mr", label: "🇮🇳 Marathi" },
    { value: "malayalam", shortValue: "ml", label: "🇮🇳 Malayalam" },
    { value: "odia", shortValue: "or", label: "🇮🇳 Odia" },
    { value: "persian", shortValue: "fa", label: "🇮🇷 Persian" },
    { value: "punjabi", shortValue: "pa", label: "🇮🇳 Punjabi" },
    { value: "russian", shortValue: "ru", label: "🇷🇺 Russian" },
    { value: "chinese_simplified", shortValue: "zh_cn", label: "🇨🇳 Simplified Chinese" },
    { value: "sinhala", shortValue: "si", label: "🇱🇰 Sinhalese" },
    { value: "chinese_hk", shortValue: "zh_hk", label: "🇭🇰 Traditional Chinese (Hong Kong)" },
    { value: "chinese_tw", shortValue: "zh_tw", label: "🇹🇼 Traditional Chinese (Taiwan)" },
    { value: "chinese_traditional", shortValue: "zh_t", label: "🇹🇼 Traditional Chinese" },
    { value: "thai", shortValue: "th", label: "🇹🇭 Thai" },
    { value: "tamil", shortValue: "ta", label: "🇮🇳 Tamil" },
    { value: "telugu", shortValue: "te", label: "🇮🇳 Telugu" },
    { value: "uzbek", shortValue: "uz", label: "🇺🇿 Uzbek" },
    { value: "urdu", shortValue: "ur", label: "🇵🇰 Urdu" },
    { value: "uyghur", shortValue: "ug", label: "🇨🇳 Uyghur" },
    { value: "vietnamese", shortValue: "vi", label: "🇻🇳 Vietnamese" },
    { value: "yiddish", shortValue: "yi", label: "🇮🇱 Yiddish" },
  ],

  "Europe": [
    { value: "albanian", shortValue: "sq", label: "🇦🇱 Albanian" },
    { value: "belarusian", shortValue: "be", label: "🇧🇾 Belarusian" },
    { value: "bulgarian", shortValue: "bg", label: "🇧🇬 Bulgarian" },
    { value: "catalan", shortValue: "ca", label: "🏴 Catalan" },
    { value: "croatian", shortValue: "hr", label: "🇭🇷 Croatian" },
    { value: "czech", shortValue: "cs", label: "🇨🇿 Czech" },
    { value: "danish", shortValue: "da", label: "🇩🇰 Danish" },
    { value: "dutch", shortValue: "nl", label: "🇳🇱 Dutch" },
    { value: "estonian", shortValue: "et", label: "🇪🇪 Estonian" },
    { value: "french", shortValue: "fr", label: "🇫🇷 French" },
    { value: "finnish", shortValue: "fi", label: "🇫🇮 Finnish" },
    { value: "german", shortValue: "de", label: "🇩🇪 German" },
    { value: "georgian", shortValue: "ka", label: "🇬🇪 Georgian" },
    { value: "greek", shortValue: "el", label: "🇬🇷 Greek" },
    { value: "hungarian", shortValue: "hu", label: "🇭🇺 Hungarian" },
    { value: "italian", shortValue: "it", label: "🇮🇹 Italian" },
    { value: "icelandic", shortValue: "is", label: "🇮🇸 Icelandic" },
    { value: "irish", shortValue: "ga", label: "🇮🇪 Irish" },
    { value: "latin", shortValue: "la", label: "🏛️ Latin" },
    { value: "latvian", shortValue: "lv", label: "🇱🇻 Latvian" },
    { value: "lithuanian", shortValue: "lt", label: "🇱🇹 Lithuanian" },
    { value: "macedonian", shortValue: "mk", label: "🇲🇰 Macedonian" },
    { value: "maltese", shortValue: "mt", label: "🇲🇹 Maltese" },
    { value: "norwegian", shortValue: "no", label: "🇳🇴 Norwegian" },
    { value: "portuguese", shortValue: "pt", label: "🇵🇹 Portuguese" },
    { value: "polish", shortValue: "pl", label: "🇵🇱 Polish" },
    { value: "romanian", shortValue: "ro", label: "🇷🇴 Romanian" },
    { value: "spanish", shortValue: "es", label: "🇪🇸 Spanish" },
    { value: "swedish", shortValue: "sv", label: "🇸🇪 Swedish" },
    { value: "serbian_cyrillic", shortValue: "sr_cyrl", label: "🇷🇸 Serbian (Cyrillic)" },
    { value: "serbian_latin", shortValue: "sr_latn", label: "🇷🇸 Serbian (Latin)" },
    { value: "slovak", shortValue: "sk", label: "🇸🇰 Slovak" },
    { value: "slovenian", shortValue: "sl", label: "🇸🇮 Slovenian" },
    { value: "turkish", shortValue: "tr", label: "🇹🇷 Turkish" },
    { value: "ukrainian", shortValue: "uk", label: "🇺🇦 Ukrainian" },
  ],

  "North America": [
    { value: "french_ca", shortValue: "fr_ca", label: "🇨🇦 Canadian French" },
    { value: "english", shortValue: "en", label: "🇺🇸 English" },
    { value: "haitian_creole", shortValue: "ht", label: "🇭🇹 Haitian Creole" },
  ],

  "Africa": [
    { value: "amharic", shortValue: "am", label: "🇪🇹 Amharic" },
    { value: "swahili", shortValue: "sw", label: "🇹🇿 Swahili" },
    { value: "tigrinya", shortValue: "ti", label: "🇪🇷 Tigrinya" },
  ],

  "South America": [
    { value: "portuguese_br", shortValue: "pt_br", label: "🇧🇷 Brazilian Portuguese" },
    { value: "spanish_419", shortValue: "es_419", label: "🌎 Latin American Spanish" },
  ],
};

export const POPULAR_LANGUAGES = [
  { value: "english", shortValue: "en", label: "🇺🇸 English" },
  { value: "spanish", shortValue: "es", label: "🇪🇸 Spanish" },
  { value: "french", shortValue: "fr", label: "🇫🇷 French" },
  { value: "chinese_simplified", shortValue: "zh_cn", label: "🇨🇳 Simplified Chinese" },
];

export const POPULAR_LANGUAGE_OPTIONS = POPULAR_LANGUAGES.map(lang => ({
  value: lang.shortValue,
  label: lang.label,
}));

export const LANGUAGE_OPTIONS = Object.entries(LANGUAGES_BY_REGION)
  .flatMap(([region, languages]) => 
    languages.map(lang => ({
      value: lang.shortValue,
      label: lang.label,
    }))
  );

// For backwards compatibility
export const LANGUAGES = Object.values(LANGUAGES_BY_REGION).flat();

export const MAX_PAGES_SUBSCRIPTION  = 10000;
