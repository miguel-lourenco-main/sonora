export interface PlainFileObject {
    name: string;
    type: string;
    size: number;
    lastModified: number;
    content: string | ArrayBuffer | null;
  }