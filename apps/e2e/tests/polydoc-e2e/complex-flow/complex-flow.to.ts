import { Page } from '@playwright/test';
import { PolydocUserBillingTestObject } from '../billing/billing.to';
import { AuthPageObject } from '../../web-e2e';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { createAccountsApi } from '@kit/accounts/api';
import { renewCustomerSubscription } from '@kit/stripe';


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
