import { Message as SDKMessage, Session as SDKSession } from 'edgen/models/components'

// TODO: replace and export types put into shared
export type Message = SDKMessage

export interface Chat extends SDKSession{
  path: string
  title:string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Session {
  user: {
    id: string
    email: string
  }
}

export interface AuthResult {
  type: string
  message: string
}

export interface User extends Record<string, any> {
  id: string
  email: string
  password: string
  salt: string
}

// TODO: might need to remove these
export interface InputFile {
  name: string
  path?: string
  file?: File
}

export interface GeneratedFolder {
  name: string
  children: (GeneratedFile | GeneratedFolder) []
}

export interface GeneratedFile {
  name: string,
  path: string
}

export interface IMetadataFile {
  name: string;
  path: string;
  extension: string;
  content: string;
  type: string;
}

export interface PlainFileObject {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  content: string | ArrayBuffer | null;
}
