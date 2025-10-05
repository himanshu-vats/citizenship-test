# Citizenship Test App - Development Log

## Project Overview
- **Goal**: US Citizenship test prep app (web-first, mobile later)
- **Tech Stack**: Next.js 15, Tailwind CSS, localStorage
- **Data**: 128 questions from 2025 USCIS test
- **Timeline**: 7-day MVP

## Architecture Decisions

### Why This Stack?
- Next.js static generation (free hosting, fast, offline-capable)
- No database initially (questions bundled as JSON)
- localStorage for progress (no backend cost)
- Tailwind for rapid UI development

### Monetization Strategy
- Free: 1 practice test/day, study mode
- Premium ($14.99 one-time): Unlimited tests, sync, audio
- Launch free first, add payment only after 1000+ users

### Security Principles
- Questions bundled in app (not in database)
- Minimal PII collection
- Stripe handles payments (no card data touches our server)
- Progress stored locally until premium upgrade

## Development Timeline

### Day 1 - COMPLETED
- ✅ Codespace setup
- ✅ Next.js app created
- ✅ All 128 questions in `data/questions.json`
- ✅ File structure: `components/`, `lib/`
- **Commit**: "Day 1: Setup complete with all 128 questions"

### Day 2 - Monday (Planned)
- Build Question component
- Display first question on page
- Test component rendering

### Day 3 - Tuesday (Planned)
- Practice test logic (10 random questions)
- Navigation between questions
- Results screen

### Day 4 - Wednesday (Planned)
- localStorage integration
- Daily test limit (1/day)
- Test history tracking

### Day 5 - Thursday (Planned)
- Study mode (browse all questions)
- Navigation menu
- Home page redesign

### Day 6 - Friday (Planned)
- Premium page placeholder
- Bug fixes and testing
- Mobile responsive check

### Day 7 - Saturday (Planned)
- Deploy to Vercel
- Final polish
- Launch

## Key Files