# ThunderID Browser Quickstart E2E

Playwright suite for [`quickstarts/quickstart-browser`](../../../../quickstarts/quickstart-browser). It starts the sample from its own sources with its published SDK, signs in against a real ThunderID server, and checks:

- Sign in and sign out through the redirect flow
- The token debug page shows a valid access token
- Profile edits on the Account page are saved
- A password change on the Security tab takes effect and can be reverted, and the form stays disabled until both values match

## Run

Start a ThunderID server first (see the [E2E README](../../README.md)), then, from `tests/e2e`:

```bash
npm ci
npx playwright install chromium
npm test -w quickstarts/quickstart-browser-e2e
```

Playwright installs the sample with `npm ci` when it has no `node_modules`, and serves it on port 5173 with the OAuth2 client `JS_SDK_E2E_BROWSER`. The global setup imports that client and creates the test users. Set `SAMPLES_ROOT` to run against another samples checkout, such as a `git archive` export.

Port 5173 is shared with `quickstart-react-b2b`, so the two suites cannot run at the same time.
