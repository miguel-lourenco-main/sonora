import { z } from "zod";
import { formSchema } from "./schemas/translate-files";
import { TrackableFile } from "@kit/shared/types";

export type PDFFile = string | File | null;

export type FormData = z.infer<typeof formSchema>;

export type DirectionOptions = "rtl" | "ltr" | undefined;

export type CustomFileUploaderProps = {
  files: TrackableFile[];
  addFiles: (files: TrackableFile[]) => void;
  removeFiles: (files: TrackableFile[]) => void;
  className?: string;
  orientation?: "horizontal" | "vertical";
  acceptFiles?: Record<string, string[]>;
  children?: React.ReactNode;
  disabled?: boolean;
};

