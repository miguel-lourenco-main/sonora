import { z } from "zod";

export const formSchema = z.object({
    files: z.array(z.instanceof(File)).min(1, "At least one file is required"),
    targetLanguage: z.array(z.string()).min(1, "At least one target language is required"),
});