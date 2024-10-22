import { Page } from '@playwright/test';
import { PolydocUserBillingTestObject } from '../billing/billing.to';
import { AccountPageObject, AuthPageObject } from '../../web-e2e';

export class PolydocUserComplexFlowTestObject {
  billing: PolydocUserBillingTestObject;
  account: AccountPageObject;
  auth: AuthPageObject;


  constructor(page: Page) {
    this.billing = new PolydocUserBillingTestObject(page);
    this.account = new AccountPageObject(page);
    this.auth = new AuthPageObject(page);
  }

  async signIn(email: string, password: string) {
    await this.auth.signInFlow('/app/billing', email, password);
  }
}
