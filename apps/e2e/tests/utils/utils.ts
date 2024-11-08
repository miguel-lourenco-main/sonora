import { Page } from "@playwright/test";
import { refreshPage } from "./general";

export async function retryOperation(
  operation: () => Promise<void>,
  page: Page,
  maxAttempts = 3,
  timeout = 10000
) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {

      if(attempt > 1) {
        await refreshPage(page);
      }

      await operation();
      return;
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error);
      lastError = error;
      
      if (attempt === maxAttempts) break;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  throw lastError;
}