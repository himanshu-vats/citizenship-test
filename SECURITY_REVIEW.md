# Security Review - CivicsPass.com
**Date:** October 24, 2025
**Reviewer:** Security Analysis
**App Type:** Static Next.js web application with minimal backend

---

## Executive Summary

Your app has a **LOW to MEDIUM** risk profile. It's a relatively secure static site with minimal attack surface. However, since you've posted on Reddit, you should expect increased traffic and potential malicious actors. Below is a comprehensive security assessment with actionable recommendations.

---

## ✅ What's Secure (Good News)

### 1. **No Authentication System**
- ✅ No user accounts = No password breaches
- ✅ No session hijacking risk
- ✅ No authentication bypass vulnerabilities

### 2. **Client-Side Data Storage Only**
- ✅ All data stored in localStorage (client-side)
- ✅ No database = No SQL injection
- ✅ No backend data leaks
- ✅ User privacy protected (data never leaves their device)

### 3. **Dependencies**
- ✅ Zero known vulnerabilities (ran `npm audit`)
- ✅ Using latest Next.js 15.5.4
- ✅ Modern React 19

### 4. **Secrets Management**
- ✅ `.env` files properly gitignored
- ✅ No secrets committed to repository
- ✅ API keys stored in environment variables

### 5. **XSS Protection**
- ✅ React automatically escapes user input
- ✅ No `dangerouslySetInnerHTML` usage
- ✅ No dynamic script injection

---

## ⚠️ Potential Vulnerabilities & Risks

### 1. **API Rate Limiting (MEDIUM RISK)**

**Issue:** Your `/api/representatives` endpoint has NO rate limiting.

**Attack Scenario:**
```bash
# Attacker could spam your API
for i in {1..10000}; do
  curl "https://civicspass.com/api/representatives?zipCode=10001"
done
```

**Impact:**
- Exhaust Google Civic API quota (if you have one)
- Increase Vercel function invocations (costs)
- DDoS your app
- Exhaust zippopotam.us API quota

**Current Code (Vulnerable):**
```javascript
// app/api/representatives/route.js - NO RATE LIMITING
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const zipCode = searchParams.get('zipCode');
  // ... rest of code
}
```

**Recommendation:** Add rate limiting middleware

---

### 2. **Missing Security Headers (MEDIUM RISK)**

**Issue:** No security headers configured in `next.config.mjs`.

**Missing Headers:**
- `X-Frame-Options` - Prevents clickjacking
- `X-Content-Type-Options` - Prevents MIME sniffing
- `Referrer-Policy` - Controls referrer information
- `Permissions-Policy` - Restricts browser features
- `Content-Security-Policy` - Prevents XSS attacks

**Current Config:**
```javascript
// Only has MIME type headers for CMS
async headers() {
  return [
    {
      source: '/config.yml',
      headers: [{ key: 'Content-Type', value: 'text/yaml' }],
    },
  ];
}
```

**Recommendation:** Add comprehensive security headers

---

### 3. **Input Validation (LOW RISK)**

**Issue:** ZIP code validation is minimal.

**Current Code:**
```javascript
const zipCode = searchParams.get('zipCode');
if (!zipCode) {
  return NextResponse.json({ error: 'ZIP code is required' }, { status: 400 });
}
// NO validation for format, length, or malicious input
```

**Attack Scenarios:**
- SQL injection attempts (though not applicable here)
- Path traversal attempts: `../../etc/passwd`
- Script injection: `<script>alert(1)</script>`
- Extremely long strings to cause memory issues

**Recommendation:** Add proper ZIP code validation

---

### 4. **Third-Party API Dependencies (LOW RISK)**

**Issue:** You rely on external APIs without fallback:
- `zippopotam.us` - Could go down or change API
- `googleapis.com` - Could rate limit or block you

**Impact:**
- If zippopotam.us goes down, representative lookup breaks
- No caching of API responses = repeated external calls

**Recommendation:** Implement caching and better error handling

---

### 5. **CORS Not Configured (LOW RISK)**

**Issue:** No CORS policy means any website can call your API.

**Attack Scenario:**
```javascript
// Attacker's website at evil.com
fetch('https://civicspass.com/api/representatives?zipCode=10001')
  .then(r => r.json())
  .then(data => {
    // Steal data or abuse your API
    sendToMyServer(data);
  });
```

**Recommendation:** Restrict API access to your own domain

---

### 6. **No Error Rate Monitoring (INFO)**

**Issue:** No way to detect if someone is attacking your app.

**What you're missing:**
- Error tracking (Sentry, LogRocket)
- Performance monitoring
- API abuse detection
- Traffic analytics

**Recommendation:** Add basic monitoring

---

