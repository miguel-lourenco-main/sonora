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
 *@name formatCurrency
 * @description Format the currency based on the currency code
 */
export function formatCurrency(currencyCode: string, value: string | number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(Number(value));
}

export function filterParagraphs(input: string): string {
  // Split the input string into paragraphs by new lines
  const paragraphs = input.split('\n');

  // Filter out the paragraphs that start with "Sources: /"
  const filteredParagraphs = paragraphs.filter(paragraph => !paragraph.trim().startsWith('Sources: /'));

  // Join the filtered paragraphs back into a single string
  return filteredParagraphs.join('\n');
}

// Return the last message and first message of the workflow
export function proccessWorkflowMessages(messages: any[]){
  // filter first message if it is not releavant

  if(messages.length < 2) return []

  // filter messages whose content is TERMINATE
  let terminateMessages = messages
    .filter((message: any) => message.content !== "TERMINATE")
    .map((message: any) => {
      if(message.content.includes("TERMINATE")){
        return {
          ...message,
          content: filterParagraphs(message.content.replace("\n\nTERMINATE", ""))
        }
      }
      
      else return message;
    });

  const len = terminateMessages.length

  // Assumes that messages are exchanged in pairs
  let lastMessage = terminateMessages[len-2].receiver === "userproxy"
                  ? terminateMessages[len-2]
                  : terminateMessages[len-1]

  return [terminateMessages[0], lastMessage]
}

export function processChatMessages(messages: any[]){

  const separateWorklfowMessages = (messages: any[], output: any[]): any[] => {
    // Assume that the first message is always from the user
    // To get all messages from a workflow, we need to know when is the next user message

    if(messages.length < 2) return output

    const lastWorkflowMessageIndex = messages.findIndex((message: any, index: number) => message.sender === "user" && index !== 0)

    let workflowMessages

    if(lastWorkflowMessageIndex === -1) workflowMessages = messages
    else workflowMessages = messages.slice(0, lastWorkflowMessageIndex)

    const leftMessages = messages.slice(lastWorkflowMessageIndex, messages.length - 1)

    const processedWorkflowMessages = proccessWorkflowMessages(workflowMessages)

    const finalMessage = processedWorkflowMessages[processedWorkflowMessages.length - 1]

    output.push(processedWorkflowMessages[0])
    output.push(processedWorkflowMessages[1])

    return separateWorklfowMessages(leftMessages, output)
  }

  return separateWorklfowMessages(messages, [])
}

export function checkCollpaseSidebar(currentPath: string){

  return COLLAPSE_PATHS_FROM.some(path => currentPath.startsWith(path)) || COLLAPSE_PATHS.some(path => path === currentPath)
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
