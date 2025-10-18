# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

US Citizenship Test prep app built with Next.js 15. Helps users study for the USCIS civics test using both 2025 (128 questions) and 2008 (100 questions) versions. Questions bundled as JSON in the app with no database dependency.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript (no TypeScript)
- **Styling**: Tailwind CSS v4 with custom dark mode support
- **Data Storage**: localStorage for user progress, JSON files for questions
- **State Management**: React Context (ThemeContext for dark mode)
- **Hosting**: Vercel (designed for free tier)

## Development Commands

```bash
# Start development server (localhost:3000)
npm run dev

# Production build
npm build

# Start production server
npm start

# Lint code
npm run lint

# Verify USCIS data is up to date
npm run verify-data

# Check for monthly data updates
npm run monthly-check
```

## Architecture & Code Organization

### File Structure

```
app/
├── page.js                          # Main test flow (home, version select, zip, options, test, results)
├── layout.js                        # Global layout
├── study/page.js                    # Flashcard study mode (NEW)
├── stats/page.js                    # Test history and progress tracking
├── personalize/page.js              # Manage user representatives
└── api/representatives/route.js     # ZIP code → representative lookup

components/
├── AppHeader.jsx                    # Global header with back navigation & dark mode toggle
├── BottomNav.jsx                    # Bottom navigation bar (Home, Study, Stats, Settings)
├── Question.jsx                     # Test question display with answers
├── QuitModal.jsx                    # Confirmation modal for quitting test
├── ResultsScreen.jsx                # Test results screen (replaced alert popup)
├── InlineZipPrompt.jsx              # Inline ZIP code prompt during tests
└── PaywallModal.jsx                 # Premium feature paywall modal

lib/
├── answerGenerator.js               # Generates wrong answers, personalizes questions
├── testLogic.js                     # Quiz logic helpers
├── storage.js                       # localStorage helpers
└── ThemeContext.js                  # React Context for dark mode theme management

data/
├── questions-2025.json              # 2025 test (128 questions)
├── questions-2008.json              # 2008 test (100 questions)
├── wrongAnswers-2025.json           # Pre-made wrong answers
└── wrongAnswers-2008.json           # Pre-made wrong answers
```

### Key Components & Patterns

**Test Flow State Machine** (`app/page.js`)
The main page implements a multi-screen wizard flow:
1. Home screen → version selection
2. Version selection (2008 vs 2025)
3. ZIP code prompt (optional personalization)
4. Test options (size, category)
5. Test in progress
6. Results screen (professional component, not alert)

State is managed via `useState` hooks with screen transitions controlled by boolean flags (`showVersionSelect`, `showZipPrompt`, `showOptions`, `testStarted`, `showResults`).

**Question Personalization** (`lib/answerGenerator.js`)
Questions about user's specific representatives (senators, house rep, governor, state capital) are dynamically personalized when ZIP code is provided. Key question IDs: 20, 23, 29, 43, 44, 61. Without ZIP, these questions are excluded from tests.

Function `prepareQuestionForTest()` combines:
- Correct answers (potentially personalized)
- 3 wrong answers from `wrongAnswers-*.json` or fallback generation
- Shuffles options
- Returns explanation generator function

**Representative Lookup** (`app/api/representatives/route.js`)
API route accepts ZIP code and returns:
- State info (uses zippopotam.us API)
- Senators (hardcoded current list)
- Governor (hardcoded current list)
- State capital (hardcoded)
- Representative (Google Civic API if key available, else fallback message)

**Data Format** (JSON files)
```javascript
{
  "id": 1,
  "question": "What is the supreme law of the land?",
  "answers": ["(U.S.) Constitution", "The Constitution", "Constitution"],
  "category": "American Government"
}
```

Questions can have multiple acceptable answers. During tests, one is randomly selected as the "correct" answer shown, but all are accepted.

## Important Implementation Details

**Test Version Selection**
- 2008 test: 100 questions, asked 10 in interview, need 6 correct (60%)
- 2025 test: 128 questions, asked 20 in interview, need 12 correct (60%)
- Transition date: October 20, 2025 (based on N-400 filing date)

