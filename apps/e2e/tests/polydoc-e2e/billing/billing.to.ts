import { expect, Page } from '@playwright/test';
import { AuthPageObject } from '../../web-e2e/authentication/auth.po';
import { PlanPickerPageObject, PolydocBillingPagesObject } from '../../utils/polydoc/billing.po';
import { StripeCustomerPortalPageObject } from '../../utils/polydoc/stripe.po';

export class PolydocUserBillingTestObject {
  private readonly auth: AuthPageObject;
  public readonly billing: PolydocBillingPagesObject;
  public readonly planPicker: PlanPickerPageObject;
  public readonly stripeCustomerPortal: StripeCustomerPortalPageObject;

  constructor(page: Page) {
    this.auth = new AuthPageObject(page);
    this.billing = new PolydocBillingPagesObject(page);
    this.planPicker = new PlanPickerPageObject(page);
    this.stripeCustomerPortal = new StripeCustomerPortalPageObject(page);
  }

  async setup() {
    await this.auth.signUpFlow('/app/billing');
  }

  async signIn(email: string, password: string) {
    await this.auth.signInFlow('/app/billing', email, password);
  }

  /**
   * 
   * Minimum working conditionsq:
   *  - User must be on the billing page and have a Free Plan subscription/ Pro Plan trial
   */
  async updatePlan(quantity: number, plan: string, page: Page) {
    await this.billing.getBillingPortalButton().click();
    
    await this.stripeCustomerPortal.updatePlanButton().click();

    //check if there is already a changed planned

    await page.waitForTimeout(2000);
    
    const isChangeAlreadyPlanned = this.stripeCustomerPortal.cancelChangeButton();

    if (await isChangeAlreadyPlanned.isVisible()) {
      await isChangeAlreadyPlanned.click();
    }

    /**
     * Find the card for the plan inputed which has data-testid="pricing-table-card" and the plan name
     * If there is a card and it is already selected, then we don't need to do anything,
     * If there is a card and it is not selected, then we need to select it
     */
    const planCard = this.stripeCustomerPortal.pricingTableCard(plan);

    await page.waitForTimeout(2000); // Add a short wait to ensure the page is stable

    if (await planCard.isVisible()) {
      const selectButton = planCard.locator('text=Select');
      
      if (await selectButton.isVisible()) {
        await selectButton.waitFor({ state: 'visible', timeout: 10000 });
        await selectButton.click({ timeout: 5000 });
      }
      // If no Select button, we assume the plan is already selected and continue
    }

    await this.stripeCustomerPortal.quantityInput().isVisible();

    await this.stripeCustomerPortal.quantityInput().clear();
    await this.stripeCustomerPortal.quantityInput().fill(quantity.toString());

    await this.stripeCustomerPortal.continueButton().click();

    const payAndSubscribeButton = this.stripeCustomerPortal.payAndSubscribeButton();
    await payAndSubscribeButton.waitFor({ state: 'visible', timeout: 10000 });
    await payAndSubscribeButton.click({ timeout: 5000 });

    await this.stripeCustomerPortal.returnToAppButton().click();
  }

  async cancelSubscriptionChange() {

    await this.billing.getBillingPortalButton().click();
    await this.stripeCustomerPortal.updatePlanButton().click();

    await this.stripeCustomerPortal.cancelChangeButton().click();
  }

  async upgradeFreeToPro(quantity: number) {

    await this.billing.getUpgradeButton().click()
    await this.billing.subscribeToProPlanCheckout(quantity)
    await this.billing.refreshPage();
  }

  async downgradeProToFree() {
    await this.billing.getBillingPortalButton().click();
    await this.stripeCustomerPortal.updatePlanButton().click();
  }
  
  async evaluateSubscription(productName: string, leftTokens?: number, monthlyTokens?: number) {
    await expect(this.billing.getProductName()).toContainText(productName);
    
    if (leftTokens) {
      await expect(this.billing.getLeftTokens()).toContainText(`${leftTokens}`);
    }
    if (monthlyTokens) {
      await expect(this.billing.getMonthlyTokens()).toContainText(`${monthlyTokens}`);
    }
  
    if (productName === 'Pro') {
      await expect(this.billing.manageBillingButton()).toBeVisible();
    }else if (productName === 'Free') {
      await expect(this.billing.getUpgradeButton()).toBeVisible();
    }
  }
  
  async evaluateDowngradeSubscription(label: string, quantity: number) {
    
    const downgradeInfo = this.billing.getDowngradeSubscriptionInfo();
    expect(downgradeInfo).toBeDefined();
  
    await expect(downgradeInfo).toContainText(`${label} (${quantity} pages)`)
  }
}
