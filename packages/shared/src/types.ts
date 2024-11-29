import { JSX } from "react";

export type TrackableFile = File & {
    id?: string;
    uploadingStatus?: "uploading" | "uploaded" | "client" | "error";
};

export type FileSet = {
  original: File | null;
  translated: File | null;
};

export type TabData = {
  icon: JSX.Element;
  file: string;
  exampleFiles: FileSet;
};