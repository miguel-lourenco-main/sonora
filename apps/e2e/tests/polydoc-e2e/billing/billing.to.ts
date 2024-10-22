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

    if (await this.stripeCustomerPortal.quantityInput().isVisible()) {
      await this.stripeCustomerPortal.quantityInput().clear();
      await this.stripeCustomerPortal.quantityInput().fill(quantity.toString());
    }

    await this.stripeCustomerPortal.continueButton().click();
    await this.stripeCustomerPortal.payAndSubscribeButton().click();

    await this.stripeCustomerPortal.returnToAppButton().click();
  }
}
