# Blog CMS Setup Guide

Your blog now has a web-based content management system using **Decap CMS** with **GitHub authentication**!

## 🚀 Quick Start (One-Time Setup - 5 Minutes)

### Step 1: Create GitHub OAuth App

1. **Go to GitHub Settings**:
   - Visit: https://github.com/settings/developers
   - Click "OAuth Apps" → "New OAuth App"

2. **Fill in the form**:
   ```
   Application name: CivicsPass CMS
   Homepage URL: https://civicspass.com
   Authorization callback URL: https://api.netlify.com/auth/done
   ```

3. **Register application**

4. **Save your credentials**:
   - Copy the **Client ID**
   - Click "Generate a new client secret"
   - Copy the **Client Secret** (save it somewhere secure!)

### Step 2: Set Up Netlify (Free - Just for OAuth Handling)

Even though Netlify Identity is deprecated, we use Netlify's **free OAuth proxy service** (which is NOT deprecated):

1. **Sign up for Netlify** (if you haven't): https://app.netlify.com/signup
2. **Import your GitHub repo**:
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub → Select `himanshu-vats/citizenship-test`
   - Just click "Deploy site" (we're only using it as an OAuth proxy)

3. **Add environment variables** in Netlify:
   - Go to your site dashboard
   - Click "Site configuration" → "Environment variables"
   - Add two variables:
     - Key: `GITHUB_CLIENT_ID` → Value: [paste your Client ID]
     - Key: `GITHUB_CLIENT_SECRET` → Value: [paste your Client Secret]

4. **Redeploy** (Netlify will pick up the env vars)

### Step 3: Access Your CMS

1. **Wait 2-3 minutes** for Vercel to redeploy your site
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

### Step 1: Generate with AI

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

### Step 2: Copy & Paste into CMS

1. Go to `civicspass.com/admin`
2. Click "New Blog Articles"
3. Copy each field from AI output:
   - AI's Title → Title field
   - AI's Excerpt → Excerpt field
   - AI's Category → Category dropdown
   - AI's content → Body field
4. Set today's date
5. Click "Publish"

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
- Check that your GitHub OAuth app is created
- Verify the callback URL is exactly: `https://api.netlify.com/auth/done`
- Make sure you added GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to Netlify

### "Failed to load entries"
- Check that your GitHub OAuth app has access to the repo
- Try logging out and back in
- Clear browser cache

### Changes not showing on site
- Changes commit to GitHub automatically
- Vercel rebuilds take 2-3 minutes
- Check Vercel dashboard for build status
- Look for the commit in your GitHub repo

### Images not uploading
- Make sure file size is under 5MB
- Supported formats: JPG, PNG, GIF, SVG, WebP
- Try refreshing the page and uploading again

---

## 🚀 Advanced Features

### Enable Draft Workflow

Want to save drafts before publishing?

1. Edit `/public/admin/config.yml`
2. Change `publish_mode: simple` to `publish_mode: editorial_workflow`
3. This gives you: **Draft → In Review → Ready** workflow
4. Only "Ready" articles appear on site

### Local Development

Test CMS changes locally:

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
- ✅ All changes are tracked in Git (full audit log)
- ✅ Can revert any change via GitHub
- ✅ No database to hack
- ✅ No passwords to manage (uses GitHub authentication)

**To add another editor:**
1. Add them as a collaborator on GitHub
2. They visit `civicspass.com/admin`
3. They log in with their GitHub account
4. Done!

---

## 💰 Total Cost

**$0/month forever**

| Service | Cost | Used For |
|---------|------|----------|
| Decap CMS | Free | CMS software |
| GitHub | Free | Content storage |
| Netlify OAuth Proxy | Free | GitHub login |
| Vercel Hosting | Free | Website deployment |

No credit card needed for any of these!

---

## 📱 Mobile Access

The CMS works on mobile browsers:
- Visit `civicspass.com/admin` on your phone
- Log in with GitHub
- Write or edit articles
- Upload images from camera roll

---

## 🆘 Help & Resources

- **Decap CMS Docs**: https://decapcms.org/docs/
- **Markdown Guide**: https://www.markdownguide.org/cheat-sheet/
- **GitHub OAuth Setup**: https://docs.github.com/en/developers/apps/building-oauth-apps
- **Report Issues**: https://github.com/himanshu-vats/citizenship-test/issues

---

## 🎉 Summary

You now have a **professional, zero-cost CMS** for your blog:

1. Visit `civicspass.com/admin`
2. Log in with GitHub (one-time setup)
3. Write articles (or paste from ChatGPT/Claude)
4. Click Publish
5. Live in 2-3 minutes

**No more VS Code. No more command line. Just write and publish!** ✨
