import { expect, Page } from '@playwright/test';
//import { forceRenewSubscription } from '@kit/stripe';

export class StripeCustomerPortalPageObject {
    private readonly page: Page;
  
    constructor(page: Page) {
      this.page = page;
    }
  

    //** Locators **//

    updatePlanButton() {
      return this.page.locator('[data-test="update-subscription"]');
    }

    pricingTableCard(plan: string) {
      return this.page.locator(`[data-testid="pricing-table-card"]:has-text("${plan}")`);
    }
  
    quantityInput() {
      return this.page.locator('[data-testid="portal-quantity-editor"]');
    }
    
    continueButton() {
      return this.page.locator('[data-testid="continue-button"]');
    }
  
    payAndSubscribeButton() {
      return this.page.locator('[data-testid="confirm"]:has-text("Subscribe and pay")');
    }

    cancelChangeButton() {
      return this.page.locator('[data-testid="confirm"]:has-text("Cancel change")');
    }
  
    returnToAppButton() {
      return this.page.locator('[data-testid="return-to-business-link"]');
    }


    /** Actions */

    async goToPlanSelection() {
      await this.updatePlanButton().click();
    }

    async cancelIfChangeAlreadyPlanned() {
      const cancelChangeButton = this.cancelChangeButton();

      try {
        console.log('Waiting for cancel change button...');
        const isVisible = await cancelChangeButton.waitFor({
          state: 'visible',
          timeout: 5000
        }).then(() => true).catch(() => false);

        if (isVisible) {
          console.log('Cancel change button found. Attempting to click...');
          await cancelChangeButton.click({ timeout: 5000 });
          console.log('Successfully clicked cancel change button.');
        } else {
          console.log('No cancel change button found. Proceeding without cancellation.');
        }
      } catch (error) {
        console.error('Error while handling cancel change button:', error);
        // Optionally, you might want to rethrow the error or handle it differently
        // throw error;
      }
    }

    async selectPlan(plan: string) {

      const planCard = this.pricingTableCard(plan);
  
      await expect(planCard).toBeVisible({timeout: 5000});
  
      const selectButton = planCard.locator('text=Select');
      
      if (await selectButton.isVisible({timeout: 5000})) {
        await selectButton.click();
      }
    }
  
    // In the 2 cases bellow, it is not our responsibility if the UI element
    async selectPlanQuantityCustomerPortal(quantity: number) {
  
      const quantityInput = this.quantityInput();
  
      await expect(quantityInput).toBeVisible({timeout: 10000});
  
      await quantityInput.clear();
      await quantityInput.fill(quantity.toString());
    }
  
    async continueToPayment() {
      await this.continueButton().click();
    }
  
    async payAndSubscribe() {
      const payAndSubscribeButton = this.payAndSubscribeButton();
  
      await expect(payAndSubscribeButton).toBeVisible({timeout: 10000});
  
      await payAndSubscribeButton.click({ timeout: 5000 });
    }
  
    async returnToApp() {
      await this.returnToAppButton().click();
    }
  }
  
/**
 *  export class StripeSubscriptionUtils {
      constructor(private readonly page: Page) {}
    
      async forceRenewSubscription(subscriptionId: string) {
        forceRenewSubscription(subscriptionId);
      }
    }
 */
