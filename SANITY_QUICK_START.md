# Sanity CMS - Quick Start (5 Minutes)

## Step 1: Create Sanity Project (2 min)

1. Visit https://www.sanity.io/
2. Click "Get started" → Sign up with GitHub
3. Create new project: "CivicsPass Blog"
4. Choose "Clean project"
5. **Copy your Project ID** (looks like `abc123xy`)

## Step 2: Update Environment Variables (1 min)

Edit `.env.local`:
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xy  # ← Replace with your Project ID
NEXT_PUBLIC_SANITY_DATASET=production
```

## Step 3: Test Locally (2 min)

```bash
npm run dev
```

Visit http://localhost:3000/studio and create your first blog post!

## Step 4: Deploy to Vercel (auto)

Add environment variables to Vercel dashboard, then push to GitHub.

---

## That's It!

✅ Your CMS is at: `/studio`
✅ Your blog is at: `/blog`

For detailed instructions, see `SANITY_SETUP.md`
