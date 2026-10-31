import { Page, expect } from '@playwright/test';

export class ClaimsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

 async gotoNewClaim() {
    // Ensure we are on the claims dashboard first
    await expect(this.page).toHaveURL(/\/claims/, { timeout: 10000 });

    const submitNewBtn = this.page.getByRole('button', { name: /Submit New Claim/i });
    
    // Wait for the button to be fully stable and clickable
    await expect(submitNewBtn).toBeVisible({ timeout: 10000 });
    await expect(submitNewBtn).toBeEnabled();
    await submitNewBtn.click();

    // Wait for the wizard Step 1 heading/text to appear
    await expect(this.page.getByText(/Step 1: Incident Details/i)).toBeVisible({ timeout: 10000 });
  }

  async fillIncidentDetails(date: string, location: string, amount: string) {
    await this.page.getByLabel(/When did the incident occur/i).fill(date);
    await this.page.getByLabel(/Where did the incident occur/i).fill(location);
    await this.page.getByLabel(/Claim Amount/i).fill(amount);
  }

  async fillSupportingDetails(description: string) {
    await this.page.getByLabel(/Describe what happened/i).fill(description);
  }

  async clickNext() {
    await this.page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  async clickBack() {
    await this.page.getByRole('button', { name: 'Back', exact: true }).click();
  }

  async submitFinalClaim() {
    await this.page.getByTestId('wizard-step-3').getByRole('button', { name: 'Submit Claim', exact: true }).click();
  }
}