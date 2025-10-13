# Testing Documentation

## Overview

This document describes the automated test suite for the U.S. Citizenship Test application. The tests are built using Playwright and cover all major user flows and bug fixes identified during manual testing.

## Test Framework

- **Framework**: Playwright Test
- **Browsers**: Chromium (Desktop), iPhone 13 (Mobile)
- **Base URL**: http://localhost:3000
- **Test Directory**: `/tests`

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test File
```bash
npx playwright test tests/01-answer-capitalization.spec.js
```

### Run Tests in UI Mode (Interactive)
```bash
npx playwright test --ui
```

### Run Tests in Debug Mode
```bash
npx playwright test --debug
```

### Generate HTML Report
```bash
npx playwright show-report
```

### Run Tests on Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=mobile
```

## Test Coverage

### 1. Answer Capitalization Tests (`01-answer-capitalization.spec.js`)

**Purpose**: Ensures all answers in the question banks have proper capitalization for government terms and proper nouns.

**Tests**:
- ✓ All answers start with capital letter (2025 & 2008)
- ✓ Government terms properly capitalized (President, Congress, Senate, etc.)
- ✓ No corrupted words from regex replacement (e.g., "ReligioU.S." or "LoU.S.ana")
- ✓ Proper nouns maintain correct capitalization
- ✓ No lowercase government terms (e.g., "supreme court" should be "Supreme Court")

**Bug Fixed**: Issue #1 - "the President" appearing as lowercase in test options

**Related Files**:
- `data/questions-2025.json`
- `data/questions-2008.json`
- `lib/answerGenerator.js:formatAnswer()`

---

### 2. Wrong Answers Generation Tests (`02-wrong-answers-generation.spec.js`)

**Purpose**: Validates that wrong answer generation works correctly and doesn't leak personalized state data into non-personalized questions.

**Tests**:
- ✓ No duplicate wrong answers in multi-item questions
- ✓ Personalized state data (senators, governor, capital) NOT in non-personalized questions
- ✓ Personalized questions use correct personalized data when available
- ✓ All questions have at least 3 wrong answers
- ✓ All questions have exactly 4 display options
- ✓ Correct answer always in display options
- ✓ Wrong answers don't match any correct answers

**Bugs Fixed**:
- Issue #2 - Duplicate wrong answers in holiday question
- Issue #3 - "Bob Ferguson" and "Olympia" appearing as wrong answers for Declaration of Independence question

**Related Files**:
- `lib/answerGenerator.js:prepareQuestionForTest()`
- `lib/answerGenerator.js:createMultiItemWrongAnswers()`
- `data/wrongAnswers-2025.json`
- `data/wrongAnswers-2008.json`

---

### 3. Scroll Functionality Tests (`03-scroll-functionality.spec.js`)

**Purpose**: Ensures mobile users can scroll properly in all views, especially on iOS devices.

**Tests**:
- ✓ Review All Answers section scrollable on mobile
- ✓ Explanation text scrollable during test on mobile
- ✓ Test page has bottom padding for iOS safe area
- ✓ Results screen has bottom padding for scrollable content
- ✓ No horizontal scroll on mobile viewport

**Bugs Fixed**:
- Issue #4 - Review All Answers not scrollable on iPhone
- Issue #5 - Explanation scroll issue on iPhone during test

**Related Files**:
- `components/ResultsScreen.jsx`
- `app/page.js`
- `app/layout.js`

---

### 4. Navigation Flow Tests (`04-navigation-flows.spec.js`)

**Purpose**: Validates all navigation paths through the application work correctly.

**Tests**:
- ✓ "Maybe Later" button on paywall redirects to home
- ✓ Test history items clickable to show details
- ✓ Settings page has "Back to Home" link
- ✓ Begin Test button appears when category has sufficient questions
- ✓ Bottom navigation visible on all main pages
- ✓ Bottom navigation hidden during active test
- ✓ Back button during test works correctly
- ✓ Quit modal appears when trying to quit mid-test
- ✓ Complete test flow navigation

**Bugs Fixed**:
- Issue #6 - "Maybe Later" on paywall should go to home
- Issue #7 - Stats page tests should be clickable
- Issue #8 - Settings page needs home navigation
- Issue #9 - Begin Test button missing when category has <10 questions

**Related Files**:
- `components/PaywallModal.jsx`
- `app/stats/page.js`
- `app/settings/page.js`
- `app/page.js`

---

### 5. Paywall Enforcement Tests (`05-paywall-enforcement.spec.js`)

**Purpose**: Ensures the free tier limit (3 tests) is properly enforced.

**Tests**:
- ✓ Allow first 3 tests without paywall
- ✓ Show paywall after 3 completed tests
- ✓ Don't show paywall if less than 3 tests completed
- ✓ Paywall reloads test count on each test start
- ✓ Cannot bypass paywall by direct navigation
- ✓ Paywall modal has all expected elements
- ✓ Study mode doesn't trigger paywall

**Bug Fixed**: Issue #10 - Able to take more than 3 tests (paywall not enforcing)

**Related Files**:
- `app/page.js:handleStartTest()`
- `components/PaywallModal.jsx`

---

### 6. Category Selection Tests (`06-category-selection.spec.js`)

**Purpose**: Validates category filtering and test size adjustment logic.

**Tests**:
- ✓ Test size auto-adjusts when selecting category with fewer questions
- ✓ Begin Test button disabled when test size exceeds available questions
- ✓ Category filter works correctly
- ✓ All categories option includes all questions
- ✓ Category selection persists when changing test size
- ✓ Available question count updates when category changes
- ✓ 2008 test version category filtering works
- ✓ Test size dropdown shows appropriate options
- ✓ Selecting category with exactly 10 questions works
- ✓ Category dropdown populates with available categories

**Bug Fixed**: Issue #9 - Begin Test button missing when category has <10 questions

**Related Files**:
- `app/page.js` (category selection handlers)

---

### 7. Results Screen Tests (`07-results-screen.spec.js`)

**Purpose**: Ensures the results screen displays correctly without encoding issues.

**Tests**:
- ✓ No apostrophe display issues (`&apos;` vs actual apostrophe)
- ✓ Pass/fail status correct based on score
- ✓ Results screen shows correct score
- ✓ Share Results button works
- ✓ Review All Answers shows question details
- ✓ Take Another Test button works
- ✓ Back to Home button works
- ✓ Study Mode link available on results
- ✓ Results saved to localStorage
- ✓ Performance tips shown based on score

**Bug Fixed**: Issue #4 - 100% results screen had `&apos;` display issue

**Related Files**:
- `components/ResultsScreen.jsx`

---

## Test Architecture

### Project Structure
```
tests/
├── 01-answer-capitalization.spec.js    # Data validation tests
├── 02-wrong-answers-generation.spec.js # Logic validation tests
├── 03-scroll-functionality.spec.js     # Mobile UX tests
├── 04-navigation-flows.spec.js         # E2E navigation tests
├── 05-paywall-enforcement.spec.js      # Business logic tests
├── 06-category-selection.spec.js       # Filter logic tests
└── 07-results-screen.spec.js           # UI/UX tests
```

### Test Patterns

#### Data-Driven Tests
Tests that validate JSON data files without browser interaction:
```javascript
test('All answers should start with capital letter', () => {
  questions2025.forEach((question) => {
    question.answers.forEach((answer) => {
      expect(answer[0]).toMatch(/[A-Z]/);
    });
  });
});
```

#### Unit Tests (Logic)
Tests that validate library functions directly:
```javascript
test('Personalized data should not leak', () => {
  const preparedQuestion = prepareQuestionForTest(question, '2025', mockUserInfo);
  preparedQuestion.displayOptions.forEach((option) => {
    expect(option).not.toContain('Bob Ferguson');
  });
});
```

#### End-to-End Tests
Tests that simulate full user flows:
```javascript
test('Complete test flow navigation', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Start Practice Test');
  await page.click('text=2025 Test');
  // ... complete flow
});
```

#### Mobile-Specific Tests
Tests that verify mobile-specific behavior:
```javascript
test.use({ viewport: { width: 390, height: 844 } }); // iPhone 13

