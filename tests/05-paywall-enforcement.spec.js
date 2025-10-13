const { test, expect } = require('@playwright/test');

test.describe('Paywall Enforcement Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('Should allow first 3 tests without paywall', async ({ page }) => {
    // First test
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await expect(page.locator('text=Begin Test')).toBeVisible();

    // Go back home
    await page.goto('/');

    // Second test
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await expect(page.locator('text=Begin Test')).toBeVisible();

    // Go back home
    await page.goto('/');

    // Third test
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await expect(page.locator('text=Begin Test')).toBeVisible();
  });

  test('Should show paywall after 3 completed tests', async ({ page }) => {
    // Simulate 3 completed tests
    const testResults = [
      { score: 8, total: 10, percentage: 80, passed: true, date: new Date().toISOString() },
      { score: 9, total: 10, percentage: 90, passed: true, date: new Date().toISOString() },
      { score: 7, total: 10, percentage: 70, passed: true, date: new Date().toISOString() },
    ];

    await page.evaluate((results) => {
      localStorage.setItem('testResults', JSON.stringify(results));
    }, testResults);

    // Reload page
    await page.goto('/');

    // Try to start 4th test
    await page.click('text=Start Practice Test');

    // Paywall should appear
    await expect(page.locator('text=Unlock Unlimited Tests')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=$14.99')).toBeVisible();
  });

  test('Should not show paywall if less than 3 tests completed', async ({ page }) => {
    // Simulate 2 completed tests
    const testResults = [
      { score: 8, total: 10, percentage: 80, passed: true, date: new Date().toISOString() },
      { score: 9, total: 10, percentage: 90, passed: true, date: new Date().toISOString() },
    ];

    await page.evaluate((results) => {
      localStorage.setItem('testResults', JSON.stringify(results));
    }, testResults);

    // Reload page
    await page.goto('/');

    // Start test
    await page.click('text=Start Practice Test');

    // Should NOT see paywall, should see version select
    await expect(page.locator('text=2025 Test')).toBeVisible();
  });

  test('Paywall should reload test count on each test start', async ({ page }) => {
    // Start with 2 completed tests
    const testResults = [
      { score: 8, total: 10, percentage: 80, passed: true, date: new Date().toISOString() },
      { score: 9, total: 10, percentage: 90, passed: true, date: new Date().toISOString() },
    ];

    await page.evaluate((results) => {
      localStorage.setItem('testResults', JSON.stringify(results));
    }, testResults);

    // Start test
    await page.goto('/');
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');

    // In another browser context, add a 3rd test result
    const updatedResults = [
      ...testResults,
      { score: 7, total: 10, percentage: 70, passed: true, date: new Date().toISOString() },
    ];

    await page.evaluate((results) => {
      localStorage.setItem('testResults', JSON.stringify(results));
    }, updatedResults);

    // Go back to home
    await page.goto('/');

    // Try to start another test - should check localStorage again
    await page.click('text=Start Practice Test');

    // Paywall should appear now
    await expect(page.locator('text=Unlock Unlimited Tests')).toBeVisible({ timeout: 5000 });
  });

  test('Cannot bypass paywall by direct navigation', async ({ page }) => {
    // Set up 3 completed tests
    const testResults = [
      { score: 8, total: 10, percentage: 80, passed: true, date: new Date().toISOString() },
      { score: 9, total: 10, percentage: 90, passed: true, date: new Date().toISOString() },
      { score: 7, total: 10, percentage: 70, passed: true, date: new Date().toISOString() },
    ];

    await page.evaluate((results) => {
      localStorage.setItem('testResults', JSON.stringify(results));
    }, testResults);

    // Reload page
    await page.goto('/');

    // Try to start test
    await page.click('text=Start Practice Test');

    // Paywall should block access
    await expect(page.locator('text=Unlock Unlimited Tests')).toBeVisible();

    // Should not be able to proceed to test without paying
    await expect(page.locator('text=Begin Test')).toBeHidden();
  });

  test('Paywall modal should have all expected elements', async ({ page }) => {
    // Trigger paywall
    const testResults = [
      { score: 8, total: 10, percentage: 80, passed: true, date: new Date().toISOString() },
      { score: 9, total: 10, percentage: 90, passed: true, date: new Date().toISOString() },
      { score: 7, total: 10, percentage: 70, passed: true, date: new Date().toISOString() },
    ];

    await page.evaluate((results) => {
      localStorage.setItem('testResults', JSON.stringify(results));
    }, testResults);

    await page.goto('/');
    await page.click('text=Start Practice Test');

    // Check all elements exist
    await expect(page.locator('text=Unlock Unlimited Tests')).toBeVisible();
    await expect(page.locator('text=$14.99')).toBeVisible();
    await expect(page.locator('text=One-time payment')).toBeVisible();
    await expect(page.locator('text=Unlimited practice tests')).toBeVisible();
    await expect(page.locator('text=Maybe Later')).toBeVisible();
    await expect(page.locator('text=Unlock Premium')).toBeVisible();
  });

  test('Study mode should not trigger paywall', async ({ page }) => {
    // Set up 3 completed tests
    const testResults = [
      { score: 8, total: 10, percentage: 80, passed: true, date: new Date().toISOString() },
      { score: 9, total: 10, percentage: 90, passed: true, date: new Date().toISOString() },
      { score: 7, total: 10, percentage: 70, passed: true, date: new Date().toISOString() },
    ];

    await page.evaluate((results) => {
      localStorage.setItem('testResults', JSON.stringify(results));
    }, testResults);

    // Navigate to study mode
    await page.goto('/study');

    // Should be able to access study mode
    await expect(page.locator('text=Study Mode')).toBeVisible();
    await expect(page.locator('text=Unlock Unlimited Tests')).toBeHidden();
  });
});
