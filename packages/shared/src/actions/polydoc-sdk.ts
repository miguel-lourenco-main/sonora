'use server'

import { SDKError, SDKValidationError } from "polydoc-typescript/models/errors";
import { Polydoc } from "polydoc-typescript";
import { PlainFileObject } from "../interface";
import { objectToFile } from "../utils"
import { getAuthToken } from "@kit/supabase/get-auth-token"

function getPolydocClient(auth_token: string) {
  return new Polydoc({
    bearerAuth: auth_token,
  });
}

export async function createRun(fileId: string, targetLanguage: string) {

  try {

    const auth_token = await getAuthToken()

    if(!auth_token) {
      throw new Error('No auth token found')
    }

    const client = getPolydocClient(auth_token);

    const result = await client.runs.runsCreate({
        inputFileId: fileId,
        targetLanguage: targetLanguage,
    });

    return { result };

  } catch (error) {
    if (error instanceof SDKValidationError) {
      console.error('Validation error:', error.pretty());
    } else if (error instanceof SDKError) {
      console.error('SDK error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

export async function createFile(file: File) {
  try {

    const auth_token = await getAuthToken()

    if(!auth_token) {
      throw new Error('No auth token found')
    }

    const client = getPolydocClient(auth_token);

    const result = await client.files.filesCreate({
        data: file
    });

    return { result };

  } catch (error) {
    if (error instanceof SDKValidationError) {
      console.error('Validation error:', error.pretty());
    } else if (error instanceof SDKError) {
      console.error('SDK error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

export async function getFiles() {

  try {

    const auth_token = await getAuthToken()

    if(!auth_token) {
      throw new Error('No auth token found')
    }

    const client = getPolydocClient(auth_token);

    const result = await client.files.filesList();

    return { result };

  } catch (error) {
    if (error instanceof SDKValidationError) {
      console.error('Validation error:', error.pretty());
    } else if (error instanceof SDKError) {
      console.error('SDK error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

export async function getRuns() {

  try {

    const auth_token = await getAuthToken()

    if(!auth_token) {
      throw new Error('No auth token found')
    }

    const client = getPolydocClient(auth_token);

    const result = await client.runs.runsList();

    return { result };

  } catch (error) {
    if (error instanceof SDKValidationError) {
      console.error('Validation error:', error.pretty());
    } else if (error instanceof SDKError) {
      console.error('SDK error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

export async function submitFileTranslation(fileObject: PlainFileObject, targetLanguage: string) {

  try {

    const auth_token = await getAuthToken()

    if(!auth_token) {
      throw new Error('No auth token found')
    }

    const client = getPolydocClient(auth_token);

    const file = objectToFile(fileObject);

    const createdFile = await client.files.filesCreate({
        data: file
    });

    await client.runs.runsCreate({
        inputFileId: createdFile.id,
        targetLanguage: targetLanguage,
    });

  } catch (error) {
    if (error instanceof SDKValidationError) {
      console.error('Validation error:', error.pretty());
    } else if (error instanceof SDKError) {
      console.error('SDK error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

export async function submitFileListTranslation(fileObject: PlainFileObject[], targetLanguage: string) {

    try {

        const auth_token = await getAuthToken()

        if(!auth_token) {
            throw new Error('No auth token found')
        }

      const client = getPolydocClient(auth_token);

      const files = fileObject.map(file => objectToFile(file));
      
      files.forEach(async file => {
        
        const createdFile = await client.files.filesCreate({
          data: file
        });

        console.log(createdFile)

        await client.runs.runsCreate({
            inputFileId: createdFile.id,
            targetLanguage: targetLanguage,
        });

        console.log('finished run')
      });
  
    } catch (error) {
      if (error instanceof SDKValidationError) {
        console.error('Validation error:', error.pretty());
      } else if (error instanceof SDKError) {
        console.error('SDK error:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  }
  
