import { z } from 'zod';

export const EDGEN_BACKEND_URL = process.env.EDGEN_BACKEND_URL || "http://127.0.0.1:30000/v1";

export const FILE_SUPPORTED_TYPES = ".txt, .pdf"
export const FILE_SUPPORTED_TYPES_ARRAY = FILE_SUPPORTED_TYPES.split(",").map((type) => type.trim())

export const COLLAPSIBLE_SIZE = 4

export const DEFAULT_FILE_TREE = {name: "root_generated", children: [], id: "root_generated", isSelectable: true}

/////////// PATHS ///////////////
export const CHAT_PAGE_PATH = "/app/chat"
export const WORKFLOWS_PAGE_PATH = "/workflows"
export const WORKFLOW_INFO_PAGE_PATH = "/workflows/[workflowId]"

export const FILE_TRANSLATIONS_PAGE_PATH = "/app/file-translations"

export const CONNECTOR_DRAG_N_DROP_HEIGHT = "25rem"

export const COLLAPSE_PATHS_FROM = [CHAT_PAGE_PATH]

export const COLLAPSE_PATHS = [CHAT_PAGE_PATH]

export const EDGEN_CUSTOM_PATHS_SCHEMA = {
    chat: z.string().min(1),
    workflows: z.string().min(1),
    workflowInfo: z.string().min(1),
    fileTranslations: z.string().min(1)
}

export const EDGEN_CUSTOM_PATHS = {
    chat: CHAT_PAGE_PATH,
    workflows: WORKFLOWS_PAGE_PATH,
    workflowInfo: WORKFLOW_INFO_PAGE_PATH,
    fileTranslations: FILE_TRANSLATIONS_PAGE_PATH
}


export const POLYDOC_CUSTOM_PATHS_SCHEMA = {

}

export const POLYDOC_CUSTOM_PATHS = {
    
}

export const LANGUAGES = [
    { value: "chinese", label: "🇨🇳 Chinese" },
    { value: "english", label: "🇬🇧 English" },
    { value: "french", label: "🇫🇷 French" },
    { value: "german", label: "🇩🇪 German" },
    { value: "italian", label: "🇮🇹 Italian" },
    { value: "japanese", label: "🇯🇵 Japanese" },
    { value: "korean", label: "🇰🇷 Korean" },
    { value: "polish", label: "🇵🇱 Polish" },
    { value: "portuguese", label: "🇵🇹 Portuguese" },
    { value: "romanian", label: "🇷🇴 Romanian" },
    { value: "russian", label: "🇷🇺 Russian" },
    { value: "spanish", label: "🇪🇸 Spanish" },
]
