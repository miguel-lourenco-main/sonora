import { expect, Page, test } from '@playwright/test';
import { PolydocUserBillingTestObject } from './billing.to';
import { refreshPage } from '../../utils/general';
import { retryOperation } from '../../utils/utils';
import { CURRENT_TIMEOUTS } from '../../utils/timeouts';

/*
  This test depends on the account creation working and can only be run after an accoount is created, but in this
  case we are using a test account that is already created for these tests specifically
*/

const TEST_DELAY = 2000; // 2 seconds

test.describe('Polydoc User Billing Tests', () => {
  let page: Page;
  let po: PolydocUserBillingTestObject;
  let speedTest: boolean

  // Configure tests to run serially within this describe block
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    po = new PolydocUserBillingTestObject(page);

    speedTest = process.env.SPEED_TEST === 'true';

    await page.setViewportSize({ width: 1920, height: 1600 });

    await retryOperation(async () => {
      try {
        // Add additional waiting and logging for navigation
        console.log('Starting navigation...');
        
        // Set a longer navigation timeout for the initial load
        page.setDefaultNavigationTimeout(CURRENT_TIMEOUTS.navigation * 2);
        
        console.log('Navigating to /...');
        await page.goto('/', { 
          timeout: CURRENT_TIMEOUTS.navigation,
          waitUntil: 'networkidle' 
        });

        console.log('Navigation complete, waiting for sign up button...');
        await expect(po.main.signUpButton()).toBeVisible({ 
          timeout: CURRENT_TIMEOUTS.element,
          // Add retry options for better stability
        });

        console.log('Going to sign up...');
        await po.main.signUpButton().click();

        console.log('Signing up...');
        await po.auth.signUpFlow('/app/billing');

        // Verify we reached billing page
        console.log('Verifying billing page...');
        await expect(page).toHaveURL(/.*\/app\/billing/);

      } catch (error) {
        console.error('Navigation failed:', error);
        throw error;
      }
    }, page, CURRENT_TIMEOUTS.retryAttempts, CURRENT_TIMEOUTS.retry);
  });

  test.afterEach(async () => {
    // Cleanup and wait
    if (page && !page.isClosed()) {
      await page.close();
    }
    await new Promise(resolve => setTimeout(resolve, TEST_DELAY));
  });

  // Define reusable steps
  const steps = {

    updatePlan: (
      newPlan: string,
      newPagesQuantity: number,
      currentPlan: string,
      leftPages: number,
      monthlyPages: number
    ) => test.step('(from the billing page) should upgrade the plan either on the checkout session or the customer portal. Expected: the subscription card is updated with the new plan and quantity', async () => {

      // Depending on whether the plan is updated on the checkout session or the customer portal, we need to filter the plan name differently to gett the name we will see on the subscription card
      const plan = newPlan[0]?.toLowerCase() === newPlan[0]
        ? newPlan.split('-')[0]?.charAt(0).toUpperCase() + (newPlan.split('-')[0]?.slice(1) || newPlan.slice(1))
        : newPlan.match(/\((.*?)\s+Plan\)/)?.[1] || newPlan;

      const pageDiff = newPagesQuantity - monthlyPages;
      const addedPages = pageDiff < 1 ? 0 : newPagesQuantity - monthlyPages;

      // checkVAT is true because we are testing the VAT label
      await po.updatePlan(newPlan, newPagesQuantity, true);

      // This shows the new plan on the subscription card
      console.log('Refreshing page before evaluating the subscription...');
      await page.waitForLoadState('domcontentloaded');

      await retryOperation(async () => {
        try {
  
          if(pageDiff > 0) {
            await po.evaluateSubscription(plan, leftPages + addedPages, newPagesQuantity);
          }else{
            await steps.verifyDowngrade(currentPlan, leftPages, monthlyPages, plan, newPagesQuantity);
          }
        } catch (error) {
          console.error('Navigation failed:', error);
          throw error;
        }
      }, page, CURRENT_TIMEOUTS.retryAttempts, CURRENT_TIMEOUTS.retry);
    }),

    verifyDowngrade: (
      currentPlan: string, 
      currentLeftPages: number, 
      currentMonthlyPages: number, 
      nextPlan: string, 
      newQuantity: number
    ) => test.step('(from the billing page) should inspect the subscription card and downgrade warning message to verify the downgrade. Expected: the subscription card information stays the same and the downgrade warning message is visible with the information for the downgrade', async () => {
      
      await po.evaluateSubscription(currentPlan, currentLeftPages, currentMonthlyPages);
      await po.evaluateDowngradeSubscription(nextPlan, newQuantity);

      await expect(po.managePlan.customerPortalButton()).toBeVisible();
    }),

    cancelSubscriptionChange: () => test.step('(from the billing page) should cancel the downgrade of a subscription through the customer portal. Expected: the subscription card information stays the same and the downgrade warning message is no longer visible', async () => {
      
      await po.cancelSubscriptionChange();
      await po.stripeCustomerPortal.returnToAppButton().click();
      await expect(po.managePlan.planName()).toBeVisible();
      await refreshPage(page);
    }),

    setupVATTest: () => test.step('(from the billing page) should open a stripe checkout session and open the details. Expected: the checkout session is visible and so are the details', async () => {
      
      await po.managePlan.goToUpgradePlanPage();
      await po.upgradePlan.proceedToCheckout();
      await po.stripeCheckoutSession.waitForForm();
      await po.stripeCheckoutSession.viewDetail().click();
    }),

    checkVAT: (country: string, expectedLabel: string) => test.step('(from the checkout session) should check if the VAT label is correct. Expected: the VAT label is visible and has the correct value for the selected country', async () => {
      await po.stripeCheckoutSession.fillCountryInForm({ billingCountry: country });
      const vatLabel = po.stripeCheckoutSession.checkVATLabel();
      await vatLabel.waitFor({ state: 'visible' });
      await expect(vatLabel).toBeVisible();
      await expect(vatLabel).toHaveText(expectedLabel);
    }),
  };

  test('(from the billing page) should check if the user is in the free plan. Expected: there is a subscription card with name "Free" and 5 pages worth of credits', async () => {
    await retryOperation(async () => {
      try {

        await po.evaluateSubscription('Free', 5, 5);

      } catch (error) {
        console.error('Navigation failed:', error);
        throw error;
      }
    }, page, CURRENT_TIMEOUTS.retryAttempts, CURRENT_TIMEOUTS.retry);
  });

  test.describe('(from the billing page) if the user has a free plan, we can proceed with further tests', () => {
    test.beforeEach(async () => {
      await retryOperation(async () => {
        try {
  
          await po.evaluateSubscription('Free', 5, 5);

        } catch (error) {
          console.error('Navigation failed:', error);
          throw error;
        }
      }, page, CURRENT_TIMEOUTS.retryAttempts, CURRENT_TIMEOUTS.retry);
    });

    test('(from the billing page) should upgrade user plan from Free to Pro plan. Expected: the subscription card is updated with the new plan and quantity', async () => {
    
      await steps.updatePlan('pro-monthly', 3000, 'Free', 5, 5);
    });
  
    test('(from the billing page) should upgrade twice in the Pro plan to simulate an upgrade. Expected: the subscription card is updated with the new quantity', async () => {
  
      await steps.updatePlan('pro-monthly', 100, 'Free', 5, 5);
      await steps.updatePlan('Pages(Pro Plan)', 7000, 'Pro', 100, 100);
    });
  
    test('(from the billing page) should upgrade and downgrade the number of pages in the user Pro plan to simulate a downgrade. Expected: the subscription card is updated with the new quantity and the downgrade warning message is visible', async () => {
      await steps.updatePlan('pro-monthly', 1000, 'Free', 5, 5);
      await steps.updatePlan('Pages(Pro Plan)', 300, 'Pro', 1000, 1000);
    });
  
    test('(from the billing page) should upgrade and downgrade the user plan from Pro to Free to simulate a downgrade in plan and quantity. Expected: the subscription card is updated with the new plan and quantity and the downgrade warning message is visible', async () => {
      await steps.updatePlan('pro-monthly', 1000, 'Free', 5, 5);
      await steps.updatePlan('Pages(Free Plan)', 5, 'Pro', 1000, 1000);
    });
  
    test('(from the billing page) should cancel the downgrade of a subscription through the customer portal. Expected: the subscription card information stays the same and the downgrade warning message is no longer visible', async () => {
      await steps.updatePlan('pro-monthly', 1000, 'Free', 5, 5);
      await steps.updatePlan('Pages(Free Plan)', 5, 'Pro', 1000, 1000);
      
      await steps.cancelSubscriptionChange();
    });
  
    test('Complex billing flow - should handle multiple plan changes and renewals', async () => {
  
      // Upgrade to Pro plan with 7000 pages
      await steps.updatePlan('pro-monthly', 7000, 'Free', 5, 5);
  
      // Downgrade to Pro plan with 5000 pages
      await steps.updatePlan('Pages(Pro Plan)', 5000, 'Pro', 7000, 7000);
  
      // Upgrade to Pro plan with 9000 pages
      await steps.updatePlan('Pages(Pro Plan)', 9000, 'Pro', 5000, 5000);
  
      // Downgrade to Free plan
      await steps.updatePlan('Pages(Free Plan)', 5, 'Pro',  9000, 9000);
    });
  
    //TODO: introduzir teste que gasta creditos e faz upgrade para free com creditos ja gastos
  
    test.describe('(from the billing page) should check the VAT label in the checkout session for different countries', () => {
      test.beforeEach(async () => {
        await steps.setupVATTest();
      });
  
      const vatTests = [
        { country: 'PT', expectedLabel: 'VAT (23%)', description: '(from the checkout session) should check if the VAT label is correct for an EU Country. Expected: VAT should be 23%' },
        { country: 'BO', expectedLabel: 'Tax', description: '(from the checkout session) should check if the VAT label is correct for a non-EU Country. Expected: VAT should be 0%' }
      ];
  
      for (const { country, expectedLabel, description } of vatTests) {
        test(description, async () => {
          await steps.checkVAT(country, expectedLabel);
        });
      }
    });
  });
});
