// OAuth handler for Decap CMS + GitHub authentication
// This endpoint exchanges GitHub OAuth code for access token

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // Check for required environment variables
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(
      JSON.stringify({
        error: 'Missing GitHub OAuth credentials',
        message: 'GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be set in environment variables'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  if (!code) {
    return new Response(
      JSON.stringify({ error: 'No code provided' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Exchange code for access token with GitHub
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });

    const data = await tokenResponse.json();

    if (data.error) {
      return new Response(
        JSON.stringify({
          error: 'GitHub OAuth error',
          message: data.error_description || data.error
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Return the token in the format Decap CMS expects
    // This response needs to be an HTML page that sends a message to the opener window
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authorizing...</title>
  <script>
    (function() {
      function receiveMessage(e) {
        console.log("receiveMessage %o", e);
        // send message to main window with the token
        window.opener.postMessage(
          'authorization:github:success:${JSON.stringify({ token: data.access_token, provider: 'github' })}',
          e.origin
        );
      }
      window.addEventListener("message", receiveMessage, false);
      // Start the OAuth flow
      window.opener.postMessage("authorizing:github", "*");
    })();
  </script>
</head>
<body>
  <p>Authorizing... You can close this window.</p>
</body>
</html>
`;

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to exchange code for token',
        message: error.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
