# ThunderID Better Auth Sample E2E

Playwright suite for [`integrations/better-auth-nextjs`](../../../../integrations/better-auth-nextjs). It starts the sample from its own sources with its published SDK, signs in against a real ThunderID server, and checks:

- Sign-in with ThunderID through Better Auth's generic OAuth plugin and the `thunderid()` helper
- Better Auth holds a session for the ThunderID user
- Sign-out ends the Better Auth session and the ThunderID session

## Run

Start a ThunderID server first (see the [E2E README](../../README.md)), then, from `tests/e2e`:

```bash
npm ci
npx playwright install chromium
npm test -w integrations/better-auth-nextjs-e2e
```

Playwright installs the sample with `npm ci` when it has no `node_modules`, and serves it on port 3003 with the OAuth2 client `SAMPLES_E2E_BETTER_AUTH_NEXTJS`. The global setup imports that client and creates the test users. Set `SAMPLES_ROOT` to run against another samples checkout, such as a `git archive` export.

The sample registers no post-logout redirect URI, so after sign-out the browser stays on the ThunderID Gate; the spec opens the app again. Better Auth sends the client secret in the request body, so the suite's client uses `client_secret_post`.
