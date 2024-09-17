import { customAlphabet } from 'nanoid'
import { IMetadataFile, InputFile, PlainFileObject } from './types'
import { EDGEN_BACKEND_URL } from "@kit/shared/constants";


// TODO: check for duplicate util functions and if they are correctly placed/organized
export function buildUrl(path: string) {
  if (path.startsWith("/")) {
    return `${EDGEN_BACKEND_URL}${path}`;
  }
  return `${EDGEN_BACKEND_URL}/${path}`;
}

export function fetchSS(url: string, options?: RequestInit) {
  const init = options || {
    //credentials: "include",
    //cache: "no-store",
  };
  return fetch(buildUrl(url), init);
}

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
) // 7-character random string

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)

  if (!res.ok) {
    const json = await res.json()
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number
      }
      error.status = res.status
      throw error
    } else {
      throw new Error('An unexpected error occurred')
    }
  }

  return res.json()
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)

export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>
) => {
  fn()
}

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const getStringFromBuffer = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

export enum ResultCode {
  InvalidCredentials = 'INVALID_CREDENTIALS',
  InvalidSubmission = 'INVALID_SUBMISSION',
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
  UnknownError = 'UNKNOWN_ERROR',
  UserCreated = 'USER_CREATED',
  UserLoggedIn = 'USER_LOGGED_IN'
}

export const getMessageFromCode = (resultCode: string) => {
  switch (resultCode) {
    case ResultCode.InvalidCredentials:
      return 'Invalid credentials!'
    case ResultCode.InvalidSubmission:
      return 'Invalid submission, please try again!'
    case ResultCode.UserAlreadyExists:
      return 'User already exists, please log in!'
    case ResultCode.UserCreated:
      return 'User created, welcome!'
    case ResultCode.UnknownError:
      return 'Something went wrong, please try again!'
    case ResultCode.UserLoggedIn:
      return 'Logged in!'
  }
}


const applyFilterToFile = (files: IMetadataFile[]) => {
  return files
    .filter((file: IMetadataFile) => file.extension !== "")
    .filter((file: IMetadataFile) => !file.name.startsWith("tmp_code"))
}

export function getFileInfoFromMessage(metadata: any | null){

  const files: InputFile[] = applyFilterToFile((JSON.parse(metadata).files || []))
  .map((file: IMetadataFile) => {
    return file as InputFile
  })

  return files
}

export function convertToDate(timestamp: string): Date {
    const year = parseInt(timestamp.slice(0, 4));
    const month = parseInt(timestamp.slice(4, 6)) - 1; // Months are 0-based in JavaScript
    const day = parseInt(timestamp.slice(6, 8));
    const hours = parseInt(timestamp.slice(9, 11));
    const minutes = parseInt(timestamp.slice(12, 14));
    const seconds = parseInt(timestamp.slice(15, 17));
    
    return new Date(year, month, day, hours, minutes, seconds);
}

export function fileToObject(file: File): Promise<PlainFileObject> {
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
      reject(reader.error);
    };

    reader.readAsDataURL(file); // Read file content as Data URL (base64)
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
