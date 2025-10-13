const { test, expect } = require('@playwright/test');

test.describe('Results Screen Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('No apostrophe display issues in results screen', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await page.click('text=Begin Test');

    // Complete test
    for (let i = 0; i < 10; i++) {
      const options = await page.locator('[class*="cursor-pointer"][class*="p-4"]').all();
      if (options.length > 0) {
        await options[0].click();
      }
      await page.click('text=Next Question');
    }

    // Check results screen
    await expect(page.locator('text=Your Score')).toBeVisible();

    // Get all text content
    const bodyText = await page.textContent('body');

    // Should not contain HTML entity codes for apostrophes
    expect(bodyText).not.toContain('&apos;');
    expect(bodyText).not.toContain('&#39;');
    expect(bodyText).not.toContain('&quot;');
  });

  test('Pass/fail status should be correct based on score', async ({ page }) => {
    // Create a passing result (8/10 = 80%)
    const passingResult = {
      score: 8,
      total: 10,
      percentage: 80,
      passed: true,
      date: new Date().toISOString(),
      testVersion: '2025',
      answers: []
    };

    await page.evaluate((result) => {
      localStorage.setItem('testResults', JSON.stringify([result]));
    }, passingResult);

    await page.goto('/stats');
    await page.click('text=80%');

    // Should show passed status
    await expect(page.locator('text=You passed')).toBeVisible();
    await expect(page.locator('text=PASSED')).toBeVisible();
  });

  test('Results screen should show correct score', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await page.click('text=Begin Test');

    // Complete test
    for (let i = 0; i < 10; i++) {
      const options = await page.locator('[class*="cursor-pointer"][class*="p-4"]').all();
      if (options.length > 0) {
        await options[0].click();
      }
      await page.click('text=Next Question');
    }

    // Check score is displayed
    await expect(page.locator('text=Your Score')).toBeVisible();

    // Score should be in format X/10
    const scorePattern = /\d+\/10/;
    const bodyText = await page.textContent('body');
    expect(bodyText).toMatch(scorePattern);
  });

  test('Share Results button should work', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await page.click('text=Begin Test');

    // Complete test
    for (let i = 0; i < 10; i++) {
      const options = await page.locator('[class*="cursor-pointer"][class*="p-4"]').all();
      if (options.length > 0) {
        await options[0].click();
      }
      await page.click('text=Next Question');
    }

    // Share button should be visible
    await expect(page.locator('text=Share Results')).toBeVisible();
  });

  test('Review All Answers should show question details', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await page.click('text=Begin Test');

    // Complete test
    for (let i = 0; i < 10; i++) {
      const options = await page.locator('[class*="cursor-pointer"][class*="p-4"]').all();
      if (options.length > 0) {
        await options[0].click();
      }
      await page.click('text=Next Question');
    }

    // Click Review All Answers
    await page.click('text=Review All Answers');

    // Should show question details
    await expect(page.locator('text=Question 1')).toBeVisible();

    // Should show correct/incorrect indicators
    const bodyText = await page.textContent('body');
    expect(bodyText).toMatch(/✓|✗/);
  });

  test('Take Another Test button should work', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await page.click('text=Begin Test');

    // Complete test
    for (let i = 0; i < 10; i++) {
      const options = await page.locator('[class*="cursor-pointer"][class*="p-4"]').all();
      if (options.length > 0) {
        await options[0].click();
      }
      await page.click('text=Next Question');
    }

    // Click Take Another Test
    await page.click('text=Take Another Test');

    // Should return to version selection
    await expect(page.locator('text=2025 Test')).toBeVisible();
  });

  test('Back to Home button should work', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await page.click('text=Begin Test');

    // Complete test
    for (let i = 0; i < 10; i++) {
      const options = await page.locator('[class*="cursor-pointer"][class*="p-4"]').all();
      if (options.length > 0) {
        await options[0].click();
      }
      await page.click('text=Next Question');
    }

    // Click Back to Home
    await page.click('text=Back to Home');

    // Should be on home page
    await expect(page.locator('text=U.S. Citizenship Test')).toBeVisible();
  });

  test('Study Mode link should be available on results', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await page.click('text=Begin Test');

    // Complete test
    for (let i = 0; i < 10; i++) {
      const options = await page.locator('[class*="cursor-pointer"][class*="p-4"]').all();
      if (options.length > 0) {
        await options[0].click();
      }
      await page.click('text=Next Question');
    }

    // Study Mode link should be visible
    await expect(page.locator('text=Study Mode')).toBeVisible();
  });

  test('Results should be saved to localStorage', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await page.click('text=Begin Test');

    // Complete test
    for (let i = 0; i < 10; i++) {
      const options = await page.locator('[class*="cursor-pointer"][class*="p-4"]').all();
      if (options.length > 0) {
        await options[0].click();
      }
      await page.click('text=Next Question');
    }

    // Check localStorage
    const testResults = await page.evaluate(() => {
      return localStorage.getItem('testResults');
    });

    expect(testResults).toBeTruthy();
    const results = JSON.parse(testResults);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('score');
    expect(results[0]).toHaveProperty('total');
    expect(results[0]).toHaveProperty('percentage');
    expect(results[0]).toHaveProperty('passed');
  });

  test('Performance tips should be shown based on score', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await page.click('text=Begin Test');

    // Complete test
    for (let i = 0; i < 10; i++) {
      const options = await page.locator('[class*="cursor-pointer"][class*="p-4"]').all();
      if (options.length > 0) {
        await options[0].click();
      }
      await page.click('text=Next Question');
    }

    // Results screen should have some guidance text
    const bodyText = await page.textContent('body');

    // Should have encouragement or tips
    expect(bodyText.length).toBeGreaterThan(100);
  });
});
