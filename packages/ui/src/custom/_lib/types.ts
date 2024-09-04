import { z } from "zod";
import { formSchema } from "./schemas/translate-files";

export type PDFFile = string | File | null;

export type FormData = z.infer<typeof formSchema>;
