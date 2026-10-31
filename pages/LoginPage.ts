import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login', { waitUntil: 'networkidle' });
    // Ensure React client hydration has completed before interacting
    await expect(this.page.locator('html')).toHaveClass(/theme-default/, { timeout: 10000 });
  }

  async login(email: string, password: string, expectedUrlPattern: RegExp = /\/claims/) {
    const emailInput = this.page.getByLabel(/email/i);
    const passwordInput = this.page.getByLabel('Password', { exact: true });
    const loginBtn = this.page.getByRole('button', { name: /Log In|sign in/i });

    await expect(emailInput).toBeVisible();
    await emailInput.fill(email);
    await expect(emailInput).toHaveValue(email);

    await passwordInput.fill(password);
    await expect(passwordInput).toHaveValue(password);

    await loginBtn.click();
    await expect(this.page).toHaveURL(expectedUrlPattern, { timeout: 15000 });
  }
}