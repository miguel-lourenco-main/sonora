import { Page, expect } from '@playwright/test';

export class StripePageObject {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getStripeCheckoutIframe() {
    return this.page.frameLocator('[name="embedded-checkout"]');
  }

  async waitForForm() {
    return expect(async () => {
      await expect(this.billingCountry()).toBeVisible();
    }).toPass();
  }

  async fillForm(params: {
    billingName?: string;
    cardNumber?: string;
    expiry?: string;
    cvc?: string;
    billingCountry?: string;
    quantity?: number;
  } = {}) {
    const billingName = this.billingName();
    const cardNumber = this.cardNumber();
    const expiry = this.expiry();
    const cvc = this.cvc();
    const billingCountry = this.billingCountry();

    await billingName.fill(params.billingName ?? 'Mr Makerkit');
    await cardNumber.fill(params.cardNumber ?? '4242424242424242');
    await expiry.fill(params.expiry ?? '1228');
    await cvc.fill(params.cvc ?? '123');
    await billingCountry.selectOption(params.billingCountry ?? 'IT');
  }

  async fillCountryInForm(params:{
    billingCountry: string
  }) {

    const billingCountry = this.billingCountry();

    await billingCountry.selectOption(params.billingCountry ?? 'IT');
  }

  async submitForm() {
    const submitButton = this.getStripeCheckoutIframe().locator('text=Pay and subscribe');
    await submitButton.waitFor({ state: 'attached' });
    return submitButton.click();
  }

  checkVAT() {
    return this.getStripeCheckoutIframe().locator('[data-testid="vat-rate"]');
  }

  checkVATLabel() {
    return this.getStripeCheckoutIframe().locator('span.OrderDetails-subtotalItemLabel-Text');
  }

  viewDetail(){
    return this.getStripeCheckoutIframe().locator('[data-testid="product-summary-view-details"]')
  }

  cardNumber() {
    return this.getStripeCheckoutIframe().locator('#cardNumber');
  }

  cvc() {
    return this.getStripeCheckoutIframe().locator('#cardCvc');
  }

  expiry() {
    return this.getStripeCheckoutIframe().locator('#cardExpiry');
  }

  billingName() {
    return this.getStripeCheckoutIframe().locator('#billingName');
  }

  billingCountry() {
    return this.getStripeCheckoutIframe().locator('#billingCountry');
  }
}