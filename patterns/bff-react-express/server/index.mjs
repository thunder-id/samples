import express from 'express';
import cookieParser from 'cookie-parser';
import {thunderID, thunderIDBff} from '@thunderid/express';

const port = Number(process.env.PORT) || 3001;
const baseUrl = process.env.THUNDERID_BASE_URL || 'https://localhost:8090';
// The origin the browser opens the app on. The BFF is reached on the same origin, under /api/auth,
// so its session cookie is first party. In development the React dev server forwards /api/auth here.
const appUrl = (process.env.APP_URL || 'http://localhost:5173').replace(/\/+$/, '');
// The API the proxy fronts. The browser never learns this address or the token sent to it.
const apiBaseUrl = (process.env.API_BASE_URL || baseUrl).replace(/\/+$/, '');

const REQUIRED_ENV_VARS = ['THUNDERID_CLIENT_ID', 'THUNDERID_CLIENT_SECRET'];
const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

const app = express();
app.disable('x-powered-by');
app.use(cookieParser());

app.get('/', (_req, res) => {
  res.json({
    message: `This is the ThunderID BFF. Open the app at ${appUrl}, which reaches this server under /api/auth.`,
  });
});

if (missingEnvVars.length > 0) {
  app.use('/api/auth', (_req, res) => {
    res.set('Cache-Control', 'no-store');
    res.status(503).json({
      error: 'not_configured',
      message: 'Copy .env.example to .env, fill in the values from your ThunderID application, then restart the BFF.',
      missing: missingEnvVars,
    });
  });
} else {
  app.use(
    thunderID({
      baseUrl,
      clientId: process.env.THUNDERID_CLIENT_ID,
      clientSecret: process.env.THUNDERID_CLIENT_SECRET,
      // The redirect URI sent to ThunderID. It is on the app's origin so that the session cookie set
      // by the callback belongs to the app, and must be registered for the application as it is.
      // Its origin is also the only origin the BFF accepts state-changing calls from.
      afterSignInUrl: `${appUrl}/api/auth/callback`,
      // The post-logout redirect URI, also registered for the application.
      afterSignOutUrl: appUrl,
      onBackchannelLogout: ({sessionsEnded, sid}) => {
        console.log(`Back-channel logout for ThunderID session ${sid ?? '(by subject)'}: ended ${sessionsEnded} local session(s).`);
      },
    }),
  );

  // Serves the whole BFF contract under /api/auth: sign-in, the callback, the session, refresh,
  // sign-out, organization unit switch, back-channel logout, and the API proxy, which forwards
  // /api/auth/proxy/<path> to <API_BASE_URL>/<path> with the session's access token.
  app.use(
    thunderIDBff({
      apiBaseUrl,
      // Turns on POST /api/auth/token, which hands the browser the access token (never the refresh
      // token) for APIs it calls directly instead of through the proxy. This is the token-mediating
      // pattern, and it is optional: the app's Token debug page uses it. Leave it out to keep every
      // token on the server.
      exposeAccessToken: true,
    }),
  );
}

app.listen(port, () => {
  console.log(`ThunderID BFF running on http://localhost:${port}`);
  if (missingEnvVars.length > 0) {
    console.warn(`Missing ${missingEnvVars.join(', ')}. Copy .env.example to .env and fill them in.`);
  }
});
