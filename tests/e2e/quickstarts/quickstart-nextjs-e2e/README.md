# ThunderID Next.js Quickstart E2E

Playwright suite for [`quickstarts/quickstart-nextjs`](../../../../quickstarts/quickstart-nextjs). It starts the sample from its own sources with its published SDK, signs in against a real ThunderID server, and checks:

- Sign in and sign out through the redirect flow, which the suite turns on by setting a client ID (the sample defaults to its native flow)
- The token debug page shows a valid access token
- Profile edits on the Account page are saved
- A password change on the Security tab takes effect and can be reverted

## Run

Start a ThunderID server first (see the [E2E README](../../README.md)), then, from `tests/e2e`:

```bash
npm ci
npx playwright install chromium
npm test -w quickstarts/quickstart-nextjs-e2e
```

Playwright installs the sample with `npm ci` when it has no `node_modules`, and serves it on port 3001 with the OAuth2 client `JS_SDK_E2E_NEXTJS`. The global setup imports that client and creates the test users. Set `SAMPLES_ROOT` to run against another samples checkout, such as a `git archive` export.
