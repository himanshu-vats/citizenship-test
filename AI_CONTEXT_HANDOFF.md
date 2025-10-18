# 🤖 AI Context Handoff Guide

This document helps you switch between Claude Code, Gemini Code Assist, and GitHub Copilot while maintaining context.

---

## Quick Context for Any AI Tool

When you switch to a new AI assistant, share this prompt:

```
I'm working on a US Citizenship Test prep app built with Next.js 15.

Key context:
- Read CLAUDE.md for complete project overview
- Read SESSION_SUMMARY.md for latest session work
- Current status: App is ready for Vercel deployment
- Monetization: Ad-based (no paywall), 100% free
- Recent changes: Removed all premium/paywall code in commit 400ab27

What do you need help with?
```

---

## Files That Contain All Context

### Primary Context Files (Read These First):

1. **`CLAUDE.md`** ⭐ **MOST IMPORTANT**
   - Complete project overview
   - Tech stack and architecture
   - All features and components
   - File structure
   - Development guidelines
   - Recent updates and changes

2. **`SESSION_SUMMARY.md`** (if exists)
   - Latest work session details
   - Recent commits
   - Current tasks in progress
   - Known issues

3. **`package.json`**
   - All dependencies
   - Available scripts
   - Project metadata

4. **`README.md`** (if exists)
   - Project description
   - Quick start guide
   - Basic usage

---

## Context Handoff by Tool

### Switching FROM Claude Code TO Gemini/Copilot:

**Step 1: Update SESSION_SUMMARY.md**

Before switching, create/update this file with current state:

```bash
# I'll create a template for you below
```

**Step 2: Tell the new AI to read context files**

When you start with Gemini or Copilot, say:
```
Please read these files for context:
1. CLAUDE.md - project overview
2. SESSION_SUMMARY.md - latest work
3. VERCEL_DASHBOARD_STEPS.md - current deployment task

I need help with: [your task]
```

---

### Switching FROM Gemini/Copilot TO Claude Code:

**Step 1: Update SESSION_SUMMARY.md** with what you did

**Step 2: Tell Claude Code:**
```
I've been working with another AI. Please read:
- SESSION_SUMMARY.md for what we just did
- CLAUDE.md for project context

Current task: [describe what you need]
```

---

## Session Summary Template

Create this file whenever you switch AIs:

**File: `SESSION_SUMMARY.md`**

```markdown
# Current Session Summary

**Date:** 2025-10-18
**AI Used:** Claude Code
**Branch:** main
**Latest Commit:** 400ab27

## What We Just Did

1. Removed all paywall/premium code from app
2. Made app 100% free with unlimited features
3. Created deployment documentation:
   - DEPLOY_NOW.md
   - VERCEL_DEPLOYMENT.md
   - LAUNCH_GUIDE.md
   - VERCEL_DASHBOARD_STEPS.md
4. Committed and pushed to GitHub
5. Ready for Vercel deployment

## Current Task

Deploying to Vercel from dashboard using GitHub integration

## Next Steps

- [ ] Deploy from Vercel dashboard
- [ ] Test deployed app
- [ ] Add PWA support (later session)
- [ ] Add Google AdSense (later session)

## Files Modified This Session

- app/page.js - Removed paywall logic
- CLAUDE.md - Updated monetization strategy
- Created 4 new deployment guides
- Created vercel.json

## Known Issues

None - build passes, ready for production

## Environment Variables

- GOOGLE_CIVIC_API_KEY - optional, in .env.local (not committed)
- App works fine without it

## Important Notes

- All paywall code removed
- No test limits anymore
- Premium features removed
- App is 100% free now
```

---

## Git History as Context

Any AI can read your commit history:

```bash
# Show recent commits
git log --oneline -10

# Show latest commit details
git log -1 --stat

# Show what changed in last commit
git show HEAD
```

**Tell your AI:**
```
Please run: git log -1 --stat
This shows what I just did.
```

---

## Quick Context Commands for AI

### For Claude Code:
```
Read CLAUDE.md and SESSION_SUMMARY.md for context.
Current task: [describe]
```

### For Gemini Code Assist:
```
@workspace Please review CLAUDE.md for project context.
Then read SESSION_SUMMARY.md for latest work.
I need help with: [describe]
```

### For GitHub Copilot:
```
// Read these files for context:
// - CLAUDE.md (project overview)
// - SESSION_SUMMARY.md (current session)
// - package.json (dependencies)

// Current task: [describe]
```

---

## Best Practices When Switching AIs

### Before You Switch:

1. **Commit your work**
   ```bash
   git add .
   git commit -m "Describe what you just did"
   ```

2. **Update SESSION_SUMMARY.md**
   - What you accomplished
   - Current task status
   - Next steps

3. **Note any issues**
   - Errors encountered
   - Pending decisions
   - Blockers

### After You Switch:

1. **Load context immediately**
   - Tell new AI to read CLAUDE.md
   - Share SESSION_SUMMARY.md content
   - Describe current task

