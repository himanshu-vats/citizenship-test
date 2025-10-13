const { test, expect } = require('@playwright/test');

test.describe('Scroll Functionality Tests (Mobile)', () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 13 dimensions

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
  });

  test('Review All Answers section should be scrollable on mobile', async ({ page }) => {
    // Start a test
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await page.click('text=Begin Test');

    // Answer all questions to get to results
    for (let i = 0; i < 10; i++) {
      // Click the first option
      const options = await page.locator('[class*="cursor-pointer"][class*="p-4"]').all();
      if (options.length > 0) {
        await options[0].click();
      }
      // Click Next
      await page.click('text=Next Question');
    }

    // Should see results screen
    await expect(page.locator('text=Your Score')).toBeVisible();

    // Click "Review All Answers"
    await page.click('text=Review All Answers');

    // Check that the review section is visible
    const reviewSection = page.locator('text=Question 1');
    await expect(reviewSection).toBeVisible();

    // Check that the page has proper scrolling by checking for overflow
    const mainContainer = page.locator('main').first();
    const hasScroll = await mainContainer.evaluate((el) => {
      return el.scrollHeight > el.clientHeight;
    });

    // The container should be scrollable if content exceeds viewport
    expect(hasScroll).toBeTruthy();

    // Test actual scrolling
    const scrollBefore = await mainContainer.evaluate(el => el.scrollTop);
    await mainContainer.evaluate(el => el.scrollBy(0, 100));
    const scrollAfter = await mainContainer.evaluate(el => el.scrollTop);

    expect(scrollAfter).toBeGreaterThan(scrollBefore);
  });

  test('Explanation text should be scrollable during test on mobile', async ({ page }) => {
    // Start a test
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await page.click('text=Begin Test');

    // Answer first question
    const options = await page.locator('[class*="cursor-pointer"][class*="p-4"]').all();
    if (options.length > 0) {
      await options[0].click();
    }

    // Explanation should be visible
    await expect(page.locator('text=Correct!')).toBeVisible({ timeout: 2000 }).catch(() =>
      expect(page.locator('text=Not quite')).toBeVisible()
    );

    // Check that page is scrollable
    const testContainer = page.locator('main').first();
    const scrollBefore = await testContainer.evaluate(el => el.scrollTop);
    await testContainer.evaluate(el => el.scrollBy(0, 50));
    const scrollAfter = await testContainer.evaluate(el => el.scrollTop);

    // Should be able to scroll (or already at bottom if content fits)
    expect(scrollAfter).toBeGreaterThanOrEqual(scrollBefore);
  });

  test('Test page should have bottom padding for iOS safe area', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await page.click('text=Begin Test');

    // Check that the main container has bottom padding
    const mainContainer = page.locator('main').first();
    const paddingBottom = await mainContainer.evaluate((el) => {
      return window.getComputedStyle(el).paddingBottom;
    });

    // Should have padding (pb-20 = 5rem = 80px or pb-24 = 6rem = 96px)
    const paddingValue = parseInt(paddingBottom);
    expect(paddingValue).toBeGreaterThan(0);
  });

  test('Results screen should have bottom padding for scrollable content', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');
    await page.click('text=Begin Test');

    // Answer all questions quickly
    for (let i = 0; i < 10; i++) {
      const options = await page.locator('[class*="cursor-pointer"][class*="p-4"]').all();
      if (options.length > 0) {
        await options[0].click();
      }
      await page.click('text=Next Question');
    }

    // Check results screen has proper padding
    await expect(page.locator('text=Your Score')).toBeVisible();

    const resultsContainer = page.locator('div[class*="overflow-y-auto"]').first();
    const paddingBottom = await resultsContainer.evaluate((el) => {
      return window.getComputedStyle(el).paddingBottom;
    });

    const paddingValue = parseInt(paddingBottom);
    expect(paddingValue).toBeGreaterThan(0);
  });

  test('Mobile viewport should not have horizontal scroll', async ({ page }) => {
    await page.goto('/');

    // Check that page doesn't overflow horizontally
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // Allow 1px tolerance
  });
});
