# Feedback Widget Setup Guide

## Overview
A modern feedback widget has been added to every page. Users can click the floating blue button (bottom-right) to send feedback with optional screenshots.

## Features
✅ **Floating button** - Bottom-right corner on all pages
✅ **Screenshot capture** - Automatically captures current page view
✅ **Email submission** - Sends feedback to your email
✅ **User email** - Optional field for follow-up
✅ **Context data** - Includes URL, timestamp, user agent
✅ **Dark mode support** - Matches app theme

## Setup Email Service (Required for Production)

### Option 1: Resend.com (Recommended - Free tier available)

1. **Sign up at [Resend.com](https://resend.com)**
   - Free tier: 100 emails/day, 3,000/month
   - Perfect for feedback submissions

2. **Get API Key**
   - Dashboard → API Keys → Create API Key
   - Copy the key (starts with `re_`)

3. **Add to Environment Variables**
   ```bash
   # .env.local
   RESEND_API_KEY=re_your_api_key_here
   FEEDBACK_EMAIL=your@email.com
   ```

4. **Verify Domain (Optional but recommended)**
   - Dashboard → Domains → Add Domain
   - Follow DNS setup instructions
   - Update `from` field in `/app/api/feedback/route.js`:
     ```javascript
     from: 'CivicPrep Feedback <noreply@yourdomain.com>'
     ```

### Option 2: Alternative Email Services

The API route can be modified to use:
- **SendGrid** - Popular alternative
- **Mailgun** - Good for high volume
- **AWS SES** - Cost-effective for scale

### Development/Testing Without Email Service

If `RESEND_API_KEY` is not set:
- Feedback logs to console instead
- User still sees success message
- Perfect for local development

Check your terminal for:
```
=== NEW FEEDBACK ===
Feedback: [user feedback text]
Email: [user email]
URL: [page URL]
Screenshot: Included/Not included
==================
```

## Testing the Widget

1. **Start dev server**
   ```bash
   npm run dev
   ```

2. **Look for blue button** - Bottom-right corner

3. **Click to open modal** - Should auto-capture screenshot

4. **Submit feedback**
   - Required: Feedback text
   - Optional: Email address
   - Optional: Screenshot (checkbox)

5. **Check terminal** (without email service) or **inbox** (with email service)

## Customization

### Change Button Position
Edit `/components/FeedbackWidget.jsx`:
```javascript
// Current: bottom-6 right-6
className="fixed bottom-6 right-6 ..."

// Options:
// Bottom-left: bottom-6 left-6
// Top-right: top-6 right-6
```

### Change Button Color
```javascript
// Current: bg-blue-600
className="... bg-blue-600 hover:bg-blue-700 ..."

// Options:
// Purple: bg-purple-600 hover:bg-purple-700
// Green: bg-green-600 hover:bg-green-700
```

### Disable Screenshot by Default
```javascript
const [includeScreenshot, setIncludeScreenshot] = useState(false); // Change to false
```

## Email Template

The feedback email includes:
- 📬 Subject: "New Feedback: [first 50 chars]..."
- ✉️ Feedback text (formatted)
- 👤 User email (if provided)
- 🔗 Page URL (clickable link)
- 🕐 Timestamp
- 🖥️ User agent (browser/device info)
- 📸 Screenshot (if included)

## Production Checklist

- [ ] Sign up for Resend.com
- [ ] Add `RESEND_API_KEY` to Vercel environment variables
- [ ] Add `FEEDBACK_EMAIL` to Vercel environment variables
- [ ] (Optional) Verify domain for professional sender address
- [ ] Test feedback submission on production
- [ ] Check email delivery to inbox (not spam)

## Troubleshooting

### Screenshot not capturing
- Some browsers block `html2canvas` on certain elements
- User will still be able to submit without screenshot

### Email not sending
- Check `RESEND_API_KEY` is set correctly
- Check Resend dashboard for error logs
- Verify email address is valid
- Check spam folder

### Widget not appearing
- Check browser console for errors
- Ensure FeedbackWidget is imported in layout.js
- Clear browser cache

## Cost Estimate

**Resend.com Free Tier:**
- 100 emails/day
- 3,000 emails/month
- Perfect for most feedback volumes

**If you exceed free tier:**
- $20/month for 50,000 emails
- $0.40 per 1,000 additional emails

Most apps never exceed the free tier for feedback.
