# How to Publish Blog Articles (Simple Guide)

## Your Current Setup

✅ **Hosting:** Vercel (already set up - you're good!)
✅ **Code:** GitHub (your repository)
✅ **Auto-Deploy:** When you save a file on GitHub, Vercel automatically rebuilds your site

## Publishing a New Article (5 Simple Steps)

### Step 1: Go to GitHub
- Open your browser and go to: https://github.com/YOUR_USERNAME/citizenship-test
- Navigate to the `content/blog/` folder

### Step 2: Create New File
- Click the **"Add file"** button (top right)
- Select **"Create new file"**

### Step 3: Name Your File
- Type: `your-article-name.md`
- Example: `new-citizenship-test-2025.md`
- ⚠️ **Important:**
  - Use lowercase
  - Use dashes instead of spaces
  - Must end with `.md`

### Step 4: Copy This Template

```markdown
---
title: "Your Article Title Goes Here"
excerpt: "A one-sentence description that appears on the blog listing page"
category: "News"
date: "2025-01-20T00:00:00.000Z"
readTime: "5 min read"
metaDescription: "SEO description for Google (150 characters max)"
---

## Introduction

Start your article here.

## Main Section

Write your content using these formats:

### Subheading

- Bullet point 1
- Bullet point 2

**Bold text** for emphasis

*Italic text* for subtle emphasis

### Another Section

1. Numbered list
2. Second item
3. Third item

## Conclusion

Wrap up your article.

---

***Disclaimer:** This article provides general information. For specific legal advice, consult with a qualified immigration attorney.*
```

### Step 5: Publish
- Scroll down to the bottom
- Click **"Commit changes"** button (green)
- In the dialog:
  - Commit message: "Add article: Your Article Title"
  - Click **"Commit changes"**

### Step 6: Wait for Deploy (Automatic)
- Go to https://vercel.com/dashboard
- You'll see your site rebuilding (takes 2-3 minutes)
- Once complete, your article is live!

---

## Editing an Existing Article

### Step 1: Find the Article
- Go to GitHub → `content/blog/`
- Click on the article file you want to edit

### Step 2: Click Edit
- Click the **pencil icon** (✏️) in the top right

### Step 3: Make Changes
- Edit the content
- Preview your changes (click "Preview" tab)

### Step 4: Save
- Scroll down
- Click **"Commit changes"**
- Add a commit message like "Update article: Fix typo"
- Click **"Commit changes"**

### Step 5: Auto-Deploy
- Vercel automatically rebuilds (2-3 minutes)
- Changes are live!

---

## Quick Reference: Available Categories

Choose ONE of these for the `category` field:

- **"News"** - Citizenship news, policy changes, announcements
- **"Process Guide"** - How-to guides, step-by-step processes
- **"Question Deep Dive"** - Detailed explanations of specific test questions
- **"Community Q&A"** - Answering common community questions

---

## Quick Reference: Markdown Formatting

| You Type | You Get |
|----------|---------|
| `**bold text**` | **bold text** |
| `*italic text*` | *italic text* |
| `# Big Heading` | Big heading (H1) |
| `## Medium Heading` | Medium heading (H2) |
| `### Small Heading` | Small heading (H3) |
| `- List item` | • List item |
| `1. Numbered item` | 1. Numbered item |
| `[Link text](https://url.com)` | Clickable link |
| `---` | Horizontal line |

---

## Date Format

Always use this exact format for the `date` field:

```
date: "2025-01-20T00:00:00.000Z"
```

- Change the year, month, day as needed
- Keep the `T00:00:00.000Z` part the same

### Date Examples:

- January 20, 2025 → `"2025-01-20T00:00:00.000Z"`
- March 5, 2025 → `"2025-03-05T00:00:00.000Z"`
- December 31, 2025 → `"2025-12-31T00:00:00.000Z"`

---

## Troubleshooting

### Article not showing up?

1. **Check Vercel deployment:**
   - Go to https://vercel.com/dashboard
   - Look for your project
   - Check if deployment succeeded (green checkmark)

2. **Check file location:**
   - File must be in `content/blog/` folder
   - File must end with `.md`

3. **Check frontmatter:**
   - Must have `---` at top and bottom of metadata section
   - All required fields must be present: title, excerpt, category, date, readTime, metaDescription

### Build failed?

1. Check the frontmatter format:
   - Make sure strings are in quotes: `title: "My Title"`
   - Make sure the `---` lines are present
   - No tabs in the YAML (use spaces only)

2. Check for unclosed brackets or quotes in your content

3. View build logs in Vercel dashboard to see the specific error

---

## Example: Complete Article

Here's a complete example you can copy:

```markdown
---
title: "10 Tips for Passing the Citizenship Test on Your First Try"
excerpt: "Master the USCIS civics test with these proven study strategies and preparation tips from successful applicants."
category: "Process Guide"
date: "2025-01-20T00:00:00.000Z"
readTime: "7 min read"
metaDescription: "Learn 10 proven tips to pass the US citizenship test on your first attempt. Study strategies, preparation advice, and common mistakes to avoid."
---

## Introduction

Passing the citizenship test doesn't have to be stressful. With the right preparation strategy, you can ace the civics portion of your naturalization interview on the first try.

## Tip 1: Start Early

Don't wait until the week before your interview to start studying. Give yourself at least 2-3 months to:

- Learn all 100 (or 128) questions thoroughly
- Practice with flashcards daily
- Take multiple practice tests

## Tip 2: Use Multiple Study Methods

Different learning styles work for different people. Try:

- **Flashcards** - Use our [Study Mode](/study) for interactive flashcards
- **Practice Tests** - Take [full-length practice tests](/) regularly
- **Audio** - Listen to questions while commuting
- **Written** - Write out answers to reinforce memory

## Tip 3: Focus on Your Weak Areas

After taking a practice test, identify which questions you missed and focus extra attention on those topics.

### Common Weak Areas:

1. System of government
2. Rights and responsibilities
3. Colonial period and independence
4. Recent American history

## Conclusion

With consistent daily practice and the right study strategies, you'll be well-prepared for your citizenship interview. Start studying today!

---

***Disclaimer:** This article provides general information. For specific legal advice, consult with a qualified immigration attorney.*
```

---

## Summary

**To publish an article:**
1. Go to GitHub
2. Navigate to `content/blog/`
3. Create new file (or edit existing)
4. Copy template, fill in your content
5. Commit changes
6. Wait 2-3 minutes for auto-deploy
7. Article is live!

**No coding required. No additional tools needed. Just GitHub + Vercel (which you already have).**
