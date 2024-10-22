import { expect, Page, test } from '@playwright/test';
import { PolydocUserBillingTestObject } from './billing.to';


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

    await po.signIn('test@edgen.co', 'testingpassword');
  });

  test.afterAll(async () => {
    // reset the user to the free plan if he is in the pro plan
  });

  test('Check if the user is in the free plan', async () => {
    await expect(po.billing.getProductName()).toContainText('Free');
    await expect(po.billing.getMonthlyTokens()).toContainText(`5`);
    await expect(po.billing.getUpgradeButton()).toBeVisible();
  });

  test('Upgrade from Free to Pro', async () => {

    const quantity = 3000

    await upgradeFreeToPro(quantity, po)

    await expect(po.billing.getProductName()).toContainText('Pro');
    await expect(po.billing.getMonthlyTokens()).toContainText(`${quantity}`);
    await expect(po.billing.manageBillingButton()).toBeVisible();
  });

  test('Upgrade Pro to Pro', async () => {

    const quantity = 7000

    await upgradeProToPro(quantity, po)

    await expect(po.billing.getProductName()).toContainText('Pro');
    await expect(po.billing.getMonthlyTokens()).toContainText(`${quantity}`);
    await expect(po.billing.manageBillingButton()).toBeVisible();
  })

  test('Downgrade Pro to Pro', async () => {

    const quantity = 5000

    await downgradeProToPro(quantity, po)

    await expect(po.billing.getProductName()).toContainText('Pro');
    await expect(po.billing.getMonthlyTokens()).toContainText(`${quantity}`);
    await expect(po.billing.manageBillingButton()).toBeVisible();
  })

  test('All the tests together', async () => {

    //Check if the user is in the free plan
    await expect(po.billing.getProductName()).toContainText('Free');
    await expect(po.billing.getMonthlyTokens()).toContainText(`5`);
    await expect(po.billing.getUpgradeButton()).toBeVisible();

    //If so, upgrade to 7000 pages of the pro plan
    let quantity = 7000

    await upgradeFreeToPro(quantity, po)

    await expect(po.billing.getProductName()).toContainText('Pro');
    await expect(po.billing.getLeftTokens()).toContainText(`${quantity}`);
    await expect(po.billing.getMonthlyTokens()).toContainText(`${quantity}`);
    await expect(po.billing.manageBillingButton()).toBeVisible();

    //Now, downgrade to 5000 pages of the pro plan
    quantity = 5000

    await upgradeProToPro(quantity, po)

    await expect(po.billing.getProductName()).toContainText('Pro');
    await expect(po.billing.getLeftTokens()).toContainText(`7000`);
    await expect(po.billing.getMonthlyTokens()).toContainText(`${quantity}`);
    await expect(po.billing.manageBillingButton()).toBeVisible();

    //Upgrade again to 9000 pages of the pro plan
    quantity = 9000

    await upgradeProToPro(quantity, po)

    await expect(po.billing.getProductName()).toContainText('Pro');
    await expect(po.billing.getLeftTokens()).toContainText(`${quantity}`);
    await expect(po.billing.getMonthlyTokens()).toContainText(`${quantity}`);
    await expect(po.billing.manageBillingButton()).toBeVisible();
  })

  test.describe('VAT Calculation', () => {

    test.beforeAll('', async () => {
      await po.billing.getUpgradeButton().click()

      await po.billing.proceedToCheckout()
  
      await po.billing.stripe.waitForForm()
      await po.billing.stripe.viewDetail().click()
    })

    test('EU Country: VAT should be 23%', async () => {

      await po.billing.stripe.fillCountryInForm({billingCountry: "PT"})

      const vatLabel = po.billing.stripe.checkVATLabel();
      await vatLabel.waitFor({ state: 'visible' });
      
      await expect(vatLabel).toBeVisible();
      await expect(vatLabel).toHaveText('VAT (23%)');    
    });
  
    test('Non-EU Country: VAT should be 0%', async () => {

      await po.billing.stripe.fillCountryInForm({billingCountry: "US"})

      const vatLabel = po.billing.stripe.checkVATLabel();
      await vatLabel.waitFor({ state: 'visible' });

      await expect(vatLabel).toBeVisible();
      await expect(vatLabel).toHaveText('Tax');    
    });
  });
})

export async function upgradeFreeToPro(quantity: number, po: PolydocUserBillingTestObject) {

  await po.billing.getUpgradeButton().click()

  await po.billing.subscribeToProPlanCheckout(quantity)
}

export async function upgradeProToPro(quantity: number, po: PolydocUserBillingTestObject) {
  await po.updatePlan(quantity)

  await po.billing.refreshPage();
}

export async function downgradeProToPro(quantity: number, po: PolydocUserBillingTestObject) {
  await po.updatePlan(quantity)

  await po.billing.refreshPage();

  await po.billing.isSubscriptionPro(quantity)
  await po.billing.getBillingPortalButton().click();

  await po.updatePlan(quantity)

  await po.billing.refreshPage();
}