# ThunderID Account Sample E2E

Playwright suite for [`self-service/myaccount-react`](../../../../self-service/myaccount-react). It starts the sample from its own sources with its published SDK, signs in against a real ThunderID server, and checks:

- A signed-in user lands on the account page
- Profile edits on the Personal info tab are saved
- A password change on the Security tab takes effect and can be reverted, and the form stays disabled until both values match
- Sign-out

## Run

Start a ThunderID server first (see the [E2E README](../../README.md)), then, from `tests/e2e`:

```bash
npm ci
npx playwright install chromium
npm test -w self-service/myaccount-react-e2e
```

Playwright installs the sample with `npm ci` when it has no `node_modules`, and serves it on port 5177 with the OAuth2 client `SAMPLES_E2E_MYACCOUNT_REACT`. The global setup imports that client and creates the test users. Set `SAMPLES_ROOT` to run against another samples checkout, such as a `git archive` export.
