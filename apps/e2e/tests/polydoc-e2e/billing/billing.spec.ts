import { expect, Page, test } from '@playwright/test';
import { PolydocUserBillingTestObject } from './billing.to';
import { refreshPage, waitAndRefreshPage } from '../../utils/general';

/*
  This test depends on the account creation working and can only be run after an accoount is created, but in this
  case we are using a test account that is already created for these tests specifically
*/

test.describe('Polydoc User Billing Tests', () => {
  let page: Page;
  let po: PolydocUserBillingTestObject;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    po = new PolydocUserBillingTestObject(page);

    await po.auth.signUpFlow('/app/billing');
    await expect(po.managePlan.planName()).toBeVisible();
  });

  // Define reusable steps
  const steps = {
    verifyFreePlan: () => test.step('Verify Free Plan', async () => {
      await po.evaluateSubscription('Free', 5, 5);
    }),

    upgradePlan: (quantity: number, planType: string) => test.step('Upgrade Plan', async () => {
      await po.updatePlan(quantity, planType, true);
      await po.evaluateSubscription('Pro', quantity, quantity);
    }),

    verifyDowngrade: (previousQuantity: number, newQuantity: number) => test.step('Verify Downgrade', async () => {
      await expect(po.managePlan.planName()).toBeVisible();
      await refreshPage(page);
      await po.evaluateSubscription('Pro', previousQuantity, previousQuantity);
      await po.evaluateDowngradeSubscription('Pro', newQuantity);
      await expect(po.managePlan.customerPortalButton()).toBeVisible();
    }),

    cancelSubscriptionChange: () => test.step('Cancel Subscription Change', async () => {
      await po.cancelSubscriptionChange();
      await po.stripeCustomerPortal.returnToAppButton().click();
      await expect(po.managePlan.planName()).toBeVisible();
      await refreshPage(page);
    }),

    setupVATTest: () => test.step('Setup VAT Test', async () => {
      await po.managePlan.goToUpgradePlanPage();
      await po.upgradePlan.proceedToCheckout();
      await po.stripeCheckoutSession.waitForForm();
      await po.stripeCheckoutSession.viewDetail().click();
    }),

    checkVAT: (country: string, expectedLabel: string) => test.step('Check VAT', async () => {
      await po.stripeCheckoutSession.fillCountryInForm({ billingCountry: country });
      const vatLabel = po.stripeCheckoutSession.checkVATLabel();
      await vatLabel.waitFor({ state: 'visible' });
      await expect(vatLabel).toBeVisible();
      await expect(vatLabel).toHaveText(expectedLabel);
    }),
  };

  test('should start with free plan', async () => {
    await steps.verifyFreePlan();
  });

  test.describe('Complex test flow', () => {
    test('Upgrade from Free to Pro', async () => {
      await steps.verifyFreePlan();
      await steps.upgradePlan(3000, 'pro-monthly');
    });

    test('Upgrade Pro to Pro', async () => {
      await steps.upgradePlan(7000, 'Pages(Pro Plan)');
    });

    test('Downgrade Pro to Pro', async () => {
      await steps.upgradePlan(5000, 'Pages(Pro Plan)');
      await steps.verifyDowngrade(7000, 5000);
    });

    test('Cancel Pro Subscription Change', async () => {
      await steps.cancelSubscriptionChange();
    });
  });

  test.describe('VAT Calculation', () => {
    test.beforeAll(async () => {
      await steps.setupVATTest();
    });

    const vatTests = [
      { country: 'PT', expectedLabel: 'VAT (23%)', description: 'EU Country: VAT should be 23%' },
      { country: 'US', expectedLabel: 'Tax', description: 'Non-EU Country: VAT should be 0%' }
    ];

    for (const { country, expectedLabel, description } of vatTests) {
      test(description, async () => {
        await steps.checkVAT(country, expectedLabel);
      });
    }
  });
});
