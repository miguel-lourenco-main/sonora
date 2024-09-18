import {
  generateId,
  loadApiKey,
  withoutTrailingSlash,
} from 'vercel-sdk-provider-utils';
import { EdgenChatWorkflow } from './edgen-chat-workflow';
import {
  EdgenChatSettings,
} from './edgen-chat-settings';
import { EDGEN_BACKEND_URL } from './constants';

export interface EdgenProvider {
  (
    sessionId: number,
    workflowId: number,
    settings?: EdgenChatSettings,
  ): EdgenChatWorkflow;

  /**
Creates a model for text generation.
*/
  languageModel(
    sessionId: number,
    workflowId: number,
    settings?: EdgenChatSettings,
  ): EdgenChatWorkflow;

  /**
Creates a model for text generation.
*/
  chat(
    sessionId: number,
    workflowId: number,
    settings?: EdgenChatSettings,
  ): EdgenChatWorkflow;
}

export interface EdgenProviderSettings {
  /**
Use a different URL prefix for API calls, e.g. to use proxy servers.
The default prefix is `https://api.edgen.ai/v1`.
   */
  baseURL?: string;

  /**
@deprecated Use `baseURL` instead.
   */
  baseUrl?: string;

  /**
API key that is being send using the `Authorization` header.
It defaults to the `MISTRAL_API_KEY` environment variable.
   */
  apiKey?: string;

  /**
Custom headers to include in the requests.
     */
  headers?: Record<string, string>;

  /**
Custom fetch implementation. You can use it as a middleware to intercept requests,
or to provide a custom fetch implementation for e.g. testing.
    */
  fetch?: typeof fetch;

  generateId?: () => string;
}

/**
Create a Edgen AI provider instance.
 */
export function createEdgen(
  options: EdgenProviderSettings = {},
): EdgenProvider {
  const baseURL =
    withoutTrailingSlash(options.baseURL ?? options.baseUrl) ??
    EDGEN_BACKEND_URL;

    // TODO: remove this hardcoded url

  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: 'EDGEN_API_KEY', // For our backend, we use authorization token
      description: 'Edgen',
    })}`,
    ...options.headers,
  });

  const createChatWorkflow = (
    sessionId: number,
    workflowId: number,
    settings: EdgenChatSettings = {},
  ) =>
    new EdgenChatWorkflow(sessionId, workflowId, settings, {
      provider: 'edgen.chat',
      baseURL,
      headers: getHeaders,
      generateId: options.generateId ?? generateId,
      fetch: options.fetch,
    },  options.apiKey ?? ""); // TODO: there always needs to be an apiKey/authToken

  const provider = function (
    sessionId: number,
    workflowId: number,
    settings?: EdgenChatSettings,
  ) {
    if (new.target) {
      throw new Error(
        'The Edgen model function cannot be called with the new keyword.',
      );
    }

    return createChatWorkflow(sessionId, workflowId, settings);
  };

  provider.languageModel = createChatWorkflow;
  provider.chat = createChatWorkflow;

  return provider as EdgenProvider;
}

/**
Default Edgen provider instance.
 */
export const edgen = createEdgen();
