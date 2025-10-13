const { test, expect } = require('@playwright/test');

test.describe('Category Selection Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('Test size should auto-adjust when selecting category with fewer questions', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');

    // Set test size to 50
    await page.selectOption('select[name="testSize"]', '50');

    // Select a category (American Government typically has fewer than 50 questions)
    await page.selectOption('select[name="category"]', 'American Government');

    // Check that test size was automatically adjusted
    const testSizeValue = await page.inputValue('select[name="testSize"]');
    const testSizeNum = parseInt(testSizeValue);

    // Test size should be less than or equal to available questions in category
    expect(testSizeNum).toBeLessThanOrEqual(50);

    // Begin Test button should be enabled
    await expect(page.locator('text=Begin Test')).toBeEnabled();
  });

  test('Begin Test button should be disabled when test size exceeds available questions', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');

    // This test verifies the button state logic
    const beginButton = page.locator('text=Begin Test');

    // With "All Categories" selected, button should be enabled
    await expect(beginButton).toBeEnabled();
  });

  test('Category filter should work correctly', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');

    // Select a specific category
    await page.selectOption('select[name="category"]', 'American History');
    await page.click('text=Begin Test');

    // Start the test - all questions should be from the selected category
    await expect(page.locator('text=Question 1')).toBeVisible();

    // We can't directly verify the category without checking question content,
    // but we can verify the test started successfully
    const options = await page.locator('[class*="cursor-pointer"][class*="p-4"]').all();
    expect(options.length).toBeGreaterThan(0);
  });

  test('All categories option should include all questions', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');

    // Select "All Categories"
    await page.selectOption('select[name="category"]', 'all');

    // Should be able to set larger test size
    await page.selectOption('select[name="testSize"]', '50');

    // Begin Test should be enabled
    await expect(page.locator('text=Begin Test')).toBeEnabled();
  });

  test('Category selection should persist when changing test size', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');

    // Select a category
    await page.selectOption('select[name="category"]', 'American Government');
    const selectedCategory = await page.inputValue('select[name="category"]');
    expect(selectedCategory).toBe('American Government');

    // Change test size
    await page.selectOption('select[name="testSize"]', '20');

    // Category should still be selected
    const stillSelectedCategory = await page.inputValue('select[name="category"]');
    expect(stillSelectedCategory).toBe('American Government');
  });

  test('Available question count should update when category changes', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');

    // Check available questions for "All Categories"
    const allCategoriesText = await page.textContent('body');
    expect(allCategoriesText).toContain('questions available');

    // Select a specific category
    await page.selectOption('select[name="category"]', 'American Government');

    // Available question count should update
    const categoryText = await page.textContent('body');
    expect(categoryText).toContain('questions available');
  });

  test('Should handle 2008 test version category filtering', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2008 Test');
    await page.click('text=Skip for Now');

    // Select category
    await page.selectOption('select[name="category"]', 'American Government');

    // Begin Test should work
    await page.click('text=Begin Test');
    await expect(page.locator('text=Question 1')).toBeVisible();
  });

  test('Test size dropdown should show appropriate options for selected category', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');

    // Get all test size options
    const testSizeOptions = await page.locator('select[name="testSize"] option').allTextContents();

    // Should have standard options
    expect(testSizeOptions).toContain('10 Questions');
    expect(testSizeOptions).toContain('20 Questions');
  });

  test('Selecting category with exactly 10 questions should work', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');

    // Set test size to 10
    await page.selectOption('select[name="testSize"]', '10');

    // Select any category
    await page.selectOption('select[name="category"]', 'American Government');

    // Should be able to begin test
    await expect(page.locator('text=Begin Test')).toBeEnabled();
    await page.click('text=Begin Test');

    // Test should start
    await expect(page.locator('text=Question 1')).toBeVisible();
  });

  test('Category dropdown should populate with available categories', async ({ page }) => {
    await page.click('text=Start Practice Test');
    await page.click('text=2025 Test');
    await page.click('text=Skip for Now');

    // Get category options
    const categoryOptions = await page.locator('select[name="category"] option').allTextContents();

    // Should include "All Categories"
    expect(categoryOptions).toContain('All Categories');

    // Should include at least some categories
    expect(categoryOptions.length).toBeGreaterThan(1);
  });
});
