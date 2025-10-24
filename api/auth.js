// GitHub OAuth Handler for Decap CMS
// Vercel Serverless Function

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.status(500).json({
      error: 'Missing GitHub OAuth credentials. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to Vercel environment variables.'
    });
  }

  const { code, provider, scope } = req.query;

  // Step 1: Initial OAuth request - Redirect to GitHub
  if (!code && provider === 'github') {
    // Use the exact base URL from the config (without www to match)
    const redirectUri = `https://civicspass.com/api/auth`;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope || 'repo,user'}`;

    return res.redirect(302, githubAuthUrl);
  }

  // Step 2: OAuth callback - Exchange code for token
  if (!code) {
    return res.status(400).json({ error: 'No code or provider provided' });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description });
    }

    const { access_token, token_type } = tokenData;

    // Store token in secure cookie and redirect back to admin
    // This avoids complex postMessage protocol
    res.setHeader('Set-Cookie', `github_token=${access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`);
    res.setHeader('Location', '/admin?auth=success');
    return res.status(302).end();
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ error: 'OAuth exchange failed', details: error.message });
  }
}
