import { Page } from '@playwright/test';
//import { forceRenewSubscription } from '@kit/stripe';

export class StripeCustomerPortalPageObject {
    private readonly page: Page;
  
    constructor(page: Page) {
      this.page = page;
    }
  
    /**
     * ids:
        - update plan button - data-test="update-subscription"
        - quantity input - data-testid="portal-quantity-editor-increment-button"
        - continue button - data-testid="continue-button"
        - pay and subscribe button - data-testid && data-test="confirm"
     */
  
    updatePlanButton() {
      return this.page.locator('[data-test="update-subscription"]');
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
  }
  
/**
 *  export class StripeSubscriptionUtils {
      constructor(private readonly page: Page) {}
    
      async forceRenewSubscription(subscriptionId: string) {
        forceRenewSubscription(subscriptionId);
      }
    }
 */
