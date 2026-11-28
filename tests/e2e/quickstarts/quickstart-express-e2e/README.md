# ThunderID Express Quickstart E2E

Playwright suite for [`quickstarts/quickstart-express`](../../../../quickstarts/quickstart-express). It starts the sample from its own sources with its published SDK, signs in against a real ThunderID server, and checks:

- Sign in and sign out through the server-side redirect flow
- The token debug page shows a valid access token
- A password change through `PATCH /api/me/credentials` takes effect and can be reverted, and the route refuses an unauthenticated call

## Run

Start a ThunderID server first (see the [E2E README](../../README.md)), then, from `tests/e2e`:

```bash
npm ci
npx playwright install chromium
npm test -w quickstarts/quickstart-express-e2e
```

Playwright installs the sample with `npm ci` when it has no `node_modules`, and serves it on port 3000 with the OAuth2 client `JS_SDK_E2E_EXPRESS`. The global setup imports that client and creates the test users. Set `SAMPLES_ROOT` to run against another samples checkout, such as a `git archive` export.

The sample listens on port 3000, which `quickstart-nextjs-b2b` and `wayfinder-enterprise-nextjs` also need, so these suites cannot run at the same time.
