import { Page, expect } from '@playwright/test';
import { StripePageObject } from '../stripe.po';

export class PolydocBillingPagesObject {
    public readonly stripe: StripePageObject;
  
    constructor(private readonly page: Page) {
      this.stripe = new StripePageObject(page);
    }
  
    plans() {
      return this.page.locator('[data-test-plan]');
    }
  
    async selectPlan(index = 1) {
      await expect(async () => {
        const plans = this.plans();
        const plan = plans.nth(index);
  
        await expect(plan).toBeVisible();
  
        await this.page.waitForTimeout(500); 
  
        await plan.click();
      }).toPass();
    }
  
    async returnToBilling() {
      // wait a bit for the webhook to be processed
      await this.page.waitForTimeout(1000);
  
      return this.page
        .locator('[data-test="checkout-success-back-link"]')
        .click();
    }
  
    proceedToCheckout() {
      return this.page.click('[data-test="checkout-submit-button"]');
    }
  
    manageBillingButton() {
      return this.page.locator('[data-test="manage-billing-redirect-button"]');
    }
  
    successStatus() {
      return this.page.locator('[data-test="payment-return-success"]');
    }
  
    getStatus() {
      return this.page.locator('[data-test="current-plan-card-status-badge"]');
    }
  
    getProductName() {
      return this.page.locator('[data-test="polydoc-current-plan-card-product-name"]');
    }
  
    getLeftTokens() {
      return this.page.locator('[data-test="polydoc-current-pages-left"]');
    }
  
    getMonthlyTokens() {
      return this.page.locator('[data-test="polydoc-current-pages-monthly"]');
    }
  
    getUpgradeButton() {
      return this.page.locator('[data-test="polydoc-billing-upgrade-button"]');
    }
  
    getBillingPortalButton() {
      return this.page.locator('[data-test="manage-billing-redirect-button"]');
    }

    //getCancelChangeButton() {
  
    async selectTokenQuantity(quantity: number) {
    
      await this.page.locator('[data-test="polydoc-billing-quantity-input-hidden"]').fill(quantity.toString()); // Enter new value
  
      /**
       *     await input.click(); // Focus the input
            await input.press('Backspace'.repeat(1)); // Clear existing value
       */
    }
  
    refreshPage() {
      return this.page.reload();
    }

    async subscribeToProPlanCheckout(quantity: number) {

      await this.selectTokenQuantity(quantity)

      await this.proceedToCheckout();
      await this.stripe.waitForForm();
      await this.stripe.fillForm();
      await this.stripe.submitForm();
      await expect(this.successStatus()).toBeVisible({
        timeout: 25_000,
      });

      await this.returnToBilling();
    }

    async isSubscriptionPro(quantity: number) {
      await expect(this.getProductName()).toContainText('Pro');
      await expect(this.getMonthlyTokens()).toContainText(`${quantity}`);
      await expect(this.manageBillingButton()).toBeVisible();
    }
  
    async isSubscriptionFree() {
      await expect(this.getProductName()).toContainText('Free');
      await expect(this.getMonthlyTokens()).toContainText(`5`);
      await expect(this.getUpgradeButton()).toBeVisible();
    }
  }
  
  export class PlanPickerPageObject {
    public readonly stripe: StripePageObject;
  
    constructor(private readonly page: Page) {
      this.stripe = new StripePageObject(page);
    }
  
    plans() {
      return this.page.locator('[data-test-plan]');
    }
  
    async selectPlan(index = 1) {
      await expect(async () => {
        const plans = this.plans();
        const plan = plans.nth(index);
  
        await expect(plan).toBeVisible();
  
        await this.page.waitForTimeout(500); 
  
        await plan.click();
      }).toPass();
    }
  
    manageBillingButton() {
      return this.page.locator('[data-test="manage-billing-redirect-button"]');
    }
  
    successStatus() {
      return this.page.locator('[data-test="payment-return-success"]');
    }
  
    async returnToBilling() {
      // wait a bit for the webhook to be processed
      await this.page.waitForTimeout(1000);
  
      return this.page
        .locator('[data-test="checkout-success-back-link"]')
        .click();
    }
  
    proceedToCheckout() {
      return this.page.click('[data-test="checkout-submit-button"]');
    }
  
    getStatus() {
      return this.page.locator('[data-test="current-plan-card-status-badge"]');
    }
  
    getProductName() {
      return this.page.locator('[data-test="polydoc-current-plan-card-product-name"]');
    }
  
    getLeftTokens() {
      return this.page.locator('[data-test="polydoc-current-pages-left"]');
    }
  
    getMonthlyTokens() {
      return this.page.locator('[data-test="polydoc-current-pages-monthly"]');
    }
  
    getUpgradeButton() {
      return this.page.locator('[data-test="polydoc-billing-upgrade-button"]');
    }
  
    getBillingPortalButton() {
      return this.page.locator('[data-test="manage-billing-redirect-button"]');
    }
  }