test('Review section should be scrollable on mobile', async ({ page }) => {
  // ... mobile scroll tests
});
```

### Fixtures and Helpers

#### localStorage Manipulation
```javascript
await page.evaluate(() => localStorage.clear());
await page.evaluate((data) => {
  localStorage.setItem('testResults', JSON.stringify(data));
}, testData);
```

#### Common Selectors
- Buttons: `text=Button Name`
- Options: `[class*="cursor-pointer"][class*="p-4"]`
- Selects: `select[name="category"]`
- Navigation: `nav a[href="/path"]`

---

## CI/CD Integration

### GitHub Actions (Recommended)

Create `.github/workflows/test.yml`:

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 18
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

---

## Debugging Failed Tests

### View Test Report
```bash
npx playwright show-report
```

### Run Single Test in Debug Mode
```bash
npx playwright test tests/04-navigation-flows.spec.js --debug
```

### Screenshots and Traces
Playwright automatically captures:
- Screenshots on failure
- Traces on first retry
- Video recordings (if configured)

Located in: `test-results/`

### Common Issues

**Issue**: Tests fail with "Element not found"
- **Solution**: Increase timeout or add `await expect(...).toBeVisible({ timeout: 5000 })`

**Issue**: Flaky tests (pass sometimes, fail sometimes)
- **Solution**: Add proper waits, avoid `page.waitForTimeout()`, use `waitForLoadState()`

**Issue**: Mobile tests fail but desktop passes
- **Solution**: Check viewport size, iOS safe area insets, scroll behavior

---

## Adding New Tests

### 1. Create Test File
```bash
touch tests/08-new-feature.spec.js
```

### 2. Use Template
```javascript
const { test, expect } = require('@playwright/test');

