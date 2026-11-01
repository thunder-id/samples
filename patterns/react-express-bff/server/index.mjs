import express from 'express';
import cookieParser from 'cookie-parser';
import {thunderID, handleBackchannelLogout} from '@thunderid/express';
import {createProxy, createPublicProxy} from './lib/proxy.mjs';

const port = Number(process.env.PORT) || 3001;
const baseUrl = process.env.THUNDERID_BASE_URL || 'https://localhost:8090';
// The origin the browser opens the app on. The BFF is reached on the same origin, under /api/auth,
// so its session cookie is first party. In development the React dev server forwards /api/auth here.
const appUrl = (process.env.APP_URL || 'http://localhost:5173').replace(/\/+$/, '');
// The API the proxy fronts. The browser never learns this address or the token sent to it.
const apiBaseUrl = (process.env.API_BASE_URL || baseUrl).replace(/\/+$/, '');

const REQUIRED_ENV_VARS = ['THUNDERID_CLIENT_ID', 'THUNDERID_CLIENT_SECRET'];
const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

const RETURN_TO_COOKIE = 'thunderid_bff_return_to';
const secureCookies = appUrl.startsWith('https:');

const app = express();
app.disable('x-powered-by');
app.use(cookieParser());

app.get('/', (_req, res) => {
  res.json({
    message: `This is the ThunderID BFF. Open the app at ${appUrl}, which reaches this server under /api/auth.`,
  });
});

const auth = express.Router();
app.use('/api/auth', auth);

// Session responses carry user data and tokens, so nothing here may be cached.
auth.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

if (missingEnvVars.length > 0) {
  auth.use((_req, res) => {
    res.status(503).json({
      error: 'not_configured',
      message: 'Copy .env.example to .env, fill in the values from your ThunderID application, then restart the BFF.',
      missing: missingEnvVars,
    });
  });
} else {
  auth.use(
    thunderID({
      baseUrl,
      clientId: process.env.THUNDERID_CLIENT_ID,
      clientSecret: process.env.THUNDERID_CLIENT_SECRET,
      // The redirect URI sent to ThunderID. It is on the app's origin so that the session cookie set
      // by the callback belongs to the app, and must be registered for the application as it is.
      afterSignInUrl: `${appUrl}/api/auth/callback`,
      // The post-logout redirect URI, also registered for the application.
      afterSignOutUrl: appUrl,
      sessionCookie: {httpOnly: true, sameSite: 'lax', secure: secureCookies},
      onBackchannelLogout: ({sessionsEnded, sid}) => {
        console.log(`Back-channel logout for ThunderID session ${sid ?? '(by subject)'}: ended ${sessionsEnded} local session(s).`);
      },
    }),
  );
}

/** The BFF session ID from the request's cookie, which keys the tokens the SDK stores. */
const sessionIdOf = (req) => req.cookies?.[req.thunderIDAuth.getSessionCookieName()];

/**
 * Returns the request's session ID when the session is signed in, or answers `401 login_required`.
 * The SDK refreshes an expired access token here with the refresh token, so the browser never has
 * to. When the refresh fails, the session is gone and the browser has to sign in again.
 */
async function requireSession(req, res) {
  const sessionId = sessionIdOf(req);
  if (sessionId && (await req.thunderIDAuth.isSignedIn(sessionId))) {
    return sessionId;
  }
  res.status(401).json({error: 'login_required'});
  return undefined;
}

/** Only a path on the app itself is a valid place to return to after sign-in. */
function safeReturnTo(value) {
  return typeof value === 'string' && /^\/(?![/\\])/.test(value) ? value : '/';
}

/**
 * Claims that only matter for validating the ID token, left out of the session's `user`. The time
 * claims `auth_time`, `iat`, and `exp` stay, since the React SDK's `getDecodedIdToken()` returns
 * `user` in BFF mode and apps read them to show when the user signed in.
 */
const PROTOCOL_CLAIMS = ['acr', 'amr', 'at_hash', 'aud', 'azp', 'c_hash', 'iss', 'jti', 'nbf', 'nonce', 'sid'];

// ── Endpoints the browser navigates to ──────────────────────────────────

// Starts sign-in. The browser SDK navigates here with the path to come back to.
auth.get('/signin', async (req, res) => {
  res.cookie(RETURN_TO_COOKIE, safeReturnTo(req.query.returnTo), {
    httpOnly: true,
    maxAge: 10 * 60 * 1000,
    path: '/api/auth',
    sameSite: 'lax',
    secure: secureCookies,
  });

  try {
    // Redirects to ThunderID with an authorization code request and PKCE. A session that is already
    // signed in comes straight back with its tokens instead.
    const tokens = await req.thunderIDAuth.signIn(req, res);
    if (tokens.accessToken && !res.headersSent) {
      res.redirect(`${appUrl}${safeReturnTo(req.query.returnTo)}`);
    }
  } catch (error) {
    console.error('Could not start sign-in.', error);
    res.status(500).json({error: 'signin_failed'});
  }
});

