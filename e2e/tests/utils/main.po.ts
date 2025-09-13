import { Page } from "@playwright/test";

export class MainPageObject {
  
  constructor(private readonly page: Page) {}

  marketingPage() {
    return this.page.locator('[data-test-page="marketing"]');
  }

  signUpButton() {
    return this.page.locator('[data-test="sign-up"]');
  }
}
