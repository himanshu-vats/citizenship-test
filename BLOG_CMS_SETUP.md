# Blog CMS Setup Guide

Your blog now has a web-based content management system using **Decap CMS** with **GitHub authentication**!

## 🚀 Quick Start (One-Time Setup - 5 Minutes)

### Step 1: Create GitHub OAuth App (2 minutes)

1. **Go to GitHub Settings**:
   - Visit: https://github.com/settings/developers
   - Click "OAuth Apps" → "New OAuth App"

2. **Fill in the form**:
   ```
   Application name: CivicsPass CMS
   Homepage URL: https://civicspass.com
   Authorization callback URL: https://civicspass.com/api/auth
   ```

3. **Register application**

4. **Save your credentials**:
   - Copy the **Client ID**
   - Click "Generate a new client secret"
   - Copy the **Client Secret** (save it somewhere secure!)

### Step 2: Add Environment Variables to Vercel (2 minutes)

1. **Go to your Vercel dashboard**: https://vercel.com/dashboard
2. **Select your project** (citizenship-test)
3. **Go to Settings** → **Environment Variables**
4. **Add two variables**:
   - Key: `GITHUB_CLIENT_ID` → Value: [paste your Client ID]
   - Key: `GITHUB_CLIENT_SECRET` → Value: [paste your Client Secret]
5. **Redeploy**: Settings → Deployments → Click the "..." menu on latest → "Redeploy"

### Step 3: Access Your CMS! 🎉

1. **Wait 2-3 minutes** for redeployment
2. **Visit**: `https://civicspass.com/admin`
3. **Click "Login with GitHub"**
4. **Authorize the app** (one-time permission)
5. **Start writing!** ✍️

---

## ✍️ How to Use the CMS

### Creating a New Article

1. Go to `civicspass.com/admin`
2. Click **"New Blog Articles"**
3. Fill in the fields:
   - **Title**: Article headline (required)
   - **Excerpt**: 1-2 sentence summary
   - **Category**: Choose from dropdown (Getting Started, Process Guide, Study Tips, etc.)
   - **Publish Date**: Pick a date
   - **Read Time**: e.g., "5 min read"
   - **Meta Description**: SEO description (150-160 characters)
   - **Body**: Write your article in Markdown
4. Click **"Publish"** → Changes commit to GitHub → Site rebuilds automatically!

### Editing an Existing Article

1. Go to `civicspass.com/admin`
2. Click on any article in the list
3. Make your changes
4. Click **"Publish"** to save (commits to GitHub)

### Adding Images

1. Click the image icon in the markdown editor
2. Upload from your computer
3. Image saves to `/public/images/blog/`
4. Image path is automatically inserted

---

## 🎯 Workflow with AI (ChatGPT/Claude)

This is the **easiest way** to create articles:

### Method 1: Generate Full Article with AI

Ask ChatGPT or Claude:

```
Write a 600-word blog article about [topic] for people studying for the US citizenship test.

Use this format:

Title: [Catchy Title]
Excerpt: [1-2 sentence summary]
Category: [Process Guide / Study Tips / Civics Questions]
Read Time: X min read
Meta Description: [150 character SEO description]

[Article content in Markdown format with ## headings and bullet points]
```

Then:
1. Go to `civicspass.com/admin`
2. Click "New Blog Articles"
3. Copy/paste each field from AI output
4. Click "Publish"

### Method 2: Use AI While Writing in CMS

1. Open `civicspass.com/admin` in one tab
2. Open ChatGPT/Claude in another tab
3. Ask AI for sections as you write:
   - "Write an introduction about [topic]"
   - "List 5 tips for [topic]"
   - "Write a conclusion"
4. Copy/paste sections into the Body field
5. Edit as needed
6. Publish!

**That's it!** Article goes live in 2-3 minutes.

---

## 📝 Markdown Quick Reference

The editor uses Markdown. Here's a cheat sheet:

```markdown
## Large Heading (H2)
### Medium Heading (H3)

**Bold text**
*Italic text*

- Bullet point
- Another bullet
  - Nested bullet

1. Numbered item
2. Second item

[Link text](https://example.com)

![Image caption](/images/blog/image.jpg)

> Blockquote (for important notes)

`inline code`
```

---

## 📂 Categories

Choose the best fit for your article:

| Category | Use For |
|----------|---------|
| **Getting Started** | Basics for complete beginners |
| **Process Guide** | Step-by-step instructions (N-400, interview, etc.) |
| **Study Tips** | Learning strategies and techniques |
| **Civics Questions** | Explanations of specific test questions |
| **Immigration Updates** | USCIS news, policy changes |
| **Success Stories** | User testimonials and experiences |

---

## 🔧 Troubleshooting