// ThunderID redirects here with the authorization code. The tokens stay in the BFF, and the browser
// gets only the HttpOnly session cookie.
auth.get('/callback', async (req, res) => {
  const returnTo = safeReturnTo(req.cookies?.[RETURN_TO_COOKIE]);
  res.clearCookie(RETURN_TO_COOKIE, {path: '/api/auth'});

  if (req.query.error) {
    console.warn(`Sign-in failed at ThunderID: ${req.query.error}`);
    res.redirect(appUrl);
    return;
  }

  try {
    await req.thunderIDAuth.signIn(req, res);
    res.redirect(`${appUrl}${returnTo}`);
  } catch (error) {
    console.error('Could not complete sign-in.', error);
    res.status(500).json({error: 'signin_failed'});
  }
});

// ThunderID posts a logout token here, server to server, when the user's ThunderID session ends
// anywhere else: a sign-out from another application, an administrator ending the session, or the
// user being deleted. The SDK validates the token and deletes the BFF session it names. The browser
// finds out on its next check of /checksession or its next proxied call, and the React SDK signs
// the app out. Register `<BFF origin>/api/auth/backchannel-logout` as the Back-Channel Logout URI.
auth.post('/backchannel-logout', handleBackchannelLogout());

// Public, read-only API calls the browser SDK makes before sign-in, such as `/flow/meta`.
auth.use('/proxy', createPublicProxy({apiBaseUrl}));

// ── Endpoints the browser SDK calls ─────────────────────────────────────

// Every call from here on must carry `X-Requested-With`. A page on another origin cannot add the
// header without a CORS preflight, which this server never answers, so the session cookie cannot
// be used by a cross-site request.
auth.use((req, res, next) => {
  if (req.get('X-Requested-With') !== 'XMLHttpRequest') {
    res.status(403).json({error: 'forbidden', message: 'Missing the X-Requested-With: XMLHttpRequest header.'});
    return;
  }
  next();
});

// The signed-in user, when the access token expires, and the scopes it was granted.
auth.get('/session', async (req, res) => {
  const client = req.thunderIDAuth;
  const sessionId = sessionIdOf(req);

  if (!sessionId || !(await client.isSignedIn(sessionId))) {
    res.json({isSignedIn: false});
    return;
  }

  const claims = await client.getDecodedIdToken(sessionId);
  const session = await client.getStorageManager().getSessionData(sessionId);
  const user = Object.fromEntries(Object.entries(claims).filter(([claim]) => !PROTOCOL_CLAIMS.includes(claim)));

  res.json({
    isSignedIn: true,
    user,
    expiresAt: Math.floor((session.created_at + Number(session.expires_in) * 1000) / 1000),
    scope: session.scope,
  });
});

// Whether the session still exists. The browser SDK polls this, so it must not refresh the session
// or count as activity. A back-channel logout deletes the session, and the next poll reports it.
auth.get('/checksession', async (req, res) => {
  const sessionId = sessionIdOf(req);
  const isSignedIn = Boolean(sessionId && (await req.thunderIDAuth.getAccessToken(sessionId)));

  res.json({isSignedIn});
});

// Refreshes the session's access token with the refresh token held here.
auth.post('/refresh', async (req, res) => {
  const sessionId = sessionIdOf(req);

  try {
    if (!sessionId) {
      throw new Error('No session cookie.');
    }
    await req.thunderIDAuth.refreshAccessToken(sessionId);
    res.status(204).end();
  } catch {
    res.status(401).json({error: 'login_required'});
  }
});

// Ends the BFF session and returns the ThunderID end-session URL, which the browser then visits so
// the ThunderID session ends too. ThunderID then sends a back-channel logout to every other
// application that took part in the session.
auth.post('/signout', async (req, res) => {
  const client = req.thunderIDAuth;
  const sessionId = sessionIdOf(req);

  res.clearCookie(client.getSessionCookieName());
  if (!sessionId) {
    res.json({redirectUrl: appUrl});
    return;
  }

  try {
    // Built before the session is cleared, so it carries the ID token as id_token_hint.
    const redirectUrl = await client.signOut(sessionId);
    client.clearSession(sessionId);
    res.json({redirectUrl});
  } catch (error) {
    console.error('Could not sign out.', error);
    res.status(500).json({error: 'signout_failed'});
  }
});

// The access token, for requests the browser sends straight to an API instead of through the proxy
// (`endpoints.backend.bypass`). The refresh token never leaves the BFF.
auth.post('/token', async (req, res) => {
  const sessionId = await requireSession(req, res);
  if (!sessionId) return;

  const session = await req.thunderIDAuth.getStorageManager().getSessionData(sessionId);
  const expiresAt = session.created_at + Number(session.expires_in) * 1000;

  res.json({
    access_token: session.access_token,
    token_type: 'Bearer',
    expires_in: Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)),
    scope: session.scope,
  });
});

// Forwards /api/auth/proxy/<path> to <API_BASE_URL>/<path> with the session's access token.
auth.use('/proxy', createProxy({apiBaseUrl, requireSession}));

auth.use((_req, res) => {
  res.status(404).json({error: 'not_found'});
});

app.listen(port, () => {
  console.log(`ThunderID BFF running on http://localhost:${port}`);
  if (missingEnvVars.length > 0) {
    console.warn(`Missing ${missingEnvVars.join(', ')}. Copy .env.example to .env and fill them in.`);
  }
});
