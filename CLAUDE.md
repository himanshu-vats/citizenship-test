# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

US Citizenship Test prep app built with Next.js 15. Helps users study for the USCIS civics test using both 2025 (128 questions) and 2008 (100 questions) versions. Questions bundled as JSON in the app with no database dependency.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript (no TypeScript)
- **Styling**: Tailwind CSS v4
- **Data Storage**: localStorage for user progress, JSON files for questions
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
├── Question.jsx                     # Test question display with answers
├── QuitModal.jsx                    # Confirmation modal for quitting test
└── ResultsScreen.jsx                # Test results screen (NEW - replaces alert)

lib/
├── answerGenerator.js               # Generates wrong answers, personalizes questions
├── testLogic.js                     # Quiz logic helpers
└── storage.js                       # localStorage helpers

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

## Monetization Design (Not Yet Implemented)

Free tier planned features:
- 1 practice test per day (10 questions)
- Local progress only
- Browse all questions in study mode

Premium ($14.99 one-time) planned features:
- Unlimited tests
- Full 20-question simulations
- Progress sync across devices
- Spaced repetition algorithm
- Audio pronunciation

Currently all features are free (no paywall implemented).

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
- ✅ **Study Mode with Quizlet-style flashcards** (NEW - see below)
- ✅ **Professional Results Screen** (NEW - replaced alert() popup)

**Not Yet Implemented:**
- ❌ Global navigation bar component
- ❌ PWA manifest and iOS meta tags
- ❌ Settings page (ZIP code flow refactor)
- ❌ Daily test limits for free tier
- ❌ Premium paywall and Stripe integration
- ❌ Audio pronunciation
- ❌ Spaced repetition algorithm
- ❌ Analytics tracking

**Development Phase:** Core features complete, working on launch readiness improvements

## Known Limitations

- Representative lookup requires Google Civic API key (graceful fallback without it)
- Questions about user's representative excluded if no ZIP provided
- localStorage data lost if user clears browser data
- No backend, all state is client-side
- Political official data requires manual updates when elections occur

---

## Recent Additions (Current Session)

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

## Next Priority Tasks (from IMPLEMENTATION_PLAN.md)

Based on the product review and implementation plan:

1. **Global Navigation Bar** (Priority 3)
   - Bottom nav for mobile
   - Tabs: Home, Study, Stats, Settings
   - Hide during active test
   - iOS safe area insets

2. **Refactor ZIP Code Flow** (Priority 4)
   - Move ZIP to Settings page
   - Make optional/dismissible
   - Auto-prompt only when personalized question appears
   - Remove from mandatory test flow

3. **PWA Support** (Priority 5)
   - Add `manifest.json`
   - iOS meta tags
   - App icons (72px to 512px)
   - Splash screens
   - Standalone display mode

4. **Settings Page** (Priority 4)
   - Test version switcher
   - ZIP code management
   - Clear all data
   - About/Help

5. **Home Page Redesign** (Priority 4)
   - Make Study Mode most prominent CTA
   - Move test to secondary button
   - Add progress widget
   - Clearer value proposition

---

## Important Notes for Next Claude Instance

- User does not know React, needs full implementation (not just guidance)
- Build must pass: `npm run build` before committing
- Fix ESLint apostrophe errors: use `&apos;` not `'` in JSX text
- User prefers Quizlet-style UX patterns for learning features
- All features must work offline (no backend dependency)
- Mobile-first design approach
- Follow existing pattern: read file → edit/write → test build