**localStorage Schema**
- `testResults`: Array of completed test results with score, date, answers
- `userRepresentatives`: Cached ZIP lookup data with senators, rep, governor
- `dailyTests`: Count for free tier limit (currently not enforced in MVP)
- `knownQuestions`: Array of question IDs marked as "Know" in Study Mode
- `stillLearningQuestions`: Array of question IDs marked as "Still Learning"
- `testVersion`: Currently selected test version ('2008' or '2025')
- `theme`: User's theme preference ('light', 'dark', or 'system')

**Passing Score Logic**
- Practice tests use same 60% threshold as real test
- 2025: 12/20 questions
- 2008: 6/10 questions
- App allows custom test sizes (10, 20, 50, 100) with scaled passing threshold

## Data Maintenance

**Updating Political Officials**
When senators, governors, or other officials change, update:
- `app/api/representatives/route.js`: Functions `getStateSenators()` and `getCurrentGovernors()`
- Question answers in `data/questions-*.json` for current president/VP/speaker (IDs 30, 38, 39, 57)

**Updating Questions**
Official USCIS questions are in the data files. To verify they're current:
```bash
npm run verify-data
```

This script (`app/scripts/sync-uscis-data.js`) is designed to check USCIS sources for updates.

## Common Patterns

**Adding a New Screen to Test Flow**
1. Add state variable for screen visibility
2. Add conditional render block returning main element
3. Update navigation buttons to set state transitions
4. Maintain single source of truth for progress through flow

**Adding a New Question Category**
1. Update questions in JSON with new category field
2. Categories auto-populate from question data (no hardcoding needed)
3. Filter logic in `handleBeginTest()` handles category selection

**Modifying Test Scoring**
- Scoring happens in `handleNext()` in app/page.js
- Results saved via `saveTestResult()` to localStorage
- Pass/fail logic uses `passingScore` variable (currently 60% threshold)

## Monetization Strategy

**Current Model: Ad-Based Revenue (100% Free App)**

All features are completely free with no limitations:
- ✅ Unlimited study mode (flashcards)
- ✅ Unlimited practice tests (all sizes)
- ✅ All questions available
- ✅ Full progress tracking
- ✅ No daily limits
- ✅ No paywall

**Revenue Sources:**
- Google AdSense (web platform)
- Google AdMob (iOS/Android apps)

**Ad Placement Strategy:**
- Bottom sticky banner ads (non-intrusive)
- Interstitial ads between test completions (configurable frequency)
- No ads during active test taking (preserves study experience)

**Cost Structure:**
- Vercel hosting: Free tier (sufficient for expected traffic)
- Domain: ~$12-15/year
- Apple Developer: $99/year (for iOS App Store)
- Google Play Developer: $25 one-time (for Android - future)

**Target:** Break-even at ~1,000-2,000 monthly active users

## Testing Notes

- No automated tests currently
- Test manually on both desktop and mobile viewports
- Verify localStorage persistence across sessions
- Test with and without ZIP code to ensure personalization works
- Check both 2008 and 2025 question versions

## Current Project Status

**Completed Features (as of latest commits):**
- ✅ Full test flow with multi-screen wizard (home → version → ZIP → options → test)
- ✅ Both 2025 (128 questions) and 2008 (100 questions) test versions
- ✅ ZIP code personalization for representative questions
- ✅ Question component with immediate feedback
- ✅ Stats page for viewing test history
- ✅ Personalize page for managing representative info
- ✅ Wrong answers generation system with curated data
- ✅ Category filtering for test customization
- ✅ Variable test sizes (10, 20, 50, 100 questions)
- ✅ Quit modal with progress confirmation
- ✅ Back navigation during tests
- ✅ Mobile-responsive UI with gradient design
- ✅ **Study Mode with Quizlet-style flashcards**
- ✅ **Professional Results Screen** (replaced alert popup)
- ✅ **Dark Mode Support** (system/light/dark with toggle)
- ✅ **Global Navigation Bar** (BottomNav component)
- ✅ **Settings Page** (theme, version, ZIP, data management)
- ✅ **AppHeader Component** (consistent header with back nav)
- ✅ **Theme Context System** (centralized theme management)
- ✅ **Inline ZIP Prompt** (contextual ZIP code collection during tests)
- ✅ **Paywall Modal** (UI for premium feature gates)

**In Progress (See LAUNCH_GUIDE.md):**
- 🔄 PWA manifest and iOS meta tags
- 🔄 Google AdSense integration (web)
- 🔄 Google AdMob integration (iOS/Android)
- 🔄 Capacitor setup for native iOS app

