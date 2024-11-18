
export interface PlainFileObject {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  content: string | ArrayBuffer | null;
}

export interface Language {
  value: string;
  shortValue: string;
  label: string;
}

export interface LanguageRegion {
  code: string;
  name: string;
}