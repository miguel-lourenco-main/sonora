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
  async updatePlan(quantity: number) {
    await this.billing.getBillingPortalButton().click();
    
    await this.stripeCustomerPortal.updatePlanButton().click();

    //check if there is already a changed planned
    const isChangeAlreadyPlanned = await this.stripeCustomerPortal.cancelChangeButton().isVisible();

    if (isChangeAlreadyPlanned) {
      await this.stripeCustomerPortal.cancelChangeButton().click();
    }

    await this.stripeCustomerPortal.quantityInput().isVisible();

    await this.stripeCustomerPortal.quantityInput().clear();
    await this.stripeCustomerPortal.quantityInput().fill(quantity.toString());

    await this.stripeCustomerPortal.continueButton().click();
    await this.stripeCustomerPortal.payAndSubscribeButton().click();

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
  
  async evaluateSubscription(productName: string, leftTokens?: number, monthlyTokens?: number) {
    await expect(this.billing.getProductName()).toContainText(productName);
    
    if (leftTokens) {
      await expect(this.billing.getLeftTokens()).toContainText(`${leftTokens}`);
    }
    if (monthlyTokens) {
      await expect(this.billing.getMonthlyTokens()).toContainText(`${monthlyTokens}`);
    }
  
    await expect(this.billing.manageBillingButton()).toBeVisible();
  }
  
  async evaluateDowngradeSubscription(label: string, quantity: number) {
    
    const downgradeInfo = this.billing.getDowngradeSubscriptionInfo();
    expect(downgradeInfo).toBeDefined();
  
    await expect(downgradeInfo).toContainText(`${label} (${quantity} pages)`)
  }
}
