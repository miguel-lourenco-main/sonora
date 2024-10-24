import { expect, Page, test } from '@playwright/test';
import { PolydocUserComplexFlowTestObject } from './complex-flow.to';

/*
  This test depends on the account creation working and can only be run after an accoount is created, but in this
  case we are using a test account that is already created for these tests specifically
*/

test.describe('Complex flows', () => {
  let page: Page;
  let po: PolydocUserComplexFlowTestObject;

  let testEmail: string;
  const testPassword = 'testingpassword1.A';

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    po = new PolydocUserComplexFlowTestObject(page);

    testEmail = po.auth.createRandomEmail();

    await po.account.setup('/app/billing', testEmail, testPassword);

    await po.billing.billing.refreshPage();
  });

  /**
   * delete the account after the tests are done
   * 
   * test.afterAll(async ({ page }) => {

    await page.goto('/auth/sign-in');
    
    //Wait for a specific element on the sign-in page to be visible
    await expect(page.locator('input[name="email"]')).toBeVisible();

    await po.account.signIn(testEmail, testPassword);

    await page.goto('/app/settings');  

    const request = po.account.deleteAccount();

    const response = page
      .waitForResponse((resp) => {
        return (
          resp.url().includes('app/settings') &&
          resp.request().method() === 'POST'
        );
      })
      .then((response) => {
        expect(response.status()).toBe(303);
      });

    await Promise.all([request, response]);
  });
   * /

  /**
   * Execute a flow that tests most of the polydoc billing features
   */
  test('Complex flow - 1', async () => {

    await page.waitForTimeout(2000);
    
    await po.billing.billing.refreshPage();

    await expect(po.billing.billing.getProductName()).toBeVisible({ timeout: 10000 });
    
   //Check if the user is in the free plan
    await po.billing.evaluateSubscription('Free', 5, 5)

    //If so, upgrade to 7000 pages of the pro plan
    let quantity = 7000

    await po.billing.upgradeFreeToPro(quantity)

    await page.waitForTimeout(5000);

    await po.billing.billing.refreshPage();

    await po.billing.evaluateSubscription('Pro', quantity, quantity)

    //Now, downgrade to 5000 pages of the pro plan
    quantity = 5000

    await po.billing.updatePlan(quantity, 'Pages(Pro Plan)', page)

    await page.waitForTimeout(5000);

    await po.billing.billing.refreshPage();

    await po.billing.evaluateDowngradeSubscription('Pro', quantity)

    //Upgrade again to 9000 pages of the pro plan
    quantity = 9000

    await po.billing.updatePlan(quantity, 'Pages(Pro Plan)', page)

    await page.waitForTimeout(5000);

    await po.billing.billing.refreshPage();

    await po.billing.evaluateSubscription('Pro', quantity, quantity)

    await po.billing.updatePlan(5, 'Pages(Free Plan)', page)

    await page.waitForTimeout(3000);

    await po.billing.billing.refreshPage();

    await po.billing.evaluateDowngradeSubscription('Free', 5)
  });
});