**Future Enhancements:**
- ❌ Audio pronunciation feature
- ❌ Spaced repetition algorithm
- ❌ Analytics tracking
- ❌ Android app (Google Play Store)

**Development Phase:** Core features complete, working on launch readiness improvements

## Known Limitations

- Representative lookup requires Google Civic API key (graceful fallback without it)
- Questions about user's representative excluded if no ZIP provided
- localStorage data lost if user clears browser data
- No backend, all state is client-side
- Political official data requires manual updates when elections occur

---

## Recent Major Updates (Commit 98c4765 - "Updated multipel features")

### 1. Dark Mode Theme System (`lib/ThemeContext.js`)

**Architecture:**
- React Context-based theme management
- Three modes: `light`, `dark`, `system` (follows OS preference)
- Persists preference to localStorage as `theme`
- Automatically applies `.dark` class to `<html>` element

**ThemeContext API:**
```javascript
const { theme, setTheme } = useTheme();
// theme: 'light' | 'dark' | 'system'
// setTheme: function to update theme
```

**Integration:**
- Wrapped in `app/layout.js` at root level
- All components have access via `useTheme()` hook
- Tailwind CSS v4 dark mode classes throughout (e.g., `dark:bg-slate-900`)

**CSS Implementation (`app/globals.css`):**
- Custom variant: `@custom-variant dark (.dark &);`
- CSS variables for theming defined in `:root`
- Dark mode colors use slate palette (slate-900, slate-800, etc.)

---

### 2. AppHeader Component (`components/AppHeader.jsx`)

**Purpose:** Consistent header across all pages with navigation and theme controls

**Features:**
- Back button with customizable action (optional)
- Page title display
- Dark mode toggle button (moon/sun icons)
- Responsive design with blur backdrop
- Sticky positioning at top

**Props:**
```javascript
{
  title: "Page Title",          // Optional page title
  showBack: true,                // Show/hide back button
  onBackClick: () => {}          // Custom back action (defaults to router.back())
}
```

**Usage Pattern:**
All pages now start with `<AppHeader />` followed by `<main>` content.

---

### 3. Settings Page Implementation (`app/settings/page.js`)

**Features:**
- **Theme Selector**: Light/Dark/System mode toggle with visual indicators
- **Test Version**: Switch between 2008 and 2025 test versions
- **ZIP Code Management**: View/update/clear ZIP code for personalization
- **Data Management**: Clear all progress, test history, study progress
- **About Section**: Links to USCIS resources and app info

**Design:**
- Card-based layout with sections
- Dark mode support throughout
- Confirmation dialogs for destructive actions (clear data)
- Links to external resources (USCIS.gov, feedback, privacy)

**State Management:**
- Uses `useTheme()` for theme state
- Direct localStorage manipulation for other settings
- Real-time updates across app when settings change

---

### 4. Complete UI Redesign for Dark Mode

**All pages redesigned with:**
- Tailwind v4 dark mode classes (`dark:bg-*`, `dark:text-*`)
- Consistent color palette:
  - Light mode: white, gray-50/100, blue-600, purple-600
  - Dark mode: slate-900/800/700, blue-500, purple-500
- Gradient updates for dark mode compatibility
- Border and shadow adjustments for dark mode

**Pages affected:**
- `app/page.js` - Home and test flow
- `app/study/page.js` - Flashcard study mode
- `app/stats/page.js` - Test history
- `app/settings/page.js` - Settings (new implementation)
- `app/personalize/page.js` - Representative management

**Component updates:**
- `components/Question.jsx` - Dark mode answer buttons
- `components/QuitModal.jsx` - Dark mode modal
- `components/ResultsScreen.jsx` - Dark mode results
- `components/BottomNav.jsx` - Enhanced with settings tab

---

### 5. BottomNav Enhancement

**New Features:**
- 4-tab navigation: Home, Study, Stats, Settings
- Active state indicators
- Dark mode support
- iOS safe area padding
- Hide during active tests

**Integration:**
- Moved from individual pages to global `app/layout.js`
- Conditionally hidden during test flow (managed in page logic)

---

### 6. Code Quality Improvements

**Changes:**
- Removed debug console.log statements from API route
- Cleaned up unused imports
- Consistent spacing and formatting
- Added test infrastructure files (`run-tests-with-report.sh`)
- Debug HTML files for theme testing

