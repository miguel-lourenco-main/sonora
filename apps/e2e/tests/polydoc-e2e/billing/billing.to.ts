import { expect, Page } from '@playwright/test';
import { AuthPageObject } from '../../web-e2e/authentication/auth.po';
import { PolydocUpgradePlanPageObject } from '../../utils/polydoc/upgrade-plan.po';
import { StripeCustomerPortalPageObject } from '../../utils/polydoc/stripe.po';
import { PolydocManagePlanPageObject } from '../../utils/polydoc/manage-plan.po';
import { StripeCheckoutSessionPageObject } from '../../utils/stripe.po';
import { MainPageObject } from '../../utils/main.po';
import { CURRENT_TIMEOUTS } from '../../utils/timeouts';

export class PolydocUserBillingTestObject {

  auth: AuthPageObject;
  upgradePlan: PolydocUpgradePlanPageObject;
  managePlan: PolydocManagePlanPageObject;
  stripeCustomerPortal: StripeCustomerPortalPageObject;
  stripeCheckoutSession: StripeCheckoutSessionPageObject;
  main: MainPageObject;

  constructor(page: Page) {
    this.auth = new AuthPageObject(page);
    this.upgradePlan = new PolydocUpgradePlanPageObject(page);
    this.managePlan = new PolydocManagePlanPageObject(page);
    this.stripeCustomerPortal = new StripeCustomerPortalPageObject(page);
    this.stripeCheckoutSession = new StripeCheckoutSessionPageObject(page);
    this.main = new MainPageObject(page);
  }


  async checkVATRate(country: string, isTaxed: boolean) {

    await this.stripeCheckoutSession.fillCountryInForm({ billingCountry: country });

    const vatLabel = this.stripeCheckoutSession.checkVATLabel();
    
    await expect(vatLabel).toBeVisible();
    
    if(isTaxed) {
      await expect(vatLabel).toHaveText('VAT (23%)'); 
    }else {
      await expect(vatLabel).toHaveText('Tax'); 
    }
  }

  async updatePlan(plan: string, quantity: number, checkVAT?: boolean) {

    if ( await this.managePlan.customerPortalButton().isVisible() ) {

      await this.updatePlan_CustomerPortal(quantity, plan); 

    }else if (await this.managePlan.upgradePlanButton().isVisible()) {

      await this.updatePlan_CheckoutSession(quantity, plan, checkVAT);

    }else {
      throw new Error('No way to update plan');
    }
  }

  async updatePlan_CustomerPortal(quantity: number, plan: string) {

    await this.managePlan.goToCustomerPortal();

    await this.stripeCustomerPortal.goToPlanSelection();

    // Check if there is already a change planned, and if so, cancel it, since we can only have one change planned at a time and are now creating a new one
    await this.stripeCustomerPortal.cancelIfChangeAlreadyPlanned();

    await this.stripeCustomerPortal.selectPlan(plan);
    await this.stripeCustomerPortal.selectPlanQuantityCustomerPortal(quantity);

    await this.stripeCustomerPortal.continueToPayment();
    await this.stripeCustomerPortal.payAndSubscribe();

    // Wait for the change to take effect
    await new Promise(resolve => setTimeout(resolve, CURRENT_TIMEOUTS.processAction));

    await this.stripeCustomerPortal.returnToApp();
  }

  async updatePlan_CheckoutSession(quantity: number, plan: string, checkVAT?: boolean) {
    
    await this.managePlan.goToUpgradePlanPage()

    await this.upgradePlan.selectPagesQuantity(quantity)

    await this.upgradePlan.selectPlan(plan);

    await this.upgradePlan.proceedToCheckout();
  
    await this.stripeCheckoutSession.waitForForm();
    await this.stripeCheckoutSession.fillForm();

    await this.stripeCheckoutSession.viewDetail().click()
    
    if(checkVAT) {
      await this.checkVATRate('PT', true);
      await this.checkVATRate('BO', false);
    }

    await this.stripeCheckoutSession.submitForm();
    
    await expect(this.upgradePlan.successStatus()).toBeVisible({ timeout: CURRENT_TIMEOUTS.element });

    console.log('Clicked button to return to the billing page...');

    // Wait for the email to be delivered
    await new Promise(resolve => setTimeout(resolve, CURRENT_TIMEOUTS.processAction));

    console.log('clicking return to manage billing...');

    await this.upgradePlan.returnToManageBilling();
  }

  /**
   * Requirements:
   * - The user must be in the billing page
   * - The page must have a button to go to the customer portal
   * - The user must have a change already planned
   */
  async cancelSubscriptionChange() {

    await this.managePlan.goToCustomerPortal()
    await this.stripeCustomerPortal.goToPlanSelection()

    await this.stripeCustomerPortal.cancelIfChangeAlreadyPlanned()
  }

  async evaluateSubscription(productName: string, leftTokens?: number, monthlyTokens?: number) {
    await expect(this.managePlan.planName()).toContainText(productName);
    
    if (leftTokens) {
      const tokenElements = await this.managePlan.planLeftTokens();
      // Test both elements
      for (const element of tokenElements) {
        await expect(element).toContainText(`${leftTokens}`);
      }
    }
    if (monthlyTokens) {
      const tokenElements = await this.managePlan.planMonthlyTokens();
      // Test both elements
      for (const element of tokenElements) {
        await expect(element).toContainText(`${monthlyTokens}`);
      }
    }
  
    if (productName === 'Pro') {
      await expect(this.managePlan.customerPortalButton()).toBeVisible();
    }
  }
  
  async evaluateDowngradeSubscription(label: string, quantity: number) {
    
    const downgradeInfo = this.managePlan.downgradeSubscriptionInfo();
    expect(downgradeInfo).toBeDefined();
  
    await expect(downgradeInfo).toContainText(`${label} (${quantity} pages)`)
  }
}