test.describe('New Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('Feature should work correctly', async ({ page }) => {
    // Arrange
    await page.click('text=Start');

    // Act
    await page.fill('input[name="field"]', 'value');

    // Assert
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

### 3. Run Test
```bash
npx playwright test tests/08-new-feature.spec.js
```

---

## Test Maintenance

### When to Update Tests

1. **UI Changes**: Update selectors if button text or structure changes
2. **New Features**: Add new test files for new functionality
3. **Bug Fixes**: Add regression tests for each bug fix
4. **Data Changes**: Re-run data validation tests when question banks update

### Best Practices

- ✓ Keep tests independent (each test can run alone)
- ✓ Use descriptive test names
- ✓ Clear localStorage before each test
- ✓ Use `beforeEach` for common setup
- ✓ Prefer `toBeVisible()` over `toBeTruthy()`
- ✓ Add timeouts for async operations
- ✓ Group related tests in `describe` blocks
- ✓ Mock external APIs when needed

### Anti-Patterns to Avoid

- ✗ Don't use `page.waitForTimeout()` (use proper waits)
- ✗ Don't chain too many actions without assertions
- ✗ Don't hardcode delays
- ✗ Don't test implementation details
- ✗ Don't share state between tests

---

## Performance Optimization

### Parallel Execution
```bash
npx playwright test --workers=4
```

### Run Only Changed Tests
```bash
npx playwright test --only-changed
```

### Headed Mode (See Browser)
```bash
npx playwright test --headed
```

---

## Test Metrics

### Current Coverage

| Category | Test Files | Test Cases | Status |
|----------|-----------|-----------|--------|
| Data Validation | 1 | 6 | ✓ |
| Logic Validation | 1 | 8 | ✓ |
| Mobile UX | 1 | 5 | ✓ |
| Navigation | 1 | 10 | ✓ |
| Business Logic | 1 | 8 | ✓ |
| Filters | 1 | 10 | ✓ |
| UI/UX | 1 | 10 | ✓ |
| **Total** | **7** | **57** | **✓** |

### Bug Regression Coverage

All 10 manually identified bugs are covered by automated tests:

1. ✓ Answer capitalization
2. ✓ Duplicate wrong answers
3. ✓ Personalized data leaking
4. ✓ Review scroll on iPhone
5. ✓ Explanation scroll on iPhone
6. ✓ Apostrophe display issue
7. ✓ Paywall "Maybe Later" button
8. ✓ Stats page clickability
9. ✓ Category selection test size
10. ✓ Paywall bypass

---

## Support and Resources

- **Playwright Docs**: https://playwright.dev
- **Best Practices**: https://playwright.dev/docs/best-practices
- **API Reference**: https://playwright.dev/docs/api/class-test
- **Debugging Guide**: https://playwright.dev/docs/debug

---

## Contributing

When adding new features:

1. Write tests FIRST (TDD approach)
2. Run tests locally before pushing
3. Ensure all tests pass in CI
4. Update this documentation
5. Add test cases to appropriate files

---

## License

Same as main project license.
