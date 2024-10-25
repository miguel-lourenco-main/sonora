import { Page } from '@playwright/test';

export async function refreshPage(page: Page) {
  await page.reload();
  // Wait for the page to load after refresh
  await page.waitForLoadState('networkidle');
}

export async function waitAndRefreshPage(page: Page, waitTime: number) {
  await page.waitForTimeout(waitTime);
  await refreshPage(page);
}
