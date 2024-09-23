import { z } from "zod";

export const createThreadFormSchema = z.object({
    knowledge_bases: z.array(z.string()).min(1, "At least one file is required"),
});