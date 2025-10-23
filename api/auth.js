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
    const redirectUri = `https://${req.headers.host}/api/auth`;
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

    // Return the access token
    // Redirect back to the CMS with the token
    const { access_token, token_type } = tokenData;

    // Send back HTML that communicates with the Decap CMS window
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorization Success</title>
        </head>
        <body>
          <script>
            (function() {
              const token = "${access_token}";
              const provider = "github";

              function sendMessage() {
                const message = "authorization:github:success:" + JSON.stringify({
                  token: token,
                  provider: provider
                });

                console.log("Sending message to parent:", message);

                // Send to opener (parent window)
                if (window.opener) {
                  window.opener.postMessage(message, "*");
                  console.log("Message sent to opener");

                  // Close this window after a short delay
                  setTimeout(function() {
                    window.close();
                  }, 1000);
                } else {
                  console.error("No window.opener found");
                }
              }

              // Send message immediately
              sendMessage();

              // Also listen for messages from parent (Decap CMS handshake)
              window.addEventListener("message", function(e) {
                console.log("Received message from parent:", e.data);
                if (e.data === "authorizing:github") {
                  sendMessage();
                }
              }, false);

              // Notify parent we're ready
              if (window.opener) {
                window.opener.postMessage("authorizing:github", "*");
              }
            })();
          </script>
          <p>Authorization successful! This window should close automatically.</p>
          <p>If it doesn't close, you can close it manually.</p>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ error: 'OAuth exchange failed', details: error.message });
  }
}
