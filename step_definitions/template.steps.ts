import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Get Backstage URL from environment variables
const BACKSTAGE_BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEMPLATE_PATH = '/create/templates/default/group-prefix-exclude-sample';

// Authentication credentials (from environment variables, defaults for development)
const BACKSTAGE_USERNAME = process.env.BACKSTAGE_USERNAME || 'user';
const BACKSTAGE_PASSWORD = process.env.BACKSTAGE_PASSWORD || 'password';

/**
 * Precondition: Logged in to Backstage
 */
Given('I am logged in to Backstage', async function (this: CustomWorld) {
  // Navigate directly to the template page
  const templateUrl = `${BACKSTAGE_BASE_URL}${TEMPLATE_PATH}`;
  await this.page.goto(templateUrl);
  await this.page.waitForLoadState('networkidle');

  // Check if sign-in method selection page is displayed
  const oidcSignInButton = this.page.getByRole('button', { name: 'Sign In' });
  const isSignInMethodPage = await oidcSignInButton.isVisible({ timeout: 5000 }).catch(() => false);

  if (isSignInMethodPage) {
    // Click OIDC sign-in (opens popup)
    const [popup] = await Promise.all([
      this.context.waitForEvent('page'),
      oidcSignInButton.click(),
    ]);

    // Login in popup
    await popup.waitForLoadState('networkidle');
    
    // Enter username
    const usernameField = popup.getByRole('textbox', { name: 'Username or email' });
    await usernameField.fill(BACKSTAGE_USERNAME);
    
    // Enter password
    const passwordField = popup.getByRole('textbox', { name: 'Password' });
    await passwordField.fill(BACKSTAGE_PASSWORD);
    
    // Click sign-in button
    const signInButton = popup.getByRole('button', { name: 'Sign In' });
    await signInButton.click();

    // Wait for popup to close
    await popup.waitForEvent('close', { timeout: 30000 }).catch(() => {});
    
    // Wait for main page to reload
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
  }
});

/**
 * Precondition: On the template parameter input page
 */
Given('I am on the template parameter input page', async function (this: CustomWorld) {
  // Verify current URL is the template page
  const currentUrl = this.page.url();
  
  if (!currentUrl.includes(TEMPLATE_PATH)) {
    // Navigate to template page
    await this.page.goto(`${BACKSTAGE_BASE_URL}${TEMPLATE_PATH}`);
    await this.page.waitForLoadState('networkidle');
  }
  
  // Verify page loaded correctly
  await expect(this.page).toHaveURL(new RegExp(TEMPLATE_PATH.replace(/\//g, '\\/')));
});

/**
 * Action: Enter value in Owner field
 */
When('I enter {string} in the Owner field', async function (this: CustomWorld, ownerValue: string) {
  // Click Owner field to open dropdown
  const ownerField = this.page.getByRole('textbox', { name: 'Owner' });
  await ownerField.click();
  await this.page.waitForTimeout(500);

  // Extract group name from ownerValue (e.g., "group:default/admins" -> "admins")
  let groupName = ownerValue;
  if (ownerValue.includes('/')) {
    groupName = ownerValue.split('/').pop() || ownerValue;
  }

  // Select from dropdown
  const option = this.page.getByRole('option', { name: groupName });
  const isOptionVisible = await option.isVisible({ timeout: 3000 }).catch(() => false);

  if (isOptionVisible) {
    await option.click();
  } else {
    // If option not found, enter directly
    await ownerField.fill(ownerValue);
    await this.page.waitForTimeout(500);
    
    // Retry dropdown selection
    const retryOption = this.page.getByRole('option', { name: groupName });
    const isRetryVisible = await retryOption.isVisible({ timeout: 1000 }).catch(() => false);
    if (isRetryVisible) {
      await retryOption.click();
    }
  }
  
  await this.page.waitForTimeout(500);
});

/**
 * Action: Execute the template
 */
When('I execute the template', async function (this: CustomWorld) {
  // Click Review button
  const reviewButton = this.page.getByRole('button', { name: 'Review' });
  await reviewButton.click();
  await this.page.waitForLoadState('networkidle');
  await this.page.waitForTimeout(1000);

  // Click Create button
  const createButton = this.page.getByRole('button', { name: 'Create' });
  await createButton.click();
  
  // Wait for template execution to complete (URL changes to tasks page)
  await this.page.waitForURL('**/create/tasks/**', { timeout: 30000 });
  await this.page.waitForLoadState('networkidle');
  await this.page.waitForTimeout(2000);
});

/**
 * Verification: Log contains specific message
 */
Then('the log should contain {string}', async function (this: CustomWorld, expectedMessage: string) {
  // Wait for task to complete
  await this.page.waitForTimeout(3000);
  
  // Get page content
  const pageContent = await this.page.textContent('body') || '';
  
  // Verify expected message is present
  expect(pageContent).toContain(expectedMessage);
});
