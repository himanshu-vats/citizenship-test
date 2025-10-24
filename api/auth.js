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

              // Helper to log to both popup and parent console
              function log(message, data) {
                console.log(message, data || "");
                if (window.opener) {
                  window.opener.postMessage({
                    type: "OAUTH_DEBUG_LOG",
                    message: message,
                    data: data
                  }, "*");
                }
              }

              // Function to send auth data back to CMS
              function sendAuthData() {
                log("[Popup] Preparing to send token to parent");
                log("[Popup] Token received:", token.substring(0, 20) + "...");

                if (window.opener) {
                  // The exact format Decap CMS expects (string format)
                  const message = "authorization:" + provider + ":success:" + JSON.stringify({
                    token: token,
                    provider: provider
                  });

                  log("[Popup] Sending auth message");
                  log("[Popup] Message format:", message.substring(0, 50) + "...");
                  log("[Popup] Using wildcard origin for compatibility");

                  // Use wildcard "*" to send to any origin (CMS handles validation)
                  window.opener.postMessage(message, "*");

                  log("[Popup] ✅ Message sent successfully!");
                  log("[Popup] Window will close in 5 seconds...");

                  // Close popup after longer delay so logs are visible
                  setTimeout(function() {
                    log("[Popup] Closing window now");
                    window.close();
                  }, 5000);
                } else {
                  log("[Popup] ❌ ERROR: No window.opener found!");
                }
              }

              log("[Popup] 🚀 Page loaded");
              log("[Popup] Provider:", provider);

              // Notify parent that we're ready
              if (window.opener) {
                log("[Popup] Notifying parent window we're authorizing");
                window.opener.postMessage("authorizing:" + provider, "*");
              }

              // Listen for handshake from Decap CMS, then send auth
              window.addEventListener("message", function(event) {
                log("[Popup] Received message from parent:", typeof event.data === 'string' ? event.data.substring(0, 50) : event.data);

                // Any message from parent triggers auth send
                sendAuthData();
              });

              // Also send after delay (in case CMS doesn't send handshake)
              setTimeout(function() {
                log("[Popup] ⏰ Timeout reached, sending auth");
                sendAuthData();
              }, 1000);
            })();
          </script>
          <h2>✓ Authorization Successful!</h2>
          <p>This window will close automatically in 5 seconds.</p>
          <p><strong>Check the main window's console for debug logs.</strong></p>
          <p>If the window doesn't close, you can close it manually.</p>
          <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Close Now</button>
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
