# Netlify OAuth Setup Guide (5 Minutes)

Follow these steps exactly to get your blog CMS working.

---

## Step 1: Update GitHub OAuth App (1 minute)

1. Go to: https://github.com/settings/developers
2. Click on your **"CivicsPass CMS"** OAuth app (or create new if deleted)
3. Set these values:
   ```
   Application name: CivicsPass CMS
   Homepage URL: https://civicspass.com
   Authorization callback URL: https://api.netlify.com/auth/done
   ```
4. Click **"Update application"**
5. **Copy your Client ID** (you'll need it)
6. **Generate a new client secret** and **copy it** (save somewhere safe!)

---

## Step 2: Create Netlify Site (2 minutes)

1. Go to: https://app.netlify.com/signup
2. Sign up (or log in if you have account)
3. Click **"Add new site"** → **"Import an existing project"**
4. Choose **"Deploy with GitHub"**
5. Authorize Netlify to access your repos
6. Select **"himanshu-vats/citizenship-test"**
7. Build settings:
   - Build command: *(leave empty)*
   - Publish directory: *(leave empty)*
8. Click **"Deploy citizenship-test"**
9. Wait 1-2 minutes for deploy (you won't use this deployment, just need the site)

---

## Step 3: Add Environment Variables to Netlify (1 minute)

1. In your Netlify site dashboard, go to **"Site configuration"** → **"Environment variables"**
2. Click **"Add a variable"** → **"Add a single variable"**
3. Add first variable:
   - **Key**: `GITHUB_CLIENT_ID`
   - **Value**: [paste your GitHub OAuth Client ID]
   - Scopes: Keep all selected
   - Click **"Create variable"**
4. Add second variable:
   - **Key**: `GITHUB_CLIENT_SECRET`
   - **Value**: [paste your GitHub OAuth Client Secret]
   - Scopes: Keep all selected
   - Click **"Create variable"**

---

## Step 4: Redeploy Netlify (30 seconds)

This ensures the env vars are loaded:

1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait 30 seconds for deploy to finish

---

## Step 5: Test Your CMS! (1 minute)

1. Wait 2-3 minutes for **Vercel** to rebuild (check https://vercel.com/dashboard)
2. Visit: **https://civicspass.com/admin**
3. Click **"Login with GitHub"**
4. **Authorize the app**
5. **You should see your blog articles!** ✅

---

## How It Works

```
Your Site (Vercel)
    ↓
Click "Login"
    ↓
Netlify OAuth Proxy
    ↓
GitHub Authorization
    ↓
Back to Netlify (exchanges code for token)
    ↓
Back to Your CMS (Vercel)
    ↓
✅ Logged in!
```

**Important:**
- Your site ONLY runs on Vercel
- Netlify is ONLY used for OAuth handling (like a tiny microservice)
- You never visit the Netlify deployment
- Zero cost for both services

---

## Troubleshooting

### "Login with GitHub" button doesn't appear
- Clear browser cache
- Try incognito window
- Check that Vercel has finished deploying

### Login fails / redirects to wrong place
- Verify GitHub OAuth callback is exactly: `https://api.netlify.com/auth/done`
- Check environment variables are set in **Netlify** (not Vercel)
- Make sure you redeployed Netlify after adding env vars

### "Error loading config"
- Check that `/public/admin/config.yml` exists
- Verify the file is committed to GitHub
- Hard refresh the page (Ctrl+Shift+R)

### Still not working?
1. Check Netlify deploy logs for errors
2. Check browser console for errors
3. Verify GitHub OAuth app shows your Client ID matches what's in Netlify

---

## That's It!

Once this is working, you can:
- Write articles at `civicspass.com/admin`
- Edit existing articles
- Upload images
- Articles auto-publish when you save

No more command line or VS Code needed! 🎉
