import { COLLAPSE_PATHS, COLLAPSE_PATHS_FROM } from "./constants";

import { Edgen } from "edgen";
import { HTTPClient } from "edgen/lib/http";
import { RetryConfig } from "edgen/lib/retries";
import { EDGEN_BACKEND_URL } from "./constants"

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

export function processWorkflowMessages(messages: any[]) {
  if (messages.length < 2) return [];

  const terminateMessages = messages
    .filter((message: any) => message.content !== "TERMINATE")
    .map((message: any) => {
      if (message.content.includes("TERMINATE")) {
        return {
          ...message,
          content: filterParagraphs(message.content.replace("\n\nTERMINATE", ""))
        };
      }
      return message;
    });

  const len = terminateMessages.length;
  const lastMessage = terminateMessages[len - 2].receiver === "userproxy"
    ? terminateMessages[len - 2]
    : terminateMessages[len - 1];

  return [terminateMessages[0], lastMessage];
}

export function processChatMessages(messages: any[]) {
  const separateWorkflowMessages = (messages: any[], output: any[]): any[] => {
    if (messages.length < 2) return output;

    const lastWorkflowMessageIndex = messages.findIndex((message: any, index: number) => message.sender === "user" && index !== 0);
    const workflowMessages = lastWorkflowMessageIndex === -1 ? messages : messages.slice(0, lastWorkflowMessageIndex);
    const leftMessages = messages.slice(lastWorkflowMessageIndex);

    const processedWorkflowMessages = processWorkflowMessages(workflowMessages);
    output.push(processedWorkflowMessages[0], processedWorkflowMessages[1]);

    return separateWorkflowMessages(leftMessages, output);
  };

  return separateWorkflowMessages(messages, []);
}

export function checkCollapseSidebar(currentPath: string) {
  return COLLAPSE_PATHS_FROM.some(path => currentPath.startsWith(path)) || COLLAPSE_PATHS.some(path => path === currentPath);
}

export function getEdgenSDKClient({
  oAuth2PasswordBearer,
  httpClient,
  serverIdx,
  serverURL,
  retryConfig
}: {
  oAuth2PasswordBearer?: string | (() => Promise<string>);
  httpClient?: HTTPClient;
  serverIdx?: number;
  serverURL?: string;
  retryConfig?: RetryConfig;
}){
  return new Edgen({
      oAuth2PasswordBearer,
      httpClient,
      serverIdx,
      serverURL: serverURL ?? EDGEN_BACKEND_URL,
      retryConfig
  });
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