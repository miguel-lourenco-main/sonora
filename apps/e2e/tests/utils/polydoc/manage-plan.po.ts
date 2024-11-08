import { expect, Page } from '@playwright/test';

// Represents the page at '/app/billing'
export class PolydocManagePlanPageObject {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Locators */

  planStatus() {
    return this.page.locator('[data-test="current-plan-card-status-badge"]');
  }

  planName() {
    return this.page.locator('[data-test="polydoc-current-plan-card-product-name"]');
  }

  planLeftTokens() {
    return this.page.locator('[data-test="polydoc-current-pages-left"]').all();
  }

  planMonthlyTokens() {
    return this.page.locator('[data-test="polydoc-current-pages-monthly"]').all();
  }

  upgradePlanButton() {
    return this.page.locator('[data-test="polydoc-billing-upgrade-button"]');
  }

  customerPortalButton() {
    return this.page.locator('[data-test="manage-billing-redirect-button"]');
  }
  
  downgradeSubscriptionInfo() {
    return this.page.locator('[data-testid="polydoc-billing-downgrade-subscription-alert"]')
  }


  /** Actions */

  async goToUpgradePlanPage() {
    await this.upgradePlanButton().click();
  }

  async goToCustomerPortal() {
    await this.customerPortalButton().click();
  }
}
