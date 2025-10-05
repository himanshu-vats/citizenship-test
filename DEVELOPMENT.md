markdown# Citizenship Test App - Complete Development Documentation

## Project Vision
Build a US Citizenship test prep app to learn end-to-end mobile/web app development including design, deployment, maintenance, and monetization. Use the 2025 USCIS civics test (128 questions) and legacy 2008 version (100 questions).

## Critical Architecture Decisions

### Multi-Perspective Analysis Results

**Security Expert Verdict:**
- ❌ REJECTED: Storing static questions in PostgreSQL (unnecessary attack surface)
- ❌ REJECTED: Handling payments directly (PCI compliance nightmare)
- ✅ APPROVED: Questions bundled as JSON in app (no database breach risk)
- ✅ APPROVED: Stripe/RevenueCat for payments (never see card data)
- ✅ APPROVED: Minimal PII collection (hashed emails only)

**Design Patterns Expert Verdict:**
- ❌ REJECTED: React Native for web (janky experience)
- ❌ REJECTED: Redux for simple app (over-engineering)
- ✅ APPROVED: Next.js with static generation (instant load, free hosting)
- ✅ APPROVED: Progressive Web App approach (offline support)
- ✅ APPROVED: Native mobile later (only if web proves profitable)

**CFO Verdict:**
- ❌ REJECTED: Original freemium model (too generous, won't convert)
- ❌ REJECTED: $2.99/month subscription (too cheap, high churn)
- ✅ APPROVED: $14.99 one-time premium (sustainable unit economics)
- ✅ APPROVED: Strict free tier limits (creates urgency)
- ✅ APPROVED: Zero-cost architecture until revenue proves demand

### Final Tech Stack
Frontend:

Next.js 15 (App Router)
Tailwind CSS
JavaScript (not TypeScript for speed)

Data:

JSON files bundled in app
No database initially
localStorage for user progress

Hosting:

Vercel (free tier)
Cost: $0/month for unlimited free users

Premium Features (Phase 2):

Supabase for sync ($25/month, only after revenue)
Stripe Payment Links
Cost: Only scales with paying users


## Monetization Strategy

### Free Tier (Forever Free)
- Browse all 128 questions
- Study mode (flashcards)
- 1 practice test per day (10 questions)
- Local progress tracking
- Basic score history

### Premium ($14.99 One-Time)
- Unlimited practice tests
- Full test simulations (20 questions)
- 65/20 special consideration mode
- Spaced repetition algorithm
- Progress sync across devices
- Audio pronunciation
- Category filtering
- Interview simulation

### Financial Projections
Break-even: 100 total users with 2% conversion

100 users × 2% = 2 premium sales
2 × $14.99 = $29.98 revenue
Infrastructure: $0/month (free tier)
Profit: $29.98 first month

Sustainable: 1000 users with 3% conversion

1000 users × 3% = 30 premium sales
30 × $14.99 = $449.70 revenue
Infrastructure: $50/month (Supabase + bandwidth)
Profit: ~$400 first month, then $50/month


## Complete Feature List

### Phase 1: MVP (Week 1)
1. **Question Display**
   - Show question text
   - Display multiple answer options
   - Click to select answer

2. **Practice Test Mode**
   - 10 random questions
   - Progress indicator (Question X of 10)
   - Immediate scoring
   - Pass/fail result (need 6/10)

3. **Study Mode**
   - Browse all 128 questions
   - Show/hide answers
   - Navigate previous/next
   - Category labels visible

4. **Progress Tracking**
   - localStorage implementation
   - Test history (date, score, pass/fail)
   - Daily test counter
   - Simple stats page

5. **Free Tier Limits**
   - 1 practice test per 24 hours
   - Reset at midnight local time
   - Clear messaging when limit reached

6. **Basic UI**
   - Clean, accessible design
   - Mobile responsive
   - Fast loading
   - Works offline (after first visit)

### Phase 2: Monetization (Week 2)
1. **Premium Paywall**
   - Stripe Payment Links integration
   - License key system
   - Premium unlock logic
   - Premium features gated

2. **Enhanced Features**
   - Unlimited test mode
   - Full 20-question simulations
   - Progress sync (Supabase)
   - Category filtering

3. **65/20 Mode**
   - Filter to 20 asterisk-marked questions
   - Simplified test for eligible users
   - 6/10 passing score

### Phase 3: Growth (Month 2+)
1. **Audio Support**
   - Text-to-speech for questions
   - Answer pronunciation
   - Cached audio files

2. **Spaced Repetition**
   - Track wrong answers
   - Show difficult questions more often
   - Adaptive learning algorithm

3. **Interview Simulator**
   - Mock interview flow
   - Random question selection
   - Timer mode
   - Feedback and tips

4. **Analytics**
   - PostHog integration
   - Conversion funnel tracking
   - User behavior insights
   - A/B testing capability

### Not Building (Explicitly Cut)
- ❌ User accounts initially (cost, complexity)
- ❌ Social/community features (expensive, rarely used)
- ❌ Multiple languages (10x content cost, unproven)
- ❌ Native mobile apps initially (wait for web PMF)
- ❌ Real-time multiplayer
- ❌ Gamification/badges

## Security Implementation

### Data Protection
```javascript
// Questions: Static JSON (no API needed)
import questions from '@/data/questions.json';

// User data: Minimal and local
interface UserData {
  id: string;              // UUID
  hashedEmail: string;     // SHA-256, not plaintext
  isPremium: boolean;
  premiumExpiresAt?: number;
  // NO personal info, NO progress until premium
}

// Progress: Local until paid
localStorage.setItem('progress', encryptedProgress);
Payment Security

Use Stripe Checkout (hosted payment page)
Never handle card data
Webhook validation for premium activation
License keys for verification

Rate Limiting
javascript// Prevent abuse without backend
const dailyLimit = {
  tests: 1,
  resetTime: getMidnight(),
  checkLimit: () => {
    const count = localStorage.getItem('dailyTests');
    return parseInt(count) < dailyLimit.tests;
  }
};
Development Timeline
Week 1: MVP Build
Day 1 - Sunday (3 hours) ✅ COMPLETED

Environment setup (Codespaces)
Next.js project creation
Questions JSON (all 128 questions)
File structure
Commit: "Day 1: Setup complete with all 128 questions"

Day 2 - Monday (3 hours)

Build Question component
Display single question with answers
Click handlers
Basic styling with Tailwind
Test component works

Day 3 - Tuesday (3 hours)

Random question selection logic
Practice test flow (10 questions)
Question navigation
Results screen with scoring
Pass/fail logic (6/10 threshold)

Day 4 - Wednesday (3 hours)

localStorage helpers
Save test results
Track daily test count
Daily limit enforcement (1 test/day)
Stats page (view history)

Day 5 - Thursday (3 hours)

Study mode (browse all questions)
Show/hide answers
Navigation between pages
Home page with mode selection
Top navigation menu

Day 6 - Friday (3 hours)

Premium page (pricing info)
Bug fixes from manual testing
Mobile responsive testing
Polish UI/UX

Day 7 - Saturday (3 hours)

Deploy to Vercel
Custom domain (optional)
Test production build
Final smoke tests
Share on Reddit/Product Hunt

Week 2: Monetization (If Week 1 Success)

Add Stripe integration
Premium unlock system
Enhanced features
Analytics setup

Month 2: Growth Features (If Revenue > $500)

Audio support
Spaced repetition
Interview simulator
Mobile apps evaluation

File Structure
citizenship-test/
├── app/
│   ├── page.js                 # Home/Practice test
│   ├── layout.js               # Global layout + nav
│   ├── study/
│   │   └── page.js            # Study mode
│   ├── stats/
│   │   └── page.js            # Progress tracking
│   └── premium/
│       └── page.js            # Premium upsell
├── components/
│   ├── Question.jsx           # Question display
│   ├── Results.jsx            # Test results
│   └── Navigation.jsx         # Nav bar
├── data/
│   ├── questions.json         # 2025 questions (128)
│   └── questions-2008.json    # Legacy (100) - Phase 2
├── lib/
│   ├── storage.js             # localStorage helpers
│   ├── testLogic.js           # Quiz logic
│   └── constants.js           # Config values
└── public/
    └── favicon.ico
Key Metrics to Track
Product Metrics

DAU (Daily Active Users)
Retention (D1, D7, D30)
Tests completed per user
Pass rate on practice tests
Bounce rate

Business Metrics

Conversion rate (free → premium)
Average revenue per user (ARPU)
Customer acquisition cost (CAC)
Time to first test
Time to premium upgrade

Technical Metrics

Page load time (<2 seconds target)
Lighthouse score (>90 target)
Bundle size (<200KB target)
Error rate
API response time (if/when added)

Kill Criteria

If conversion <1% after 1000 users → pivot
If retention D7 <20% → fix onboarding
If costs > revenue for 3 months → shut down

Differentiation vs Competitors
Our Unique Advantages

2025 questions - Most apps still use 2008 version
Both versions - Show comparison between old/new
Offline-first - Works without internet
One-time purchase - No subscription fatigue
Fast & simple - No bloat, loads instantly
Privacy-focused - Minimal data collection

Competitor Analysis
Existing apps typically:

Use old 2008 questions
Heavy subscription models ($5-10/month)
Require accounts to start
Full of ads in free version
Slow, bloated mobile apps
Poor web experience

Risk Mitigation
Technical Risks

Risk: Codespace times out
Mitigation: Commit often, use git push
Risk: Vercel deployment fails
Mitigation: Test build locally first
Risk: localStorage cleared by user
Mitigation: Warn before clear, export feature

Business Risks

Risk: No one pays for premium
Mitigation: Free tier still useful, build audience first
Risk: Competitors copy quickly
Mitigation: Speed to market, build trust/brand
Risk: Unexpected costs
Mitigation: Use free tiers, only add paid services after revenue

Legal Risks

Risk: USCIS copyright claim
Mitigation: Questions are public domain government content
Risk: Payment processing issues
Mitigation: Use Stripe (they handle compliance)

Current Status
Completed

✅ Day 1: Environment setup
✅ All 128 questions in data/questions.json
✅ File structure created
✅ Next.js app running
✅ Code committed to GitHub

In Progress

🔄 Day 2: Question component

Blocked

None

Next Actions

Build Question.jsx component
Display first question on home page
Test in browser

Context for Next Conversation
Quick Start Context:
Project: US Citizenship test prep app
Stack: Next.js + Tailwind + localStorage
Current: Day 2 - Building Question component
Repo: [your-github-url]
Last commit: "Day 1: Setup complete with all 128 questions"

Check DEVELOPMENT.md for full context.
Notes & Learnings
Development Principles

Ship fast, iterate based on feedback
Don't build features users won't pay for
Free tier must be good, premium must be obviously better
Test on real users, not assumptions
Measure everything, decide based on data

Cost Control Rules

Use free tiers until they're exhausted
Only add paid services after revenue justifies it
Design for minimal backend (static-first)
Cache aggressively
Manual process > automated cost until scale demands it

Time Management

3 hours/day = 21 hours/week
Reserve 20% for unexpected issues
Don't gold-plate features
Good enough > perfect
Ship by Day 7, improve in Week 2


Last Updated: Day 1 Complete
Next Update: After Day 2