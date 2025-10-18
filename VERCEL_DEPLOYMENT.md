# 🚀 Vercel Deployment Instructions

## Quick Deployment (5 Minutes)

### Method 1: Vercel Dashboard (Easiest - Recommended)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Click "Sign Up" (use GitHub login for easiest setup)

2. **Create New Project**
   - Click "Add New..." → "Project"
   - You'll see options to import from Git

3. **Choose Your Deployment Method:**

   **Option A: Deploy from GitHub (Recommended)**
   - If your code is on GitHub:
     1. Click "Import Git Repository"
     2. Authorize Vercel to access your GitHub
     3. Select your `citizenship-test` repository
     4. Click "Import"

   **Option B: Deploy without Git**
   - If code is only local:
     1. Install Vercel CLI (see Method 2 below)
     2. Use CLI to deploy

4. **Configure Project** (Vercel auto-detects Next.js settings)
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)
   - Install Command: `npm install` (auto-filled)

   **Environment Variables:** (Leave empty for now - none required)

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - You'll get a URL like: `citizenship-test-abc123.vercel.app`

6. **Test Your Live App**
   - Click the generated URL
   - Test on your phone and computer
   - Share with friends!

---

### Method 2: Vercel CLI (For Developers)

If you prefer command line:

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to Vercel
vercel login
# Opens browser to authenticate

# 3. Deploy from project directory
cd /workspaces/citizenship-test
vercel

# Follow prompts:
# ? Set up and deploy? [Y/n] y
# ? Which scope? (select your account)
# ? Link to existing project? [y/N] n
# ? What's your project's name? citizenship-test
# ? In which directory is your code located? ./
# ? Want to override the settings? [y/N] n

# Vercel will:
# - Build your app
# - Deploy to production
# - Give you URLs

# 4. Your app is live!
# Production: https://citizenship-test.vercel.app
# Deployment URL: https://citizenship-test-abc123.vercel.app
```

---

## After First Deployment

### Your URLs:

You'll get **two types of URLs**:

1. **Production URL** (main URL):
   - Format: `https://citizenship-test.vercel.app`
   - This is your permanent URL
   - Auto-updates when you push to main branch

2. **Preview URLs** (for each deployment):
   - Format: `https://citizenship-test-abc123.vercel.app`
   - Unique for each deployment
   - Good for testing before going live

---

## Setting Up Auto-Deployment (Optional but Recommended)

If you deployed via GitHub:

**Every time you push code to GitHub, Vercel auto-deploys!**

```bash
# Make changes to your code
git add .
git commit -m "Update homepage design"
git push origin main

# Vercel automatically:
# 1. Detects the push
# 2. Builds your app
# 3. Deploys to production
# 4. Sends you an email with deployment URL
```

---

## Post-Deployment Checklist

### ✅ Test Your Live App:

1. **Desktop Testing:**
   - [ ] Visit your Vercel URL
   - [ ] Test version selection (2008 vs 2025)
   - [ ] Take a full practice test
   - [ ] Check study mode (flashcards)
   - [ ] View stats page
   - [ ] Toggle dark mode
   - [ ] Check settings page

2. **Mobile Testing:**
   - [ ] Open URL on iPhone/Android
   - [ ] Test portrait and landscape modes
   - [ ] Verify touch interactions work
   - [ ] Check dark mode toggle
   - [ ] Test navigation (bottom nav bar)
   - [ ] Try "Add to Home Screen" (Safari → Share → Add to Home Screen)

3. **Performance Check:**
   - [ ] App loads quickly (should be under 3 seconds)
   - [ ] No console errors (open browser DevTools)
   - [ ] Images load properly
   - [ ] Dark mode transitions smoothly

---

## Troubleshooting

### Build Fails on Vercel?

**Check Build Logs:**
- In Vercel dashboard → Your project → Deployments
- Click failed deployment → View Logs
- Look for error messages

**Common Issues:**

1. **"Module not found" errors:**
   ```bash
   # Make sure all dependencies are in package.json
   npm install
   git add package.json package-lock.json
   git commit -m "Update dependencies"
   git push
   ```

2. **Environment variables missing:**
   - For now, you don't need any
   - Google Civic API key is optional (app works without it)

3. **Build timeout:**
   - Vercel free tier has 45-minute build limit
   - Your app builds in ~30 seconds, so this shouldn't happen

---

## Adding a Custom Domain (Later)

Once you're ready to use a custom domain:

1. **Buy a domain** (Namecheap, Google Domains, Cloudflare)
   - Suggested: `uscitizenship.app` (~$12/year)

2. **Add to Vercel:**
   - Project Settings → Domains
   - Add your domain
   - Follow DNS instructions

3. **SSL Certificate:**
   - Vercel auto-generates free SSL
   - Your site will be HTTPS automatically

---

## Vercel Free Tier Limits

Your app fits comfortably in Vercel's free tier:

- ✅ **Bandwidth:** 100 GB/month (enough for ~100,000 page views)
- ✅ **Build time:** 100 hours/month (you use ~5 minutes per build)
- ✅ **Deployments:** Unlimited
- ✅ **Functions:** 100 GB-hours/month (your API route is tiny)
- ✅ **Serverless Functions:** 100 hours/month

**You won't hit these limits unless you get 50,000+ users/month.**

---

## Monitoring Your App

### Vercel Analytics (Free):

1. Go to Project → Analytics
2. See:
   - Page views
   - Unique visitors
   - Top pages
   - Performance scores

### Vercel Speed Insights (Free):

1. Enable in Project Settings
2. Tracks:
   - Core Web Vitals
   - Load times
   - Performance by device

---

## What's Next After Deployment?

### Immediate (Same Day):
- [x] Deploy to Vercel
- [ ] Test on multiple devices
- [ ] Share with friends for feedback
- [ ] Add to your iPhone home screen

### This Week:
- [ ] Submit to Google Search Console (for SEO)
- [ ] Create social media accounts
- [ ] Post on Reddit r/USCIS (be helpful, not promotional)

### Next Week:
- [ ] Consider buying custom domain
- [ ] Set up Google Analytics (optional)
- [ ] Add PWA support (make installable on iOS)

### Later:
- [ ] Apply for Google AdSense (if you want ads)
- [ ] Build iOS app for App Store
- [ ] Build Android app for Google Play

---

## Need Help?

If deployment fails or you have questions:

1. Check Vercel's build logs
2. Run `npm run build` locally to test
3. Check that all files are committed to Git
4. Verify package.json has all dependencies

---

## Success! 🎉

Once deployed, you'll have:

- ✅ Live web app at `https://your-app.vercel.app`
- ✅ Auto-deployment on every Git push
- ✅ Free HTTPS/SSL certificate
- ✅ Global CDN (fast worldwide)
- ✅ Automatic scaling
- ✅ Zero server management

**Your app is now accessible to anyone, anywhere, on any device!**

Share your URL and start helping people prepare for their citizenship test! 🗽
