import { Page } from '@playwright/test';

export async function refreshPage(page: Page) {
  try {
    // Wait for the page to be in a stable state before reloading
    await page.waitForLoadState('domcontentloaded');
    await Promise.all([
      page.waitForLoadState('load'),
      page.reload()
    ]);
    await page.waitForLoadState('networkidle');
  } catch (error) {
    console.error('Error during page refresh:', error);
    throw error;
  }
}

export async function waitAndRefreshPage(page: Page, waitTime: number) {
  await page.waitForTimeout(waitTime);
  await refreshPage(page);
}