2. **Verify AI understands**
   ```
   Can you summarize what this project does and what I'm currently working on?
   ```

3. **Continue from where you left off**

---

## Example: Perfect Handoff

### You're with Claude Code:
```
User: I need to stop here. Update context for next AI.

Claude: I'll update SESSION_SUMMARY.md with what we did.
[Creates/updates file with current state]

Done! When you switch to Gemini or Copilot, tell them:
"Read CLAUDE.md and SESSION_SUMMARY.md for full context"
```

### You switch to Gemini:
```
User: I'm switching from Claude Code. Please read:
1. CLAUDE.md - project overview
2. SESSION_SUMMARY.md - what we just finished
3. VERCEL_DASHBOARD_STEPS.md - current task

We're deploying to Vercel. Can you help me debug a build error?

Gemini: [Reads files and continues from where Claude left off]
```

---

## Critical Files to Keep Updated

### Always Keep These Current:

1. **CLAUDE.md**
   - Update when adding major features
   - Keep "Current Project Status" section accurate
   - Document new patterns/components

2. **SESSION_SUMMARY.md**
   - Update before switching AIs
   - Update after major milestones
   - Keep it concise (1 page max)

3. **Git commits**
   - Commit frequently with good messages
   - Any AI can read commit history
   - Use descriptive commit messages

---

## Context File Priority (Most to Least Important)

When an AI has limited context window:

1. **CLAUDE.md** - Must read (project DNA)
2. **SESSION_SUMMARY.md** - Must read (current state)
3. **package.json** - Should read (dependencies)
4. **Git recent commits** - Should read (recent changes)
5. **Specific file you're working on** - Must read
6. **Related files** - Nice to have

---

## Pro Tips

### Tip 1: One Source of Truth
Keep CLAUDE.md as the master project document. Update it when:
- Adding major features
- Changing architecture
- Updating tech stack
- Completing milestones

### Tip 2: Session Notes
Use SESSION_SUMMARY.md for temporary context:
- Current task status
- Recent changes
- Next steps
- Issues to solve

Delete or archive after major milestones.

### Tip 3: Descriptive Commits
Write commits that any AI can understand:
```bash
# Good
git commit -m "Add dark mode support to all pages with ThemeContext"

# Bad
git commit -m "Updates"
```

### Tip 4: Comment Your Code
Add comments for complex logic:
```javascript
// Personalizes questions based on user's ZIP code
// Falls back to generic answers if no ZIP provided
// See CLAUDE.md section "Question Personalization"
function personalizeQuestion(question, userInfo) {
  // ...
}
```

### Tip 5: Link Docs to Code
Reference documentation in comments:
```javascript
// Configuration for Vercel deployment
// See: VERCEL_DEPLOYMENT.md for full setup guide
export default {
  // ...
}
```

---

## Common Scenarios

### Scenario 1: Hit Claude Code Limit Mid-Task

**What to do:**
1. Ask Claude to update SESSION_SUMMARY.md
2. Commit your current work
3. Switch to Gemini/Copilot
4. Share context: "Read CLAUDE.md and SESSION_SUMMARY.md"

### Scenario 2: Task Requires Specific AI Strength

**Example:** Claude is better at architecture, Copilot at code completion

1. Use Claude for: Planning, refactoring, documentation
2. Use Copilot for: Writing boilerplate, autocomplete
3. Keep SESSION_SUMMARY.md updated when switching

### Scenario 3: Multiple AIs in Same Session

**Workflow:**
- Claude: "Design the ad integration architecture"
- Gemini: "Implement the AdSense component"
- Copilot: "Add TypeScript types" (if you add TS later)

Update SESSION_SUMMARY.md after each AI's contribution.

---

## Emergency Context Recovery

If you lose all context:

**Any AI can reconstruct from:**

1. **Git history**
   ```bash
   git log --all --graph --decorate --oneline
   ```

2. **File structure**
   ```bash
   find . -name "*.md" -o -name "*.js" | grep -v node_modules
   ```

3. **CLAUDE.md file**
   - Complete project overview
   - Always the source of truth

4. **Recent commits**
   ```bash
   git show HEAD~5..HEAD --stat
   ```

**Tell the AI:**
```
I've lost context. Please:
1. Read CLAUDE.md for project overview
2. Run: git log --oneline -10
3. Check the latest changes in: git show HEAD
4. Help me understand current project state
```

---

## Template: SESSION_SUMMARY.md

I'll create this file for you now with current state.

---

## Summary

### To Maintain Context Across AIs:

✅ **Keep CLAUDE.md updated** (master documentation)
✅ **Update SESSION_SUMMARY.md** before switching
✅ **Commit frequently** with descriptive messages
✅ **Tell new AI to read context files**
✅ **Verify AI understands** before continuing

### Key Command When Switching:
```
Read CLAUDE.md and SESSION_SUMMARY.md for full project context.
Latest commit: [hash]
Current task: [description]
```

This ensures smooth handoff between any AI tools! 🤖↔️🤖
