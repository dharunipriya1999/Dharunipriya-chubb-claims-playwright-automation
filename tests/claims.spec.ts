import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ClaimsPage } from '../pages/ClaimsPage';

test.describe('Claims Submission Flow', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.CLAIMANT_EMAIL!, 
      process.env.CLAIMANT_PASSWORD!
    );
    await page.goto('/claims'); // Ensure we start fresh on the claims dashboard
    await expect(page).toHaveURL(/\/claims$/);
  });

  test('Validates Step 1 textbox limits and displays error messages', async ({ page }) => {
    const claimsPage = new ClaimsPage(page);
    await claimsPage.gotoNewClaim();

    await claimsPage.fillIncidentDetails('2026-10-01', 'aw', '1111111111111');
    
    await expect(page.getByText('Location must be at least 5 characters')).toBeVisible();
    await expect(page.getByText('Claim amount cannot exceed $1,000,000')).toBeVisible();
  });

  test('Completes full multi-step claim submission and submits successfully', async ({ page }) => {
    const claimsPage = new ClaimsPage(page);
    await claimsPage.gotoNewClaim();

    // Step 1: Incident Details
    await claimsPage.fillIncidentDetails('2026-10-01', '123 Main Street, Chennai', '15000');
    await claimsPage.clickNext();
    await expect(page.getByText(/Step 2: Supporting Details/i)).toBeVisible();

    // Step 2: Supporting Details
    await claimsPage.fillSupportingDetails(
      'Heavy waterlogging on Main Street caused water ingress into the vehicle engine compartment and damaged electrical components.'
    );
    await claimsPage.clickNext();

    // Step 3: Review & Submit
    await expect(page.getByText(/Step 3: Review/i)).toBeVisible();
    await claimsPage.submitFinalClaim();

    // Verify successful submission redirects back to the dashboard list (allow trailing slash or query params if any)
    await expect(page).toHaveURL(/\/claims(\/?$|\?)/);
  });
});