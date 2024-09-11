import { z } from "zod";
import { formSchema } from "./schemas/translate-files";
import { Dispatch, SetStateAction } from "react";

export type PDFFile = string | File | null;

export type FormData = z.infer<typeof formSchema>;

export type DirectionOptions = "rtl" | "ltr" | undefined;

export type CustomFileUploaderProps = {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  className?: string;
  orientation?: "horizontal" | "vertical";
  acceptFiles?: { [key: string]: string[] };
  children?: React.ReactNode;
};
