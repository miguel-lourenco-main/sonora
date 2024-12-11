import { FILE_SUPPORTED_TYPES } from "./constants";
import { PlainFileObject } from "./types";
import { UseFormReturn } from "react-hook-form";

/**
 * Check if the code is running in a browser environment.
 */
export function isBrowser() {
  return typeof window !== 'undefined';
}

/**
 * Format the currency based on the currency code
 */
export function formatCurrency(params: {
  currencyCode: string;
  locale: string;
  value: string | number;
}) {
  return new Intl.NumberFormat(params.locale, {
    style: 'currency',
    currency: params.currencyCode,
  }).format(Number(params.value));
}

export function filterParagraphs(input: string): string {
  const paragraphs = input.split('\n');
  const filteredParagraphs = paragraphs.filter(paragraph => !paragraph.trim().startsWith('Sources: /'));
  return filteredParagraphs.join('\n');
}

export const handleInsertOrUpdate = <T extends { id: string }>(
  setter: React.Dispatch<React.SetStateAction<T[]>>,
  newItem: T
) => {
  setter((prev) => {
    const index = prev.findIndex(item => item.id === newItem.id);
    if (index !== -1) {
      return [...prev.slice(0, index), newItem, ...prev.slice(index + 1)];
    }
    return [...prev, newItem];
  });
};

export const handleDelete = <T extends { id: string }>(
  setter: React.Dispatch<React.SetStateAction<T[]>>,
  deletedItemId: string
) => {
  setter((prev) => prev.filter(item => item.id !== deletedItemId));
};

// TODO: switch other instances of this function thrghout the repo 
export function fileToPlainObject(file: File): Promise<PlainFileObject> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const plainObject: PlainFileObject = {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        content: reader.result
      };
      resolve(plainObject);
    };

    reader.onerror = () => {
      reject(new Error(reader.error?.message ?? 'Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

export function objectToFile(plainObject: PlainFileObject): File {
  const { name, type, content, lastModified } = plainObject;

  if (typeof content !== 'string') {
    throw new Error('Invalid content format');
  }

  const byteString = atob(content.split(',')[1] ?? ""); // Decode base64
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([uint8Array], { type });
  const file = new File([blob], name, { type, lastModified });

  return file;
}

export function getCurrentTier(pageCount: number, tiers: (number | 'unlimited')[] ){
  
  let index = 0

  for (const tier of tiers) {
    const tierUpTo = tier === 'unlimited' ? Infinity : Number(tier);
    
    if (pageCount > tierUpTo) {
      index=index+1
    }else{
      break
    }
  }

  return index
}

export function getFormKeys<T extends Record<string, unknown>>(form: UseFormReturn<T>) {
  return Object.keys(form.getValues()) as (keyof T)[];
}

export function getFileExtensionType(filename: string): {extension: string, mimeType: string} {
  const extension = filename.split('.').pop()?.toLowerCase();
  if (!extension) return {extension: '', mimeType: ''};

  for (const [mimeType, extensions] of Object.entries(FILE_SUPPORTED_TYPES)) {
    if (extensions.includes(`.${extension}`)) {
      return {extension, mimeType};
    }
  }
  
  return {extension, mimeType: ''};
}

export const generateFallbackId = () => Math.floor(10000 + Math.random() * 90000).toString();