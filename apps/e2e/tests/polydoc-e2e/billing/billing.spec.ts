import { expect, Page, test } from '@playwright/test';
import { PolydocUserBillingTestObject } from './billing.to';
import { refreshPage, waitAndRefreshPage } from '../../utils/general';

/*
  This test depends on the account creation working and can only be run after an accoount is created, but in this
  case we are using a test account that is already created for these tests specifically
*/

test.describe('Polydoc User Billing', () => {
  let page: Page;
  let po: PolydocUserBillingTestObject;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    po = new PolydocUserBillingTestObject(page);

    await po.auth.signUpFlow('/app/billing');

    await waitAndRefreshPage(page, 2000);
  });

  test('Check if the user is in the free plan', async () => {
    await po.evaluateSubscription('Free', 5, 5)
  });

  test('Upgrade from Free to Pro', async () => {

    const quantity = 3000

    await po.updatePlan(quantity, 'pro-monthly', true)

    await po.evaluateSubscription('Pro', quantity, quantity)
  });

  /**
    test('Upgrade Pro to Pro', async () => {

      const quantity = 7000

      await po.updatePlan(quantity, 'Pages(Pro Plan)', true)

      await po.evaluateSubscription('Pro', quantity, quantity)
    })

    test('Downgrade Pro to Pro', async () => {
      const quantity = 5000;

      await po.updatePlan(quantity, 'Pages(Pro Plan)', true);

      // Add a check to ensure the page has reloaded
      await expect(po.managePlan.planName()).toBeVisible();

      // Refresh the page and wait for it to load
      await refreshPage(page);

      //Previous quantity, either set it to a value you know  should be correct or hide the eval function
      await po.evaluateSubscription('Pro', 7000, 7000)

      await po.evaluateDowngradeSubscription('Pro', 5000)

      await expect(po.managePlan.customerPortalButton()).toBeVisible();
    })

    test('Cancel Pro Subscription Change', async () => {
      await po.cancelSubscriptionChange()
      await po.stripeCustomerPortal.returnToAppButton().click()
        await expect(po.managePlan.planName()).toBeVisible();

      await refreshPage(page);
    })
   */

  test('All the tests together', async () => {

    //Check if the user is in the free plan
    await po.evaluateSubscription('Free', 5, 5)

    //If so, upgrade to 7000 pages of the pro plan
    let quantity = 7000

    await po.updatePlan(quantity, 'pro-monthly', true)

    await waitAndRefreshPage(page, 4000);

    await po.evaluateSubscription('Pro', quantity, quantity)

    //Now, downgrade to 5000 pages of the pro plan
    quantity = 5000

    await po.updatePlan(quantity, 'Pages(Pro Plan)', true)

    await waitAndRefreshPage(page, 4000);

    await po.evaluateDowngradeSubscription('Pro', quantity)

    //Upgrade again to 9000 pages of the pro plan
    quantity = 9000

    await po.updatePlan(quantity, 'Pages(Pro Plan)', true)

    await waitAndRefreshPage(page, 4000);

    await po.evaluateSubscription('Pro', quantity, quantity)
  })

  test.describe('VAT Calculation', () => {

    test.beforeAll('', async () => {
      await po.managePlan.goToUpgradePlanPage()

      await po.upgradePlan.proceedToCheckout()
  
      await po.stripeCheckoutSession.waitForForm()
      await po.stripeCheckoutSession.viewDetail().click()
    })

    test('EU Country: VAT should be 23%', async () => {

      await po.stripeCheckoutSession.fillCountryInForm({billingCountry: "PT"})

      const vatLabel = po.stripeCheckoutSession.checkVATLabel();
      await vatLabel.waitFor({ state: 'visible' });
      
      await expect(vatLabel).toBeVisible();
      await expect(vatLabel).toHaveText('VAT (23%)');    
    });
  
    test('Non-EU Country: VAT should be 0%', async () => {

      await po.stripeCheckoutSession.fillCountryInForm({billingCountry: "US"})

      const vatLabel = po.stripeCheckoutSession.checkVATLabel();
      await vatLabel.waitFor({ state: 'visible' });

      await expect(vatLabel).toBeVisible();
      await expect(vatLabel).toHaveText('Tax');    
    });
  });
})