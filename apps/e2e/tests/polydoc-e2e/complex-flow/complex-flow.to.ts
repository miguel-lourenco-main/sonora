import { Page } from '@playwright/test';
import { PolydocUserBillingTestObject } from '../billing/billing.to';
import { AccountPageObject, AuthPageObject } from '../../web-e2e';

export class PolydocUserComplexFlowTestObject {

  billing: PolydocUserBillingTestObject;
  auth: AuthPageObject;

  constructor(page: Page) {
    this.billing = new PolydocUserBillingTestObject(page);
    this.auth = new AuthPageObject(page);
  }

  async evaluateSubscription(productName: string, leftTokens?: number, monthlyTokens?: number) {
    return this.billing.evaluateSubscription(productName, leftTokens, monthlyTokens);
  }
}
