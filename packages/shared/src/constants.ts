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
    { longValue: "arabic", value: "ar", label: "🇸🇦 Arabic" },
    { longValue: "armenian", value: "hy", label: "🇦🇲 Armenian" },
    { longValue: "azerbaijani", value: "az", label: "🇦🇿 Azerbaijani" },
    { longValue: "bengali", value: "bn", label: "🇧🇩 Bengali" },
    { longValue: "burmese", value: "my", label: "🇲🇲 Burmese" },
    { longValue: "cantonese", value: "yue", label: "🇭🇰 Cantonese" },
    { longValue: "filipino", value: "fil", label: "🇵🇭 Filipino" },
    { longValue: "gujarati", value: "gu", label: "🇮🇳 Gujarati" },
    { longValue: "hebrew", value: "he", label: "🇮🇱 Hebrew" },
    { longValue: "hindi", value: "hi", label: "🇮🇳 Hindi" },
    { longValue: "indonesian", value: "id", label: "🇮🇩 Indonesian" },
    { longValue: "japanese", value: "ja", label: "🇯🇵 Japanese" },
    { longValue: "japanese_honorific", value: "ja_hon", label: "🇯🇵 Japanese (Honorifics)" },
    { longValue: "japanese_humble", value: "ja_hum", label: "🇯🇵 Japanese (Humble)" },
    { longValue: "japanese_polite", value: "ja_pol", label: "🇯🇵 Japanese (Polite)" },
    { longValue: "korean", value: "ko", label: "🇰🇷 Korean" },
    { longValue: "kazakh", value: "kk", label: "🇰🇿 Kazakh" },
    { longValue: "khmer", value: "km", label: "🇰🇭 Khmer" },
    { longValue: "kannada", value: "kn", label: "🇮🇳 Kannada" },
    { longValue: "lao", value: "lo", label: "🇱🇦 Lao" },
    { longValue: "malay", value: "ms", label: "🇲🇾 Malay" },
    { longValue: "mongolian", value: "mn", label: "🇲🇳 Mongolian (Cyrillic)" },
    { longValue: "marathi", value: "mr", label: "🇮🇳 Marathi" },
    { longValue: "malayalam", value: "ml", label: "🇮🇳 Malayalam" },
    { longValue: "odia", value: "or", label: "🇮🇳 Odia" },
    { longValue: "persian", value: "fa", label: "🇮🇷 Persian" },
    { longValue: "punjabi", value: "pa", label: "🇮🇳 Punjabi" },
    { longValue: "russian", value: "ru", label: "🇷🇺 Russian" },
    { longValue: "chinese_simplified", value: "zh_cn", label: "🇨🇳 Simplified Chinese" },
    { longValue: "sinhala", value: "si", label: "🇱🇰 Sinhalese" },
    { longValue: "chinese_hk", value: "zh_hk", label: "🇭🇰 Traditional Chinese (Hong Kong)" },
    { longValue: "chinese_tw", value: "zh_tw", label: "🇹🇼 Traditional Chinese (Taiwan)" },
    { longValue: "chinese_traditional", value: "zh_t", label: "🇹🇼 Traditional Chinese" },
    { longValue: "thai", value: "th", label: "🇹🇭 Thai" },
    { longValue: "tamil", value: "ta", label: "🇮🇳 Tamil" },
    { longValue: "telugu", value: "te", label: "🇮🇳 Telugu" },
    { longValue: "uzbek", value: "uz", label: "🇺🇿 Uzbek" },
    { longValue: "urdu", value: "ur", label: "🇵🇰 Urdu" },
    { longValue: "uyghur", value: "ug", label: "🇨🇳 Uyghur" },
    { longValue: "vietnamese", value: "vi", label: "🇻🇳 Vietnamese" },
    { longValue: "yiddish", value: "yi", label: "🇮🇱 Yiddish" },
  ],

  "Europe": [
    { longValue: "albanian", value: "sq", label: "🇦🇱 Albanian" },
    { longValue: "belarusian", value: "be", label: "🇧🇾 Belarusian" },
    { longValue: "bulgarian", value: "bg", label: "🇧🇬 Bulgarian" },
    { longValue: "catalan", value: "ca", label: "🏴 Catalan" },
    { longValue: "croatian", value: "hr", label: "🇭🇷 Croatian" },
    { longValue: "czech", value: "cs", label: "🇨🇿 Czech" },
    { longValue: "danish", value: "da", label: "🇩🇰 Danish" },
    { longValue: "dutch", value: "nl", label: "🇳🇱 Dutch" },
    { longValue: "estonian", value: "et", label: "🇪🇪 Estonian" },
    { longValue: "french", value: "fr", label: "🇫🇷 French" },
    { longValue: "finnish", value: "fi", label: "🇫🇮 Finnish" },
    { longValue: "german", value: "de", label: "🇩🇪 German" },
    { longValue: "georgian", value: "ka", label: "🇬🇪 Georgian" },
    { longValue: "greek", value: "el", label: "🇬🇷 Greek" },
    { longValue: "hungarian", value: "hu", label: "🇭🇺 Hungarian" },
    { longValue: "italian", value: "it", label: "🇮🇹 Italian" },
    { longValue: "icelandic", value: "is", label: "🇮🇸 Icelandic" },
    { longValue: "irish", value: "ga", label: "🇮🇪 Irish" },
    { longValue: "latin", value: "la", label: "🏛️ Latin" },
    { longValue: "latvian", value: "lv", label: "🇱🇻 Latvian" },
    { longValue: "lithuanian", value: "lt", label: "🇱🇹 Lithuanian" },
    { longValue: "macedonian", value: "mk", label: "🇲🇰 Macedonian" },
    { longValue: "maltese", value: "mt", label: "🇲🇹 Maltese" },
    { longValue: "norwegian", value: "no", label: "🇳🇴 Norwegian" },
    { longValue: "portuguese", value: "pt", label: "🇵🇹 Portuguese" },
    { longValue: "polish", value: "pl", label: "🇵🇱 Polish" },
    { longValue: "romanian", value: "ro", label: "🇷🇴 Romanian" },
    { longValue: "spanish", value: "es", label: "🇪🇸 Spanish" },
    { longValue: "swedish", value: "sv", label: "🇸🇪 Swedish" },
    { longValue: "serbian_cyrillic", value: "sr_cyrl", label: "🇷🇸 Serbian (Cyrillic)" },
    { longValue: "serbian_latin", value: "sr_latn", label: "🇷🇸 Serbian (Latin)" },
    { longValue: "slovak", value: "sk", label: "🇸🇰 Slovak" },
    { longValue: "slovenian", value: "sl", label: "🇸🇮 Slovenian" },
    { longValue: "turkish", value: "tr", label: "🇹🇷 Turkish" },
    { longValue: "ukrainian", value: "uk", label: "🇺🇦 Ukrainian" },
  ],

  "North America": [
    { longValue: "french_ca", value: "fr_ca", label: "🇨🇦 Canadian French" },
    { longValue: "english", value: "en", label: "🇺🇸 English" },
    { longValue: "haitian_creole", value: "ht", label: "🇭🇹 Haitian Creole" },
  ],

  "Africa": [
    { longValue: "amharic", value: "am", label: "🇪🇹 Amharic" },
    { longValue: "swahili", value: "sw", label: "🇹🇿 Swahili" },
    { longValue: "tigrinya", value: "ti", label: "🇪🇷 Tigrinya" },
  ],

  "South America": [
    { longValue: "portuguese_br", value: "pt_br", label: "🇧🇷 Brazilian Portuguese" },
    { longValue: "spanish_419", value: "es_419", label: "🌎 Latin American Spanish" },
  ],
};

export const POPULAR_LANGUAGES = [
  { longValue: "english", value: "en", label: "🇺🇸 English" },
  { longValue: "spanish", value: "es", label: "🇪🇸 Spanish" },
  { longValue: "french", value: "fr", label: "🇫🇷 French" },
  { longValue: "chinese_simplified", value: "zh_cn", label: "🇨🇳 Simplified Chinese" },
];

export const DEFAULT_TARGET_LANGUAGE = POPULAR_LANGUAGES[0]?.value ?? 'en'

// For backwards compatibility
export const LANGUAGES = Object.values(LANGUAGES_BY_REGION).flat();

export const MAX_PAGES_SUBSCRIPTION  = 10000;
