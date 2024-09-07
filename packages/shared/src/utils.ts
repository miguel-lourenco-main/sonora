import { COLLAPSE_PATHS, COLLAPSE_PATHS_FROM } from "./constants";
import { PlainFileObject } from "./interface";

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


// Edgen-related function hidden