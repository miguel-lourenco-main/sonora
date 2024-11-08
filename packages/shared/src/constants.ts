import { z } from 'zod';
import { Language } from './interfaces';

export const EDGEN_BACKEND_URL = process.env.EDGEN_BACKEND_URL || "http://127.0.0.1:30000";

export const FILE_SUPPORTED_TYPES ={
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "application/pdf": [".pdf"],
    "application/vnd.ms-powerpoint": [".ppt"],
}

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

export const LANGUAGES: Language[] = [
    { value: "english", shortValue: "en", label: "🇬🇧 English" },
    { value: "chinese", shortValue: "zh", label: "🇨🇳 Chinese" },
    { value: "french", shortValue: "fr", label: "🇫🇷 French" },
    { value: "german", shortValue: "de", label: "🇩🇪 German" },
    { value: "italian", shortValue: "it", label: "🇮🇹 Italian" },
    { value: "japanese", shortValue: "ja", label: "🇯🇵 Japanese" },
    { value: "korean", shortValue: "ko", label: "🇰🇷 Korean" },
    { value: "polish", shortValue: "pl", label: "🇵🇱 Polish" },
    { value: "portuguese", shortValue: "pt", label: "🇵🇹 Portuguese" },
    { value: "romanian", shortValue: "ro", label: "🇷🇴 Romanian" },
    { value: "russian", shortValue: "ru", label: "🇷🇺 Russian" },
    { value: "spanish", shortValue: "es", label: "🇪🇸 Spanish" },
]

export const MAX_PAGES_SUBSCRIPTION  = 10000;
