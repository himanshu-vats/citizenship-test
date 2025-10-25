# Fix Sanity CORS Error (2 minutes)

## The Issue
Sanity needs to whitelist your domain before the Studio can connect to your project.

## Quick Fix

### Option 1: Use Sanity CLI (Fastest)
```bash
npx sanity cors add http://localhost:3000 --credentials
```

This will automatically add localhost to your allowed origins.

### Option 2: Manual Setup via Dashboard (2 minutes)

1. **Go to Sanity Management Console**
   - Visit: https://www.sanity.io/manage
   - Or: https://www.sanity.io/manage/personal/project/kwvvqphx

2. **Navigate to API settings**
   - Click on your "CivicsPass Blog" project
   - Click "API" in the left sidebar

3. **Add CORS Origins**
   - Scroll to "CORS Origins" section
   - Click "+ Add CORS origin"
   - Add these origins:

   ```
   http://localhost:3000
   ```
   - Check "Allow credentials" ✅
   - Click "Save"

4. **For production (add after deploying to Vercel):**
   ```
   https://civicspass.com
   https://www.civicspass.com
   https://*.vercel.app
   ```

5. **Refresh your browser**
   - Go back to http://localhost:3000/studio
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Studio should now load!

---

## Alternative: Use Sanity CLI Command

If you prefer the command line:

```bash
# Add localhost
npx sanity cors add http://localhost:3000 --credentials

# Add production domain (do this after deploying)
npx sanity cors add https://civicspass.com --credentials
npx sanity cors add https://www.civicspass.com --credentials
```

---

## Verification

After adding the CORS origin:
1. Refresh http://localhost:3000/studio
2. You should see the Sanity Studio login screen
3. Sign in with your Sanity account
4. Create your first blog post!

---

## Common Issues

### "Still getting CORS error"
- Make sure you added `http://localhost:3000` (not `https://`)
- Clear browser cache and try incognito mode
- Wait 30 seconds for changes to propagate

### "Studio loads but can't save"
- Make sure "Allow credentials" is checked
- Verify you're signed in to the correct Sanity account

### "Wrong project ID"
- Double-check your Project ID in `.env.local` matches the one in Sanity dashboard