## 🎯 Attack Vectors (What Hackers Might Try)

### 1. **API Abuse / DDoS**
**Likelihood:** HIGH (especially after Reddit post)
**Impact:** Medium (increased costs, downtime)

Attackers will:
- Spam your API endpoint
- Try to exhaust your Vercel function quotas
- Burn through Google API quota

### 2. **Scraping User Data**
**Likelihood:** LOW
**Impact:** None (no user data to scrape)

Your app stores everything client-side, so there's nothing to scrape from your backend.

### 3. **Cross-Site Scripting (XSS)**
**Likelihood:** LOW
**Impact:** Low (React prevents most XSS)

React automatically escapes content, but always be cautious with:
- URL parameters
- User-generated content
- Third-party API responses

### 4. **Clickjacking**
**Likelihood:** LOW
**Impact:** Low

Without `X-Frame-Options`, someone could embed your site in an iframe and trick users.

### 5. **Supply Chain Attack**
**Likelihood:** VERY LOW
**Impact:** High

If npm packages get compromised, your app could be affected. This is rare but happens.

---

## 🛡️ Immediate Security Recommendations

### Priority 1: CRITICAL (Do Before Traffic Spikes)

#### 1.1 Add Rate Limiting
Install Vercel Edge Middleware rate limiting:

```bash
npm install @upstash/ratelimit @upstash/redis
```

Create `middleware.js`:
```javascript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
});

export async function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip ?? '127.0.0.1';
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return new Response('Too Many Requests', { status: 429 });
    }
  }
}
```

**Alternative (Simpler):** Use Vercel's built-in firewall (paid plan)

#### 1.2 Add Security Headers

Update `next.config.mjs`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.zippopotam.us https://www.googleapis.com;",
          },
        ],
      },
      {
        source: '/config.yml',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/yaml; charset=utf-8',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

#### 1.3 Add ZIP Code Validation

Update `app/api/representatives/route.js`:
```javascript
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const zipCode = searchParams.get('zipCode');

  // Validate ZIP code format
  if (!zipCode) {
    return NextResponse.json({ error: 'ZIP code is required' }, { status: 400 });
  }

  // US ZIP codes are 5 or 9 digits (with optional hyphen)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(zipCode)) {
    return NextResponse.json({ error: 'Invalid ZIP code format' }, { status: 400 });
  }

  // Sanitize - only allow digits and hyphen
  const sanitizedZip = zipCode.replace(/[^\d-]/g, '');

  try {
    // Use sanitizedZip instead of zipCode
    const zipResponse = await fetch(
      `https://api.zippopotam.us/us/${sanitizedZip}`
    );
    // ... rest of code
  }
}
```

---

### Priority 2: RECOMMENDED (Within 1 Week)

#### 2.1 Add Basic Monitoring
Sign up for free tier of:
- **Vercel Analytics** (built-in, just enable it)
- **Sentry** (error tracking) - Free for small projects
- **Google Analytics** or **Plausible** (privacy-friendly analytics)

#### 2.2 Add API Response Caching
Cache representative data to reduce external API calls:

```javascript
// Simple in-memory cache (resets on deployment)
const cache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(request) {
  const zipCode = searchParams.get('zipCode');

  // Check cache first
  const cached = cache.get(zipCode);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  // Fetch fresh data
  const data = await fetchRepresentativeData(zipCode);

  // Store in cache
  cache.set(zipCode, {
    data,
    timestamp: Date.now()
  });

  return NextResponse.json(data);
}
```

#### 2.3 Add CORS Headers
Restrict API to your own domain:

```javascript
// In next.config.mjs headers
{
  source: '/api/:path*',
  headers: [
    {
      key: 'Access-Control-Allow-Origin',
      value: 'https://civicspass.com', // Your domain only
    },
  ],
}
```

---

### Priority 3: NICE TO HAVE (Future)

#### 3.1 Add Content Security Policy (CSP) Reporting
Get notified when CSP violations occur:
```javascript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; report-uri https://your-csp-report-endpoint.com;",
}
```

#### 3.2 Implement Subresource Integrity (SRI)
If you load any external scripts:
```html
<script src="https://example.com/script.js"
        integrity="sha384-..."
        crossorigin="anonymous"></script>
```

#### 3.3 Add Honeypot for Bot Detection
Create fake hidden fields to catch bots:
```javascript
// Add hidden field in forms
<input type="text" name="website" style="display:none" tabindex="-1" />

