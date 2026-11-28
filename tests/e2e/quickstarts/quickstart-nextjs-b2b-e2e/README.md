# ThunderID Next.js B2B Quickstart E2E

Playwright suite for [`quickstarts/quickstart-nextjs-b2b`](../../../../quickstarts/quickstart-nextjs-b2b). It starts the sample from its own sources with its published SDK, signs in against a real ThunderID server, and checks:

- Registering a company signs its first admin in to it, with the company and the `Next.js B2B Admin` role in the token
- An account shared into two companies switches between them on the server, with the device secret
- Sign-out

## Run

Start a ThunderID server first (see the [E2E README](../../README.md)), then, from `tests/e2e`:

```bash
npm ci
npx playwright install chromium
npm test -w quickstarts/quickstart-nextjs-b2b-e2e
```

Playwright installs the sample with `npm ci` when it has no `node_modules`, and serves it on port 3000 with the sample's own OAuth2 client `NEXTJS_B2B_QUICKSTART`. The global setup imports that client and creates the test users. Set `SAMPLES_ROOT` to run against another samples checkout, such as a `git archive` export.

The global setup imports the sample's own `thunderid-config/thunderid-config.yaml`, which needs a ThunderID server newer than 1.1.1. Its redirect URIs fix port 3000, shared with `quickstart-express` and `wayfinder-enterprise-nextjs`. The import sets the server-wide `defaultResourceServer`, which gives the token its `org` scope; with `E2E_SKIP_SERVER_CONFIGS=true` the suite skips that check. Every run registers new companies, which stay on the server.
