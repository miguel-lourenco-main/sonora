import { Page, expect } from '@playwright/test';

import { Mailbox } from '../../utils/mailbox';

export class AuthPageObject {
  private readonly page: Page;
  private readonly mailbox: Mailbox;

  constructor(page: Page) {
    this.page = page;
    this.mailbox = new Mailbox(page);
  }

  goToSignIn() {
    return this.page.goto('/auth/sign-in');
  }

  goToSignUp() {
    return this.page.goto('/auth/sign-up');
  }

  async signOut() {
    await this.page.click('[data-test="account-dropdown-trigger"]');
    await this.page.click('[data-test="account-dropdown-sign-out"]');
  }

  async signIn(params: { email: string; password: string }) {
    await this.page.waitForTimeout(1000);

    await this.page.fill('input[name="email"]', params.email);
    await this.page.fill('input[name="password"]', params.password);
    await this.page.click('button[type="submit"]');
  }

  async signUp(params: {
    email: string;
    password: string;
    repeatPassword: string;
  }) {
    await this.page.waitForTimeout(1000);

    await this.page.fill('input[name="email"]', params.email);
    await this.page.fill('input[name="password"]', params.password);
    await this.page.fill('input[name="repeatPassword"]', params.repeatPassword);

    await this.page.click('button[type="submit"]');
  }

  async visitConfirmEmailLink(
    email: string,
    params: {
      deleteAfter: boolean;
    } = {
      deleteAfter: true,
    },
  ) {
    return expect(async () => {
      const res = await this.mailbox.visitMailbox(email, params);

      expect(res).not.toBeNull();
    }).toPass();
  }

  createRandomEmail() {
    const value = Math.random() * 10000000000;

    return `${value.toFixed(0)}@makerkit.dev`;
  }

  async signUpFlow(path?: string, email?: string, password?: string) {

    const testEmail = email ?? this.createRandomEmail();
    const testPassword = password ?? 'password1.A';
    const redirectPath = path ?? '/app';

    await this.page.goto(`/auth/sign-up?next=${redirectPath}`);

    await this.signUp({
      email: testEmail,
      password: testPassword,
      repeatPassword: testPassword,
    });

    await this.visitConfirmEmailLink(testEmail);
  }

  async signInFlow(email: string, password: string, path?: string) {

    const redirectPath = path ?? '/app';

    await this.page.goto(`/auth/sign-in?next=${redirectPath}`);

    await this.signIn({
      email,
      password,
    });
  }
}
