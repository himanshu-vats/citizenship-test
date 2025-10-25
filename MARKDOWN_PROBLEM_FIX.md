# 🔧 Fix: Article Showing Raw Markdown

## ❌ What You're Seeing

- Sidebar shows "Table of Contents" but no sections
- Article shows `## Step 1` instead of a heading
- Text shows `**bold**` instead of actual bold
- Lists show `- item` instead of bullets

## 🔍 Root Cause

**Sanity Studio does NOT auto-convert markdown.**

When you paste markdown text, it treats it as plain text. You must use the toolbar to format.

---

## ✅ QUICK FIX (Choose One)

### Option A: Delete and Recreate (FASTEST - 5 minutes)

This is the easiest way to get a properly formatted article:

1. **Delete the broken post:**
   - Go to http://localhost:3000/studio
   - Find "Complete N-400 Process Guide"
   - Click "..." → Delete

2. **Create new post the RIGHT way:**
   - Click "+ Create" → "Blog Post"
   - Fill in metadata (title, slug, excerpt, etc.)
   - **✅ CHECK "Long-Form Interactive Article"**
   - In Body field, **type the first heading:**
     ```
     Step 1: Verify Your Eligibility
     ```
   - **SELECT that text**
   - **Click heading dropdown → Choose "Heading 2"**
   - Now type the paragraph content
   - **Select important phrases** → **Click B button** to make bold
   - Continue section by section

### Option B: Fix Existing Post (SLOWER - 15 minutes)

1. **Open post in Studio**
2. **Find first `##`:**
   ```
   ## Step 1: Verify Your Eligibility
   ```
3. **Delete the `##` manually**
4. **SELECT "Step 1: Verify Your Eligibility"**
5. **Click dropdown → Choose "Heading 2"**
6. **Repeat for ALL sections** (all `##`)
7. **Repeat for subsections** (all `###`) → Make "Heading 3"
8. **Find `**text**`:**
   - Delete the `**` manually
   - Select the text
   - Click **B** button
9. **Repeat for ALL bold text**
10. **Fix lists:**
    - Delete `-` at start of each line
    - Select all list lines
    - Click bullet button

---

## 🎯 The RIGHT Way to Create Articles

### Method 1: Type Directly in Studio (BEST)

1. Type your content in the Body field
2. As you type, use the toolbar to format:
   - Headings → Select text → Dropdown → H2/H3
   - Bold → Select text → **B** button
   - Lists → Select lines → Bullet button
   - Links → Select text → Link button → Paste URL

### Method 2: Paste + Format Immediately

1. Paste ONE SECTION from ChatGPT
2. Format it right away (headings, bold, lists)
3. Paste next section
4. Format it
5. Repeat

**DON'T paste the entire article and expect it to work!**

---

## 📸 Visual Guide: Before vs After

**BEFORE (Wrong - shows markdown):**
```
## Step 1: Verify Your Eligibility

Before spending $760, **confirm you meet requirements**.

**Basic requirements:**
- At least 18 years old
- Permanent resident for 5 years
```

**AFTER (Correct - formatted):**

<Shows as actual large heading>
**Step 1: Verify Your Eligibility**

Before spending $760, **confirm you meet requirements**.

**Basic requirements:**
• At least 18 years old
• Permanent resident for 5 years

---

## ⚡ Quick Toolbar Reference

| Want This | Do This |
|-----------|---------|
| Large section heading | Select text → Dropdown → "Heading 2" |
| Medium subsection heading | Select text → Dropdown → "Heading 3" |
| **Bold text** | Select text → Click **B** |
| *Italic text* | Select text → Click *I* |
| [Blue clickable link](url) | Select text → Link button → Paste URL |
| • Bulleted list | Select lines → Bullet button |
| 1. Numbered list | Select lines → Number button |

---

## 🔬 Why Table of Contents is Empty

The TOC extracts from H2 and H3 headings in your article.

**If TOC is empty:**
- Your article has NO properly formatted H2/H3 headings
- It only has plain text with `##` and `###`

**To fix:**
- Format ALL `## Text` as "Heading 2"
- Format ALL `### Text` as "Heading 3"
- TOC will auto-populate

---

## ✅ How to Verify It's Fixed

### In the Studio editor:
- [ ] Headings appear LARGER and BOLD
- [ ] No `##` or `###` visible
- [ ] Bold text is darker (no `**`)
- [ ] Lists have bullets/numbers (no `-`)
- [ ] Links are blue and underlined (no `[text](url)`)

### On the published page:
- [ ] Sidebar shows all sections
- [ ] Clicking TOC items scrolls to sections
- [ ] Progress bar works at top
- [ ] Text is beautifully formatted
- [ ] No markdown syntax visible

---

## 💡 Pro Tip: Updated ChatGPT Prompt

Add this to your ChatGPT prompts:

```
IMPORTANT: I will be pasting this into a rich text editor
that does NOT auto-convert markdown. Generate content with
clear section markers that I can format manually:

- Start section titles with [H2:
- Start subsection titles with [H3:
- Mark important text as [BOLD:
- Mark lists with [LIST:

Example:
[H2: Step 1: Verify Your Eligibility

Before spending $760, [BOLD: confirm you meet requirements].

[LIST:
• At least 18 years old
• Permanent resident for 5 years
```

Then in Studio:
- See `[H2:` → Format as Heading 2
- See `[BOLD:` → Select text and make bold
- See `[LIST:` → Select lines and make list

---

## 🚀 Action Plan

**RIGHT NOW:**

1. Go to http://localhost:3000/studio
2. Delete the broken "Complete N-400 Process Guide" post
3. Create a NEW post
4. Copy sections ONE AT A TIME from the markdown file
5. Format EACH SECTION as you paste it
6. Use the toolbar buttons
7. Check "Long-Form Interactive Article" ✅
8. Publish

**TOTAL TIME: 10 minutes**

**RESULT: Perfect article with working TOC!**

---

## 📝 Summary

| ❌ What NOT to Do | ✅ What TO Do |
|-------------------|---------------|
| Paste entire markdown article | Paste + format section by section |
| Expect markdown to auto-convert | Use toolbar to format manually |
| Leave `##` and `**` in text | Convert to proper headings/bold |
| Ignore the toolbar | Use dropdown for headings, **B** for bold |

**Sanity is a rich text editor, not a markdown converter. Use it like Word/Google Docs!**
