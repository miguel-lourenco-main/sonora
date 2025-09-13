import { Page, expect } from '@playwright/test';
import { CURRENT_TIMEOUTS } from '../timeouts';

// Represents the page at '/app/billing/upgrade'
export class PolydocUpgradePlanPageObject {

  constructor(private readonly page: Page) {}


  /** Locators */

  plans() {
    return this.page.locator('[data-test-plan]');
  }

  plan(planId: string) {
    return this.page.locator(`[data-test-plan="${planId}"]`);
  }

  checkoutSubmitButton() {
    return this.page.locator('[data-test="checkout-submit-button"]');
  }

  pagesQuantityInput() {
    return this.page.locator('[data-test="polydoc-billing-quantity-input"]');
  }

  successStatus() {
    return this.page.locator('[data-test="payment-return-success"]');
  }

  returnToManageBillingButton() {
    return this.page.locator('[data-test="checkout-success-back-link"]');
  }


  /** Actions */

  async proceedToCheckout() {
    await this.checkoutSubmitButton().click();
  }

  async returnToManageBilling() {
    await this.returnToManageBillingButton().click();
  }

  async selectPlan(planName: string) {
    const plan = this.plan(planName);

    await expect(plan).toBeVisible();

    await plan.click({timeout: CURRENT_TIMEOUTS.element});
  }

  async selectPagesQuantity(quantity: number) {

    await this.pagesQuantityInput().click();

    //TODO: improve this logic, because everything in the screen is being displayed
    await this.page.keyboard.press('Control+A'); // Select all existing content
    await this.page.keyboard.press('Backspace'); // Clear the content

    await this.page.keyboard.type(quantity.toString(), { delay: 100 }); // Type new value

    // Click outside the input to unselect
    await this.page.click('body', { position: { x: 0, y: 0 }, timeout: CURRENT_TIMEOUTS.element });
  }
}
