# Automated Blog Publishing Setup

This document explains how to use the automated blog publishing system for CivicsPass.

## Overview

Your blog is now **fully automated**! You can publish new articles without any code deployment by using one of these methods:

1. **Admin Panel (Recommended)** - Web-based interface
2. **GitHub Web Editor** - Directly edit markdown files on GitHub
3. **Local File Creation** - Create markdown files locally and push to GitHub

## Method 1: Using the Admin Panel (Decap CMS)

### Initial Setup (One-Time)

1. **Deploy to Vercel** (if not already deployed):
   ```bash
   git add .
   git commit -m "Add automated blog system"
   git push
   ```

2. **Enable Netlify Identity on Vercel**:
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Under "Git", enable "Netlify Identity" integration
   - OR manually add this to your site:
     - Go to https://app.netlify.com (create free account)
     - Add your site (connect to GitHub repo)
     - Enable Identity in Settings → Identity
     - Enable Git Gateway in Settings → Identity → Services
     - Invite yourself as a user

3. **Access the Admin Panel**:
   - Visit: `https://your-site.com/admin`
   - Log in with your Netlify Identity credentials
   - You're ready to create articles!

### Creating a New Article

1. Go to `https://your-site.com/admin`
2. Click "New Blog Posts"
3. Fill in the form:
   - **Title**: Article headline
   - **Excerpt**: Short description (shows on blog listing)
   - **Category**: Choose from dropdown (Question Deep Dive, Process Guide, News, Community Q&A)
   - **Publish Date**: When the article should be published
   - **Read Time**: e.g., "5 min read"
   - **Meta Description**: SEO description for search engines
   - **Body**: Write your article in markdown (supports headings, lists, links, etc.)
4. Click "Publish"
5. The article will be automatically committed to GitHub
6. Vercel will automatically rebuild and deploy your site (takes 2-3 minutes)

### Editing an Article

1. Go to `https://your-site.com/admin`
2. Click on the article you want to edit
3. Make your changes
4. Click "Publish" (or "Save" then "Publish")
5. Changes will automatically deploy

---

## Method 2: Using GitHub Web Editor

### Creating a New Article

1. Go to your GitHub repository
2. Navigate to `content/blog/`
3. Click "Add file" → "Create new file"
4. Name your file: `your-article-slug.md` (e.g., `new-citizenship-test-2025.md`)
5. Add frontmatter and content:

```markdown
---
title: "Your Article Title"
excerpt: "Short description of the article"
category: "News"
date: "2025-01-20T00:00:00.000Z"
readTime: "5 min read"
metaDescription: "SEO description for search engines"
---

## Your Article Content

Write your article here using markdown syntax.

### Subheading

- List item 1
- List item 2

**Bold text** and *italic text*.
```

6. Click "Commit changes"
7. Vercel will automatically rebuild and deploy

### Editing an Existing Article

1. Go to `content/blog/` in your GitHub repo
2. Click on the article file
3. Click the pencil icon (Edit)
4. Make your changes
5. Click "Commit changes"

---

## Method 3: Local File Creation

### Creating a New Article Locally

1. Create a new file in `content/blog/your-article-slug.md`
2. Add frontmatter (see example above)
3. Write your article content
4. Commit and push:
   ```bash
   git add content/blog/your-article-slug.md
   git commit -m "Add new article: Your Article Title"
   git push
   ```
5. Vercel automatically deploys

---

## Markdown Syntax Guide

### Headings
```markdown
# H1 Heading
## H2 Heading
### H3 Heading
```

### Text Formatting
```markdown
**Bold text**
*Italic text*
***Bold and italic***
```

### Lists
```markdown
- Unordered list item
- Another item

1. Ordered list item
2. Another item
```

### Links
```markdown
[Link text](https://example.com)
[Internal link](/study)
```

### Code
```markdown
Inline `code` with backticks

```
Code block
```
```

### Blockquotes
```markdown
> This is a blockquote
```

### Horizontal Rule
```markdown
---
```

---

## Frontmatter Fields Explained

| Field | Description | Required | Example |
|-------|-------------|----------|---------|
| `title` | Article headline | Yes | "N-400 Test Version FAQ" |
| `excerpt` | Short description for listing page | Yes | "Get answers to your questions..." |
| `category` | Article category | Yes | "News", "Process Guide", "Question Deep Dive", "Community Q&A" |
| `date` | Publication date (ISO format) | Yes | "2025-01-20T00:00:00.000Z" |
| `readTime` | Estimated reading time | Yes | "5 min read" |
| `metaDescription` | SEO meta description | Yes | "SEO-friendly description" |
| `featuredImage` | Optional header image | No | "/images/blog/article-image.jpg" |

---

## Workflow Summary

**Simple Version:**
1. Create/edit markdown file in `content/blog/`
2. Commit to GitHub (via admin panel, web editor, or push)
3. Vercel automatically rebuilds and deploys
4. Article appears on your site in 2-3 minutes

**No code deployment needed!** Just save your content and it publishes automatically.

---

## Tips

- **Draft Articles**: Save files locally without committing, or use Decap CMS "Draft" status
- **SEO**: Write compelling meta descriptions (150-160 characters)
- **Consistency**: Use the same category naming as existing posts
- **Internal Links**: Link to `/study`, `/`, `/settings` to keep users engaged
- **Publishing Schedule**: Commit future-dated articles; they'll show up based on the date field

---

## Troubleshooting

### Article not showing up?
- Check that the file is in `content/blog/` directory
- Verify frontmatter is valid YAML (proper indentation, quotes around strings)
- Check Vercel deployment logs for build errors

### Build failing?
- Ensure all required frontmatter fields are present
- Check markdown syntax (no unclosed brackets, proper formatting)
- Look at build logs on Vercel dashboard

### Can't access admin panel?
- Make sure Netlify Identity is set up correctly
- Check that `/admin` route is accessible
- Verify Git Gateway is enabled in Netlify Identity settings

---

## Next Steps

1. ✅ Create your first article using the admin panel
2. ✅ Test the automatic deployment
3. ✅ Share the admin URL with content creators
4. ✅ Set up regular publishing schedule

Happy blogging! 🎉
