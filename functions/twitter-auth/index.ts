import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const TWITTER_CLIENT_ID = Deno.env.get('TWITTER_CLIENT_ID')!;
const TWITTER_CLIENT_SECRET = Deno.env.get('TWITTER_CLIENT_SECRET')!;
const REDIRECT_URI = `https://gbt3m7jr--twitter-auth.functions.blink.new/callback`;

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const url = new URL(req.url);
  const path = url.pathname;

  try {
    if (path === '/start') {
      // Generate OAuth 2.0 authorization URL
      const state = crypto.randomUUID();
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      
      const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('client_id', TWITTER_CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
      authUrl.searchParams.set('scope', 'tweet.read users.read offline.access');
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('code_challenge', codeChallenge);
      authUrl.searchParams.set('code_challenge_method', 'S256');

      // Store code verifier temporarily (in production, use a proper cache/database)
      globalThis.codeVerifiers = globalThis.codeVerifiers || new Map();
      globalThis.codeVerifiers.set(state, codeVerifier);

      return new Response(JSON.stringify({ 
        auth_url: authUrl.toString(),
        state,
        code_challenge: codeChallenge
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (path === '/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      
      if (!code || !state) {
        return new Response('Authorization code or state not found', { status: 400 });
      }

      // Retrieve code verifier
      globalThis.codeVerifiers = globalThis.codeVerifiers || new Map();
      const codeVerifier = globalThis.codeVerifiers.get(state);
      
      if (!codeVerifier) {
        return new Response('Code verifier not found', { status: 400 });
      }

      // Clean up stored verifier
      globalThis.codeVerifiers.delete(state);

      // Exchange code for access token
      const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`)}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: codeVerifier,
        }),
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        console.error('Token exchange failed:', error);
        return new Response(`Token exchange failed: ${error}`, { status: 400 });
      }

      const tokens = await tokenResponse.json();
      
      // Get user info
      const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,verified', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      });

      if (!userResponse.ok) {
        return new Response('Failed to get user info', { status: 400 });
      }

      const userData = await userResponse.json();
      
      // Return HTML that posts message to parent window
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Twitter Authentication</title>
        </head>
        <body>
          <script>
            window.opener.postMessage({
              type: 'TWITTER_AUTH_SUCCESS',
              access_token: '${tokens.access_token}',
              refresh_token: '${tokens.refresh_token || ''}',
              user: ${JSON.stringify(userData.data)}
            }, window.location.origin);
            window.close();
          </script>
          <p>Authentication successful! This window will close automatically.</p>
        </body>
        </html>
      `;

      return new Response(html, {
        headers: {
          'Content-Type': 'text/html',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (path === '/verify') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response('Unauthorized', { status: 401 });
      }

      const token = authHeader.substring(7);
      
      // Verify token with Twitter API
      const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,verified', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        return new Response('Invalid token', { status: 401 });
      }

      const userData = await userResponse.json();
      
      return new Response(JSON.stringify(userData.data), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new Response('Not Found', { status: 404 });

  } catch (error) {
    console.error('Twitter auth error:', error);
    return new Response(`Internal Server Error: ${error.message}`, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});

// Helper functions for PKCE
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}