### "Login with GitHub" button doesn't work
- Check that your GitHub OAuth app callback URL is exactly: `https://civicspass.com/api/auth`
- Verify GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are set in Vercel
- Make sure you redeployed after adding env vars
- Try in an incognito window (clear cache issue)

### "Failed to load entries"
- Check that your GitHub account has write access to the repo
- Try logging out and back in
- Clear browser cache and try again

### "Error: Missing GitHub OAuth credentials"
- You forgot to add environment variables to Vercel
- Go to Vercel → Settings → Environment Variables
- Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET
- Redeploy the site

### Changes not showing on site
- Changes commit to GitHub automatically
- Vercel rebuilds take 2-3 minutes
- Check your Vercel dashboard for build status
- Look for the commit in your GitHub repo history

### Images not uploading
- Make sure file size is under 5MB
- Supported formats: JPG, PNG, GIF, SVG, WebP
- Try refreshing the page and uploading again
- Check browser console for errors

---

## 🚀 Advanced Features

### Enable Draft Workflow

Want to save drafts before publishing?

1. Edit `/public/admin/config.yml`
2. Change `publish_mode: simple` to `publish_mode: editorial_workflow`
3. Commit and push changes
4. This gives you: **Draft → In Review → Ready** workflow
5. Only "Ready" articles appear on site

### Local Development

Test CMS locally:

```bash
npx decap-server
```

Then visit `http://localhost:3000/admin` (works offline!)

### Add More Fields

Edit `/public/admin/config.yml` to add fields like:
- Author name
- Tags
- Featured image
- Reading level
- Custom metadata

See docs: https://decapcms.org/docs/widgets/

---

## 🔐 Security & Permissions

- ✅ Only people with **write access** to your GitHub repo can use the CMS
- ✅ OAuth secrets stored securely in Vercel (never exposed to frontend)
- ✅ All changes are tracked in Git (full audit log)
- ✅ Can revert any change via GitHub history
- ✅ No database to hack
- ✅ No passwords to manage (uses GitHub authentication)

**To add another editor:**
1. Add them as a collaborator on your GitHub repo
2. They visit `civicspass.com/admin`
3. They log in with their GitHub account
4. Done!

---

## 💰 Total Cost

**$0/month forever**

| Service | Cost | Used For |
|---------|------|----------|
| Decap CMS | Free | CMS software |
| GitHub | Free | Content storage & authentication |
| Vercel | Free | Hosting & OAuth handler |

No credit card needed! Everything runs on free tiers.

---

## 📱 Mobile Access

The CMS works perfectly on mobile browsers:
- Visit `civicspass.com/admin` on your phone
- Log in with GitHub
- Write or edit articles
- Upload images from camera roll
- Full-featured mobile experience

---

## 🏗️ How It Works (Technical Overview)

For those curious:

1. **Frontend**: Decap CMS runs entirely in your browser at `/admin`
2. **Authentication**: When you click "Login with GitHub":
   - Redirects to GitHub OAuth
   - GitHub redirects back to `/api/auth` (Vercel serverless function)
   - Function exchanges code for access token
   - Token sent back to CMS in browser
3. **Content Management**: CMS uses token to make GitHub API calls:
   - Read files from `content/blog/`
   - Commit changes directly to GitHub
   - Upload images to `public/images/blog/`
4. **Publishing**: Vercel detects GitHub commits → rebuilds site automatically

**All secure. All free. No databases. No servers to maintain.**

---

## 🆘 Help & Resources

- **Decap CMS Docs**: https://decapcms.org/docs/
- **Markdown Guide**: https://www.markdownguide.org/cheat-sheet/
- **GitHub OAuth Docs**: https://docs.github.com/en/developers/apps/building-oauth-apps
- **Vercel Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **Report Issues**: https://github.com/himanshu-vats/citizenship-test/issues

---

## 🎉 Summary

You now have a **professional, zero-cost CMS** for your blog:

1. ✅ Create GitHub OAuth app (one-time, 2 min)
2. ✅ Add env vars to Vercel (one-time, 2 min)
3. ✅ Visit `civicspass.com/admin`
4. ✅ Log in with GitHub
5. ✅ Write articles (or paste from AI)
6. ✅ Click Publish
7. ✅ Live in 2-3 minutes!

**No more VS Code. No more command line. No more complex deployments. Just write and publish!** ✨

---

## 📋 Quick Reference Card

| Task | How To |
|------|--------|
| **Write new article** | civicspass.com/admin → New Blog Articles |
| **Edit article** | civicspass.com/admin → Click article → Edit → Publish |
| **Add images** | In editor → Click image icon → Upload |
| **Use AI** | ChatGPT/Claude → Copy content → Paste in CMS |
| **Check if published** | Wait 2-3 min → Visit civicspass.com/blog |
| **Add editor** | GitHub repo → Settings → Collaborators |
| **Troubleshoot** | Vercel dashboard → Check deployment logs |

---

**Happy writing! 🚀**