---

## Recent Additions (Previous Sessions)

### 1. Study Mode - Quizlet-Style Flashcards (`app/study/page.js`)

**Purpose:** Allow users to learn questions BEFORE testing (identified as #1 UX issue in product review)

**Features:**
- Quizlet-inspired flashcard interface with click-to-flip cards
- Two-action system: "Still Learning" (orange) and "Know" (green)
- Progress counters at top showing: Still Learning count, Know count, Unstudied count
- Swipe gestures for mobile: swipe left = Still Learning, swipe right = Know
- Keyboard shortcuts: ← Still Learning, → Know, Space = flip card
- Visual feedback: cards slide out when marked
- Category filtering
- Version toggle (2008/2025)
- "Show only unstudied cards" filter
- Reset progress button
- Status badges on cards showing current state

**localStorage Schema:**
```javascript
knownQuestions: [1, 5, 12, ...] // Array of question IDs marked as "Know"
stillLearningQuestions: [2, 8, ...] // Array of question IDs marked as "Still Learning"
testVersion: '2025' // Currently selected version
```

**Mobile UX:**
- Touch-based swipe detection with 100px threshold
- Distinguishes horizontal from vertical swipes to avoid conflict with scrolling
- Smooth 300ms animations when swiping
- Large touch targets (44x44 minimum)

**Component Location:** `/app/study/page.js` (client-side component)

**Access:** Linked from home page with prominent purple gradient button

---

### 2. Professional Results Screen (`components/ResultsScreen.jsx`)

**Purpose:** Replace unprofessional `alert()` popup with proper results display

**Features:**
- Full-screen results overlay with gradient header
- Large score display (17/20, 85%)
- Pass/Fail status with colored badges and emojis
- Multiple action buttons:
  - **Review All Answers**: Expandable section showing all Q&A with correct/incorrect indicators
  - **Take Another Test**: Restarts test flow from version selection
  - **Study Mode**: Direct link to flashcards
  - **Share Results**: Uses navigator.share() on mobile, clipboard fallback on desktop
  - **Back to Home**: Returns to main screen
- Detailed review section with:
  - Question text
  - User's answer vs correct answer
  - Explanations from answerGenerator
  - Visual indicators (✓ green for correct, ✗ red for wrong)
- "Study Questions You Missed" button at bottom of review
- Performance tips based on score
- Mobile-responsive with scrollable content

**Integration in `app/page.js`:**
- Added `showResults` and `testResults` state
- Results screen renders when `showResults === true`
- Replaces previous `alert()` call in `handleNext()` at line 185
- All test answers preserved including final answer
- Results saved to localStorage before showing screen

**Component Location:** `/components/ResultsScreen.jsx`

**Props:**
```javascript
{
  score: 17,
  total: 20,
  percentage: 85,
  passed: true,
  answers: [...], // Array of all Q&A with explanations
  testVersion: '2025',
  onRetake: () => {},
  onGoHome: () => {}
}
```

---

## Next Priority Tasks

Based on current app status:

1. **PWA Support** (High Priority)
   - Add `manifest.json` with app metadata
   - iOS meta tags for home screen
   - App icons (72px to 512px)
   - Splash screens
   - Standalone display mode
   - Offline service worker (optional)

2. **Premium/Monetization Implementation** (Medium Priority)
   - Enforce daily test limits for free tier (3 tests)
   - Stripe payment integration for one-time $14.99 purchase
   - Premium feature gates (unlimited tests, sync, etc.)
   - License key validation

3. **Enhanced Features** (Low Priority)
   - Audio pronunciation for questions
   - Spaced repetition algorithm for Study Mode
   - Analytics tracking (privacy-friendly)
   - Export test results as PDF
   - Share progress to social media

4. **Polish & Optimization** (Ongoing)
   - Performance optimization (lazy loading, code splitting)
   - Accessibility audit (ARIA labels, keyboard nav)
   - SEO improvements
   - Error boundaries and better error handling

---

## Important Notes for Next Claude Instance

- User does not know React, needs full implementation (not just guidance)
- Build must pass: `npm run build` before committing
- Fix ESLint apostrophe errors: use `&apos;` not `'` in JSX text
- User prefers Quizlet-style UX patterns for learning features
- All features must work offline (no backend dependency)
- Mobile-first design approach
- Follow existing pattern: read file → edit/write → test build
