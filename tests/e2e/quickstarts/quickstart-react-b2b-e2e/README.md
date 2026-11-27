# ThunderID React B2B Quickstart E2E

Playwright suite for [`quickstarts/quickstart-react-b2b`](../../../../quickstarts/quickstart-react-b2b). It starts the sample from its own sources with its published SDK, signs in against a real ThunderID server, and checks:

- Registering a company signs its first admin in to it, with the company, the `React B2B Admin` role and the `org` scope in the token
- An account shared into two companies switches between them with the organization unit switcher
- Sign-out

## Run

Start a ThunderID server first (see the [E2E README](../../README.md)), then, from `tests/e2e`:

```bash
npm ci
npx playwright install chromium
npm test -w quickstarts/quickstart-react-b2b-e2e
```

Playwright installs the sample with `npm ci` when it has no `node_modules`, and serves it on port 5173 with the sample's own OAuth2 client `REACT_B2B_QUICKSTART`. The global setup imports that client and creates the test users. Set `SAMPLES_ROOT` to run against another samples checkout, such as a `git archive` export.

The global setup imports the sample's own `thunderid-config/thunderid-config.yaml`, which needs a ThunderID server newer than 1.1.1 (it uses the `org` permission). The sample's Vite config and redirect URIs fix port 5173, shared with `quickstart-browser`. The import sets the server-wide `defaultResourceServer`; set `E2E_SKIP_SERVER_CONFIGS=true` to leave it out on a shared server (this app names its resource itself, so its token should still carry `org`). Every run registers new companies, which stay on the server.