// On backend, reject if filled
if (formData.website) {
  return new Response('Bot detected', { status: 400 });
}
```

---

## 📊 Risk Assessment Matrix

| Vulnerability | Likelihood | Impact | Priority | Effort to Fix |
|--------------|------------|--------|----------|---------------|
| API Rate Limiting | HIGH | MEDIUM | **CRITICAL** | Medium |
| Missing Security Headers | MEDIUM | MEDIUM | **CRITICAL** | Low |
| Input Validation | MEDIUM | LOW | HIGH | Low |
| No Monitoring | HIGH | MEDIUM | MEDIUM | Medium |
| CORS Not Set | LOW | LOW | MEDIUM | Low |
| API Caching | MEDIUM | LOW | LOW | Medium |

---

## 🚨 What to Watch For After Reddit Post

### Immediate (First 24 Hours)
1. **Traffic spike** - Monitor Vercel dashboard
2. **API abuse** - Watch for repeated calls from same IPs
3. **Error rates** - Check for unusual 500 errors
4. **Cost increases** - Monitor Vercel function invocations

### Signs of Attack
- Sudden spike in API calls (>1000/minute)
- Many 400/500 errors in logs
- Vercel quota warnings
- Slow response times
- Strange ZIP codes in logs (like `../../`, `<script>`, etc.)

### How to Respond to Attack
1. **Enable Vercel Firewall** (if on paid plan)
2. **Add IP blocking** in Vercel settings
3. **Temporarily disable API** if getting hammered
4. **Contact Vercel support** for DDoS protection

---

## 💰 Cost Implications

### Current Setup (Free Tier)
- ✅ Vercel: 100GB bandwidth/month free
- ✅ Vercel Functions: 100,000 invocations/month free
- ⚠️ Google Civic API: 25,000 requests/day free (then $0.50/1000)
- ⚠️ zippopotam.us: Unknown limits (could go down)

### If You Get Popular
Reddit post could bring **1,000-10,000 visitors/day**

**Estimated Costs:**
- If 10% use representative lookup: 1,000 API calls/day
- Should stay within free tier
- **BUT** if someone attacks: could burn through quota in hours

**Recommendation:** Set up billing alerts in Google Cloud Console

---

## 🎓 General Security Best Practices

### Do's
✅ Keep dependencies updated (`npm audit fix`)
✅ Monitor error logs regularly
✅ Use environment variables for secrets
✅ Enable Vercel Web Analytics (it's free)
✅ Test with malicious inputs manually
✅ Keep backups of your code (Git)

### Don'ts
❌ Don't commit API keys to Git
❌ Don't ignore npm security warnings
❌ Don't disable security features for "convenience"
❌ Don't expose admin panels publicly
❌ Don't trust user input (always validate)

---

## 📝 Security Checklist

Copy this checklist and track your progress:

- [ ] Add rate limiting to API endpoints
- [ ] Configure security headers in next.config.mjs
- [ ] Add ZIP code input validation
- [ ] Enable Vercel Analytics
- [ ] Set up error monitoring (Sentry)
- [ ] Add API response caching
- [ ] Configure CORS headers
- [ ] Set up billing alerts
- [ ] Create incident response plan
- [ ] Document security policies
- [ ] Regular dependency updates (monthly)
- [ ] Review access logs (weekly)

---

## 🔮 Long-Term Security Strategy

### Month 1-3
1. Implement all Priority 1 recommendations
2. Set up monitoring and alerts
3. Monitor for abuse patterns
4. Build incident response process

### Month 3-6
1. Add automated security testing
2. Implement API caching
3. Consider moving to paid Vercel plan for better DDoS protection
4. Add comprehensive logging

### Month 6+
1. Security audit by professional (if app grows)
2. Penetration testing
3. Bug bounty program (if popular)
4. SOC 2 compliance (if handling sensitive data)

---

## 📞 Resources

### Security Tools (Free Tier Available)
- **Snyk** - Dependency scanning
- **Sentry** - Error tracking
- **Cloudflare** - DDoS protection (can put in front of Vercel)
- **OWASP ZAP** - Security testing
- **SecurityHeaders.com** - Test your headers

### Learning Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Vercel Security](https://vercel.com/docs/security)

---

## ✅ Final Verdict

**Your app is reasonably secure for a simple static site**, but needs some hardening before handling significant traffic from Reddit.

**Biggest Risks:**
1. API abuse (no rate limiting)
2. Missing security headers
3. No monitoring/alerting

**Estimated Time to Secure:**
- Priority 1 fixes: **2-4 hours**
- Priority 2 fixes: **4-6 hours**
- Total: **1 day of work**

**Recommendation:** Implement Priority 1 fixes ASAP, especially before your Reddit post gets traction.

---

## 🤝 Need Help?

If you see suspicious activity or need help implementing these fixes, feel free to ask. Security is an ongoing process, not a one-time fix.

Good luck with your Reddit post! 🚀
