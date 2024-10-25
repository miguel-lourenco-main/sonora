import { expect, Page, test } from '@playwright/test';
import { PolydocUserComplexFlowTestObject } from './complex-flow.to';
import { waitAndRefreshPage } from '../../utils/general';

/*
  This test depends on the account creation working and can only be run after an accoount is created, but in this
  case we are using a test account that is already created for these tests specifically
*/

test.describe('Complex flows', () => {
  let page: Page;
  let po: PolydocUserComplexFlowTestObject;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    po = new PolydocUserComplexFlowTestObject(page);

    await po.auth.signUpFlow('/app/billing');

    await waitAndRefreshPage(page, 4000);
  });

  /**
   * Execute a flow that tests most of the polydoc billing features
   */
  test('Complex flow - 1', async () => {
    
   // Check if the user is in the free plan
    await po.evaluateSubscription('Free', 5, 5)

    // If so, upgrade to 7000 pages of the pro plan
    let quantity = 7000

    // first time is through the plan picker
    await po.billing.updatePlan(quantity, 'pro-monthly', true)

    await waitAndRefreshPage(page, 4000);

    await po.billing.evaluateSubscription('Pro', quantity, quantity)

    //Now, downgrade to 5000 pages of the pro plan
    quantity = 5000

    await po.billing.updatePlan(quantity, 'Pages(Pro Plan)', true)

    await waitAndRefreshPage(page, 4000);

    await po.billing.evaluateDowngradeSubscription('Pro', quantity)

    //Upgrade again to 9000 pages of the pro plan
    quantity = 9000

    await po.billing.updatePlan(quantity, 'Pages(Pro Plan)', true)
    await waitAndRefreshPage(page, 4000);

    await po.billing.evaluateSubscription('Pro', quantity, quantity)

    await po.billing.updatePlan(5, 'Pages(Free Plan)', true)
    await waitAndRefreshPage(page, 4000);

    await po.billing.evaluateDowngradeSubscription('Free', 5)
  });
});