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
  "Western Europe": [
    { value: "english", shortValue: "en", label: "🇬🇧 English" },
    { value: "french", shortValue: "fr", label: "🇫🇷 French" },
    { value: "german", shortValue: "de", label: "🇩🇪 German" },
    { value: "spanish", shortValue: "es", label: "🇪🇸 Spanish" },
    { value: "italian", shortValue: "it", label: "🇮🇹 Italian" },
    { value: "portuguese", shortValue: "pt", label: "🇵🇹 Portuguese" },
    { value: "dutch", shortValue: "nl", label: "🇳🇱 Dutch" },
  ],

  "Northern Europe": [
    { value: "swedish", shortValue: "se", label: "🇸🇪 Swedish" },
    { value: "norwegian", shortValue: "no", label: "🇳🇴 Norwegian" },
    { value: "danish", shortValue: "dk", label: "🇩🇰 Danish" },
    { value: "finnish", shortValue: "fi", label: "🇫🇮 Finnish" },
    { value: "icelandic", shortValue: "is", label: "🇮🇸 Icelandic" },
  ],

  "Eastern Europe": [
    { value: "russian", shortValue: "ru", label: "🇷🇺 Russian" },
    { value: "polish", shortValue: "pl", label: "🇵🇱 Polish" },
    { value: "ukrainian", shortValue: "uk", label: "🇺🇦 Ukrainian" },
    { value: "czech", shortValue: "cs", label: "🇨🇿 Czech" },
    { value: "slovak", shortValue: "sk", label: "🇸🇰 Slovak" },
    { value: "hungarian", shortValue: "hu", label: "🇭🇺 Hungarian" },
    { value: "romanian", shortValue: "ro", label: "🇷🇴 Romanian" },
    { value: "bulgarian", shortValue: "bg", label: "🇧🇬 Bulgarian" },
  ],

  "East Asia": [
    { value: "chinese", shortValue: "zh", label: "🇨🇳 Chinese" },
    { value: "japanese", shortValue: "ja", label: "🇯🇵 Japanese" },
    { value: "korean", shortValue: "ko", label: "🇰🇷 Korean" },
  ],

  "Southeast Asia": [
    { value: "vietnamese", shortValue: "vi", label: "🇻🇳 Vietnamese" },
    { value: "thai", shortValue: "th", label: "🇹🇭 Thai" },
    { value: "indonesian", shortValue: "id", label: "🇮🇩 Indonesian" },
    { value: "malay", shortValue: "ms", label: "🇲🇾 Malay" },
  ],

  "South Asia": [
    { value: "hindi", shortValue: "hi", label: "🇮🇳 Hindi" },
    { value: "bengali", shortValue: "bn", label: "🇧🇩 Bengali" },
    { value: "urdu", shortValue: "ur", label: "🇵🇰 Urdu" },
  ],

  "Americas": [
    { value: "english_us", shortValue: "en_us", label: "🇺🇸 English (US)" },
    { value: "spanish_mx", shortValue: "es_mx", label: "🇲🇽 Spanish (Mexico)" },
    { value: "portuguese_br", shortValue: "pt_br", label: "🇧🇷 Portuguese (Brazil)" },
    { value: "french_ca", shortValue: "fr_ca", label: "🇨🇦 French (Canada)" },
  ],
};

export const LANGUAGE_OPTIONS = Object.entries(LANGUAGES_BY_REGION).map(([region, languages]) => ({
  group: region,
  items: languages.map(lang => ({
    value: lang.shortValue,
    label: lang.label,
  }))
})).flatMap(group => group.items);

// For backwards compatibility
export const LANGUAGES = Object.values(LANGUAGES_BY_REGION).flat();

export const MAX_PAGES_SUBSCRIPTION  = 10000;
