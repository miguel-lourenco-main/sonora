import { expect, Page } from '@playwright/test';
import { CURRENT_TIMEOUTS, DOWNGRADE_DELAY } from '../../utils/timeouts';
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

    pricingTableFirstCard() {
      return this.page.locator('[data-testid="pricing-table-card"]').first();
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
      await this.page.setViewportSize({ width: 1920, height: 1600 });
    }

    async cancelIfChangeAlreadyPlanned() {
      const cancelChangeButton = this.cancelChangeButton();
      const planSelectionArea = this.pricingTableFirstCard();

      try {
        // First check if there's a plan being shown
        const isPlanVisible = await planSelectionArea.waitFor({
          state: 'visible',
          timeout: DOWNGRADE_DELAY/2
        }).then(() => true).catch(() => false);

        // If a plan is visible, there's no change to cancel
        if (isPlanVisible) {
          return;
        }

        // Otherwise, check for the cancel button
        const isCancelButtonVisible = await cancelChangeButton.waitFor({
          state: 'visible',
          timeout: CURRENT_TIMEOUTS.element
        }).then(() => true).catch(() => false);

        if (isCancelButtonVisible) {
          await cancelChangeButton.click();
        }
      } catch (error) {
        console.error('Error while handling cancel change button:', error);
        // Optionally, you might want to rethrow the error or handle it differently
        // throw error;
      }
    }

    async selectPlan(plan: string) {

      const planCard = this.pricingTableCard(plan);
  
      await expect(planCard).toBeVisible({timeout: CURRENT_TIMEOUTS.element});
  
      const selectButton = planCard.locator('text=Select');
      
      if (await selectButton.isVisible({timeout: CURRENT_TIMEOUTS.element})) {
        await selectButton.click();
      }
    }
  
    // In the 2 cases bellow, it is not our responsibility if the UI element
    async selectPlanQuantityCustomerPortal(quantity: number) {
  
      const quantityInput = this.quantityInput();
  
      await expect(quantityInput).toBeVisible({timeout: CURRENT_TIMEOUTS.element});
  
      await quantityInput.clear();
      await quantityInput.fill(quantity.toString());
    }
  
    async continueToPayment() {
      await this.continueButton().click();
    }
  
    async payAndSubscribe() {
      const payAndSubscribeButton = this.payAndSubscribeButton();
  
      await payAndSubscribeButton.waitFor({ state: 'visible' });
      await payAndSubscribeButton.scrollIntoViewIfNeeded();
  
      // Add small delay for stability
      await new Promise(resolve => setTimeout(resolve, 100));
  
      await payAndSubscribeButton.click({ timeout: CURRENT_TIMEOUTS.element });
    }
  
    async returnToApp() {
      await this.returnToAppButton().click();
      await this.page.setViewportSize({ width: 1920, height: 1080 });
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
