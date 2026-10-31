import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Authentication Flow', () => {
  test('Admin can log in successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login(
      process.env.ADMIN_EMAIL!, 
      process.env.ADMIN_PASSWORD!,
      /\/admin/ // Pass the admin expected URL pattern here
    );
    
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('Claimant can log in successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login(
      process.env.CLAIMANT_EMAIL!, 
      process.env.CLAIMANT_PASSWORD!
      // Defaults to /\/claims/, which matches claimant flow perfectly
    );
    
    await expect(page).toHaveURL(/\/claims/);
    await expect(page.getByRole('button', { name: /new claim/i })).toBeVisible();
  });
});