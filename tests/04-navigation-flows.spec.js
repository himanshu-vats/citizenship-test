const { test, expect } = require('@playwright/test');

test.describe('Navigation Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('Maybe Later button on paywall should redirect to home', async ({ page }) => {
    // Simulate taking 3 tests to trigger paywall
    const testResults = [
      { score: 8, total: 10, percentage: 80, passed: true, date: new Date().toISOString() },
      { score: 9, total: 10, percentage: 90, passed: true, date: new Date().toISOString() },
      { score: 7, total: 10, percentage: 70, passed: true, date: new Date().toISOString() },
    ];

    await page.evaluate((results) => {
      localStorage.setItem('testResults', JSON.stringify(results));
    }, testResults);

    // Try to start 4th test
    await page.goto('/');
    await page.click('text=Start Practice Test');

    // Paywall should appear
    await expect(page.locator('text=Unlock Unlimited Tests')).toBeVisible({ timeout: 5000 });

    // Click "Maybe Later"
    await page.click('text=Maybe Later');

    // Should redirect to home
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=U.S. Citizenship Test')).toBeVisible();
  });

  test('Test history items should be clickable to show details', async ({ page }) => {
    // Add a test result
    const testResult = {
      score: 8,
      total: 10,
      percentage: 80,
      passed: true,
      date: new Date().toISOString(),
      testVersion: '2025',
      answers: [
        { question: 'Test question 1?', userAnswer: 'Answer 1', correct: true, correctAnswer: 'Answer 1' },
        { question: 'Test question 2?', userAnswer: 'Answer 2', correct: false, correctAnswer: 'Correct Answer 2' },
      ]
    };

    await page.evaluate((result) => {
      localStorage.setItem('testResults', JSON.stringify([result]));
    }, testResult);

    // Navigate to stats page
    await page.goto('/stats');

    // Find and click the test result
    await page.click('text=80%');

    // Should show ResultsScreen with details
    await expect(page.locator('text=Your Score')).toBeVisible();
    await expect(page.locator('text=8/10')).toBeVisible();
  });

  test('Settings page should have Back to Home link', async ({ page }) => {
    await page.goto('/settings');

    // Check for back to home link
    await expect(page.locator('text=Back to Home')).toBeVisible();

    // Click it
    await page.click('text=Back to Home');

    // Should be on home page
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=U.S. Citizenship Test')).toBeVisible();
  });

  test('Begin Test button should appear when category has sufficient questions', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');

    // Select a category
    await page.selectOption('select[name="category"]', 'American Government');

    // Begin Test button should be visible
    await expect(page.locator('text=Begin Test')).toBeVisible();
    await expect(page.locator('text=Begin Test')).toBeEnabled();
  });

  test('Bottom navigation should be visible on all main pages', async ({ page }) => {
    // Home page
    await expect(page.locator('nav a[href="/"]')).toBeVisible();
    await expect(page.locator('nav a[href="/study"]')).toBeVisible();
    await expect(page.locator('nav a[href="/stats"]')).toBeVisible();
    await expect(page.locator('nav a[href="/settings"]')).toBeVisible();

    // Study page
    await page.goto('/study');
    await expect(page.locator('nav a[href="/study"]')).toBeVisible();

    // Stats page
    await page.goto('/stats');
    await expect(page.locator('nav a[href="/stats"]')).toBeVisible();

    // Settings page
    await page.goto('/settings');
    await expect(page.locator('nav a[href="/settings"]')).toBeVisible();
  });

  test('Bottom navigation should be hidden during active test', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await page.click('text=Begin Test');

    // Bottom nav should be hidden
    const bottomNav = page.locator('nav').last();
    await expect(bottomNav).toBeHidden();
  });

  test('Back button during test should work correctly', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await page.click('text=Begin Test');

    // Answer first question
    const options = await page.locator('[class*="cursor-pointer"][class*="p-4"]').all();
    if (options.length > 0) {
      await options[0].click();
    }
    await page.click('text=Next Question');

    // Should be on question 2
    await expect(page.locator('text=Question 2')).toBeVisible();

    // Click back
    await page.click('text=← Back');

    // Should be back on question 1
    await expect(page.locator('text=Question 1')).toBeVisible();
  });

  test('Quit modal should appear when trying to quit mid-test', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await page.click('text=Begin Test');

    // Click quit
    await page.click('text=Quit Test');

    // Modal should appear
    await expect(page.locator('text=Are you sure you want to quit?')).toBeVisible();

    // Cancel should close modal
    await page.click('text=Cancel');
    await expect(page.locator('text=Are you sure you want to quit?')).toBeHidden();
  });

  test('Complete test flow navigation', async ({ page }) => {
    // Start from home
    await expect(page.locator('text=U.S. Citizenship Test')).toBeVisible();

    // Start test
    await page.click('text=Start Practice Test');
    await expect(page.locator('text=2025 Test')).toBeVisible();

    // Select version
    await page.click('text=2025 Test');
    await expect(page.locator('text=Skip for Now')).toBeVisible();

    // Skip ZIP
    await page.click('text=Skip for Now');
    await expect(page.locator('text=Begin Test')).toBeVisible();

    // Begin test
    await page.click('text=Begin Test');
    await expect(page.locator('text=Question 1')).toBeVisible();

    // Complete test
    for (let i = 0; i < 10; i++) {
      const options = await page.locator('[class*="cursor-pointer"][class*="p-4"]').all();
      if (options.length > 0) {
        await options[0].click();
      }
      await page.click('text=Next Question');
    }

    // Should see results
    await expect(page.locator('text=Your Score')).toBeVisible();

    // Go home
    await page.click('text=Back to Home');
    await expect(page.locator('text=U.S. Citizenship Test')).toBeVisible();
  });
});
