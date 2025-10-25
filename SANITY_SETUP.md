# Sanity CMS Setup Guide

This guide will walk you through setting up Sanity CMS for your CivicsPass blog. Total setup time: ~5-10 minutes.

---

## Step 1: Create a Sanity Account & Project (3 minutes)

1. **Go to Sanity.io**: Visit https://www.sanity.io/
2. **Sign up**: Click "Get started" and sign up with:
   - GitHub (recommended - easiest)
   - Google
   - Or email
3. **Create a new project**:
   - Click "Create new project"
   - Project name: `CivicsPass Blog` (or any name you prefer)
   - Use schema: Choose "Clean project with no predefined schemas"
   - Dataset: `production` (default)
   - Click "Create project"

4. **Copy your Project ID**:
   - After creation, you'll see your Project ID (looks like: `abc123xy`)
   - Copy this ID - you'll need it in Step 3

---

## Step 2: Update Environment Variables (1 minute)

1. Open your `.env.local` file in the project root
2. Replace `your-project-id` with the Project ID you copied:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xy
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
3. Save the file

---

## Step 3: Deploy Your Sanity Studio (2 minutes)

Run these commands in your terminal:

```bash
# Start development server
npm run dev
```

Wait for the server to start, then:

1. **Visit the Studio**: Open http://localhost:3000/studio in your browser
2. **Authorize the Studio**:
   - Click "Continue" to authorize your project
   - Sign in with the same account you used to create the Sanity project
   - Grant the Studio access to your project
3. **You're in!** You should now see the Sanity Studio interface

---

## Step 4: Create Your First Blog Post (2 minutes)

In the Sanity Studio (http://localhost:3000/studio):

1. Click **"Blog Post"** in the left sidebar
2. Click the **"+"** button to create a new post
3. Fill in the fields:
   - **Title**: "Welcome to CivicsPass Blog"
   - **Slug**: Click "Generate" (creates URL-friendly version)
   - **Excerpt**: "Learn about the US citizenship test and immigration process."
   - **Category**: Choose one (e.g., "Getting Started")
   - **Published Date**: Click to set today's date
   - **Read Time**: "3 min read"
   - **Meta Description**: "Welcome to the CivicsPass blog - your guide to the US citizenship test."
   - **Body**: Write some test content (try adding headings, lists, bold text)
4. Click **"Publish"** (top right)

---

## Step 5: View Your Blog (30 seconds)

1. Visit http://localhost:3000/blog
2. You should see your new blog post!
3. Click on it to view the full article

---

## How It Works

```
Your Blog Posts
    ↓ (stored in)
Sanity Cloud (Free Tier)
    ↓ (fetched by)
Next.js App (Vercel)
    ↓ (displayed at)
civicspass.com/blog
```

**Key Features:**
- ✅ Visual content editor (Sanity Studio)
- ✅ Rich text formatting (headings, lists, bold, links)
- ✅ Image uploads with cropping
- ✅ SEO-friendly (meta descriptions, slugs)
- ✅ Categories and filtering
- ✅ Real-time preview
- ✅ Version history
- ✅ Free tier: 100,000 API requests/month, 10GB bandwidth

---

## Deploying to Vercel

When you push to GitHub, Vercel will automatically:
1. Build your site with the Sanity integration
2. Fetch all published blog posts
3. Generate static pages for each post
4. Revalidate every 60 seconds for new content

**To add environment variables to Vercel:**
1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = [your project ID]
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
5. Redeploy your site

---

## Installing the Vercel + Sanity Integration (Optional but Recommended)

This enables advanced features like:
- **Edit Mode**: Click to edit content directly from your live site
- **Draft Mode**: Preview unpublished content
- **Vercel Toolbar Integration**: Visual editing indicators

**To install:**
1. Go to: https://vercel.com/integrations/sanity
2. Click "Add Integration"
3. Select your Vercel project
4. Select your Sanity project
5. Authorize the connection

The integration will automatically:
- Sync environment variables
- Enable visual editing features
- Set up webhook deployments (auto-deploy when you publish content)

---

## Accessing the Studio After Deploy

**Local development:**
- http://localhost:3000/studio

**Production (after deploying to Vercel):**
- https://civicspass.com/studio

You can edit content from anywhere! Just visit `/studio` on your live site.

---

## Sanity Free Tier Limits

The free tier includes:
- **3 users** (admin seats)
- **100,000 API requests/month** (plenty for your traffic)
- **10GB bandwidth/month**
- **Unlimited documents** (blog posts)
- **5GB asset storage** (images)

For CivicsPass, this is more than sufficient. You'd need thousands of daily visitors to exceed these limits.

---

## Managing Content

### Creating New Posts
1. Go to `/studio`
2. Click "Blog Post" → "+"
3. Fill in fields
4. Click "Publish"

### Editing Posts
1. Go to `/studio`
2. Click on the post to edit
3. Make changes
4. Click "Publish" to save

### Deleting Posts
1. Go to `/studio`
2. Click on the post
3. Click the "..." menu (top right)
4. Select "Delete"
5. Confirm

### Adding Images
1. In the post editor, scroll to "Featured Image" or add images in the "Body"
2. Click "Upload" or drag & drop
3. Crop if needed
4. Add alt text (important for SEO and accessibility)

---

## Troubleshooting

### "Failed to fetch" error in Studio
- Check that your `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct in `.env.local`
- Restart your dev server: `npm run dev`
- Clear browser cache or try incognito mode

### Studio not loading at /studio
- Verify the file exists: `app/studio/[[...tool]]/page.jsx`
- Check console for errors
- Ensure Sanity packages are installed: `npm install`

### Blog posts not showing
- Verify you published the post (not just saved as draft)
- Check the blog page is fetching correctly
- Look for errors in the browser console

### Build errors
- Make sure all Sanity packages are installed
- Check that `sanity.config.js` and `lib/sanity.js` exist
- Verify environment variables are set

---

## Next Steps

1. **Write more blog posts** - Build your content library
2. **Install the Vercel integration** - Enable visual editing
3. **Customize the schema** - Add new fields if needed (e.g., tags, author profiles)
4. **Set up webhooks** - Auto-deploy when you publish (included in Vercel integration)
5. **Add SEO improvements** - Use the meta description and featured images

---

## Resources

- **Sanity Documentation**: https://www.sanity.io/docs
- **Sanity Management**: https://www.sanity.io/manage
- **Vercel + Sanity Integration**: https://vercel.com/integrations/sanity
- **Portable Text Guide**: https://www.sanity.io/docs/presenting-block-text

---

## That's It!

You now have a professional, headless CMS with:
- ✅ Visual content editor
- ✅ No Netlify dependency
- ✅ Full Vercel integration
- ✅ Scalable architecture
- ✅ Free tier for your needs

Happy blogging! 🎉
