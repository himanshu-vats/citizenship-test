# Blog CMS Setup Guide

Your blog now has a web-based content management system using **Decap CMS**!

## 🚀 Quick Start

### Step 1: Enable Netlify Identity (One-Time Setup)

Since you're hosted on Vercel, you need to enable Netlify Identity for authentication:

1. **Go to Netlify** (create free account if needed): https://app.netlify.com/signup
2. **Import your GitHub repo**:
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub → Select `himanshu-vats/citizenship-test`
   - Deploy settings: Just click "Deploy site" (we won't use this deployment, just the Identity service)
3. **Enable Identity**:
   - Go to your Netlify site dashboard
   - Click "Identity" tab
   - Click "Enable Identity"
4. **Configure Identity**:
   - In Identity tab, click "Settings and usage"
   - Under "Registration preferences": Select **Invite only** (recommended for security)
   - Under "External providers": Enable **GitHub** authentication
   - Under "Git Gateway": Click "Enable Git Gateway"
5. **Invite yourself**:
   - Go to Identity tab → Click "Invite users"
   - Enter your email
   - Check your email and accept the invite
   - Set your password

### Step 2: Update Decap CMS Config

Once you have your Netlify site URL, update the config:

1. Open `/public/admin/config.yml`
2. Find the `backend` section and update:
   ```yaml
   backend:
     name: git-gateway
     branch: main
   ```
3. Add this at the top of `/public/admin/index.html` (inside `<head>`):
   ```html
   <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
   ```
4. Commit and push changes

### Step 3: Access Your CMS

1. **Wait 2-3 minutes** for Vercel to redeploy
2. **Visit**: `https://yoursite.com/admin`
3. **Log in** with your Netlify Identity credentials
4. **Start writing!**

---

## ✍️ How to Use the CMS

### Creating a New Article

1. Go to `yoursite.com/admin`
2. Click **"New Blog Articles"**
3. Fill in the fields:
   - **Title**: Article headline (required)
   - **Excerpt**: 1-2 sentence summary
   - **Category**: Choose from dropdown
   - **Publish Date**: Pick a date
   - **Read Time**: e.g., "5 min read"
   - **Meta Description**: SEO description (150-160 characters)
   - **Body**: Write your article in Markdown
4. Click **"Publish"** → Article goes live immediately!

### Editing an Existing Article

1. Go to `yoursite.com/admin`
2. Click on any article in the list
3. Make your changes
4. Click **"Publish"** to save

### Using Markdown

The editor supports full Markdown:

```markdown
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet point
- Another point

1. Numbered list
2. Second item

[Link text](https://example.com)

![Image alt text](/images/blog/image.jpg)
```

### Adding Images

1. Click the "+" button in the markdown editor
2. Select "Image"
3. Upload from your computer
4. Image is automatically saved to `/public/images/blog/`

---

## 🎯 Workflow Tips

### Using AI (ChatGPT/Claude) to Write Articles

1. **Generate article with AI**:
   ```
   Prompt: "Write a 500-word blog article about [topic] for US citizenship test takers.
   Include frontmatter with title, excerpt, category, date, readTime, and metaDescription.
   Format in Markdown."
   ```

2. **Copy the article**

3. **Paste into CMS**:
   - Go to `yoursite.com/admin`
   - Create new article
   - Paste the AI-generated content into the "Body" field
   - Fill in the metadata fields at the top
   - Publish!

### Categories

Choose from:
- **Getting Started** - Basics for beginners
- **Process Guide** - Step-by-step instructions
- **Study Tips** - Learning strategies
- **Civics Questions** - Question explanations
- **Immigration Updates** - News and changes
- **Success Stories** - User testimonials

### Drafts (Optional)

If you want a draft workflow:
1. Update `config.yml`: Change `publish_mode: simple` to `publish_mode: editorial_workflow`
2. This enables: **Draft → In Review → Ready** workflow
3. Only "Ready" articles appear on your site

---

## 🔧 Troubleshooting

### "Cannot access admin"
- Make sure Netlify Identity is enabled
- Check that you've accepted the invite email
- Clear browser cache and try again

### "Login fails"
- Verify Git Gateway is enabled in Netlify
- Check that your email is invited in Netlify Identity
- Try logging out and back in

### "Changes not showing on site"
- Changes commit to GitHub automatically
- Vercel takes 2-3 minutes to rebuild
- Check your Vercel dashboard for build status

### "Images not uploading"
- Make sure `/public/images/blog/` directory exists
- Check file size (keep under 2MB for performance)
- Supported formats: JPG, PNG, GIF, SVG

---

## 🎨 Advanced: Customizing the CMS

Edit `/public/admin/config.yml` to:

- Add new categories
- Change field labels
- Add custom fields (tags, author, etc.)
- Enable media library
- Configure rich text editor

See full docs: https://decapcms.org/docs/

---

## 📱 Mobile Access

The CMS works on mobile browsers! Just visit `yoursite.com/admin` on your phone.

---

## 🔐 Security Notes

- ✅ Admin is password-protected via Netlify Identity
- ✅ Only invited users can access
- ✅ All changes are tracked in Git (full audit log)
- ✅ Can revert any change via GitHub history

---

## 💡 Benefits vs. WordPress

| Feature | Decap CMS | WordPress |
|---------|-----------|-----------|
| **Cost** | Free | $25+/month |
| **Speed** | Lightning fast (static) | Slower (database) |
| **Security** | No hacks (no database) | Frequent vulnerabilities |
| **Hosting** | Free (Vercel) | $10-50/month |
| **Maintenance** | Zero | Constant updates |
| **Backups** | Automatic (Git) | Manual/plugins |

---

## 🆘 Need Help?

- Decap CMS Docs: https://decapcms.org/docs/
- Netlify Identity Docs: https://docs.netlify.com/visitor-access/identity/
- GitHub Issues: https://github.com/himanshu-vats/citizenship-test/issues

---

**That's it! You now have a professional CMS without any recurring costs.** 🎉
