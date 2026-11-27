# ThunderID Node.js Quickstart E2E

Playwright suite for [`quickstarts/quickstart-node`](../../../../quickstarts/quickstart-node). It starts the sample from its own sources with its published SDK, signs in against a real ThunderID server, and checks:

- The CLI gets an access token with the `client_credentials` grant and exits cleanly. There is no browser UI: the spec runs `node index.mjs` with the client in its environment, after `npm ci` in the sample when it has no `node_modules`.

## Run

Start a ThunderID server first (see the [E2E README](../../README.md)), then, from `tests/e2e`:

```bash
npm ci
npx playwright install chromium
npm test -w quickstarts/quickstart-node-e2e
```

The global setup imports the OAuth2 client `JS_SDK_E2E_NODE` and creates the test user. Set `SAMPLES_ROOT` to run against another samples checkout.
