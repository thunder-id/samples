# ThunderID Admin Sample E2E

Playwright suite for [`management/admin-react`](../../../../management/admin-react). It starts the sample from its own sources with its published SDK, signs in against a real ThunderID server, and checks:

- The server administrator (`ADMIN_USERNAME`) signs in and gets the management sections
- The Users page lists and finds the test user, and opens their details
- The Groups and Roles pages load from the management API
- Sign-out

## Run

Start a ThunderID server first (see the [E2E README](../../README.md)), then, from `tests/e2e`:

```bash
npm ci
npx playwright install chromium
npm test -w management/admin-react-e2e
```

Playwright installs the sample with `npm ci` when it has no `node_modules`, and serves it on port 5176 with the OAuth2 client `SAMPLES_E2E_ADMIN_REACT`. The global setup imports that client and creates the test users. Set `SAMPLES_ROOT` to run against another samples checkout, such as a `git archive` export.
