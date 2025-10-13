# Automated Test Suite

This directory contains Playwright-based automated tests for the U.S. Citizenship Test application.

## Quick Start

```bash
# Run all tests
npm test

# Run tests in interactive UI mode
npm run test:ui

# Run tests in debug mode
npm run test:debug

# View HTML test report
npm run test:report

# Run tests with visible browser
npm run test:headed
```

## Test Files

### 01-answer-capitalization.spec.js
Validates proper capitalization in question answers.
- Tests both 2025 and 2008 question sets
- Checks government terms (President, Congress, etc.)
- Prevents word corruption from regex replacements

### 02-wrong-answers-generation.spec.js
Validates wrong answer generation logic.
- No duplicate answers in multi-item questions
- Personalized data isolation (state-specific info doesn't leak)
- Correct answer always present

### 03-scroll-functionality.spec.js
Mobile scroll behavior tests.
- Review section scrollability
- iOS safe area padding
- Explanation text scrolling

### 04-navigation-flows.spec.js
End-to-end navigation tests.
- Complete test flow from home to results
- Bottom nav visibility
- Modal interactions
- Button navigation

### 05-paywall-enforcement.spec.js
Free tier limit enforcement.
- 3 test limit
- Paywall appearance after 3rd test
- Test count reload logic
- Cannot bypass via direct navigation

### 06-category-selection.spec.js
Category filtering and test size logic.
- Auto-adjust test size based on category
- Filter functionality
- Available question count

### 07-results-screen.spec.js
Results display validation.
- No HTML entity encoding issues
- Score display accuracy
- All action buttons work
- localStorage persistence

## Bug Coverage

All manually identified bugs are covered:

1. ✓ Answer capitalization (Test #1)
2. ✓ Duplicate wrong answers (Test #2)
3. ✓ Personalized data leaking (Test #2)
4. ✓ iPhone scroll issues (Test #3)
5. ✓ Apostrophe display (Test #7)
6. ✓ Navigation issues (Test #4)
7. ✓ Paywall bypass (Test #5)
8. ✓ Category selection (Test #6)

## Running Specific Tests

```bash
# Run single test file
npx playwright test tests/01-answer-capitalization.spec.js

# Run tests matching pattern
npx playwright test --grep "capitalization"

# Run only mobile tests
npx playwright test --project=mobile

# Run only desktop tests
npx playwright test --project=chromium
```

## Debugging

```bash
# Debug specific test
npx playwright test tests/04-navigation-flows.spec.js --debug

# Run with trace
npx playwright test --trace on

# Generate trace viewer
npx playwright show-trace trace.zip
```

## Adding New Tests

1. Create new file: `tests/08-feature-name.spec.js`
2. Import test framework: `const { test, expect } = require('@playwright/test');`
3. Write tests following existing patterns
4. Run locally: `npx playwright test tests/08-feature-name.spec.js`
5. Update this README

## Documentation

See `/TESTING.md` for comprehensive documentation.
