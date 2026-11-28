# ThunderID Wayfinder Enterprise Sample E2E

Playwright suite for [`b2b/wayfinder-enterprise-nextjs`](../../../../b2b/wayfinder-enterprise-nextjs). It starts the sample from its own sources with its published SDK, signs in against a real ThunderID server, and checks:

- A new company's first admin lands in the admin workspace with every admin page
- Team and roles lists the admin through the app's company-scoped management proxy
- Sign-out

## Run

Start a ThunderID server first (see the [E2E README](../../README.md)), then, from `tests/e2e`:

```bash
npm ci
npx playwright install chromium
npm test -w b2b/wayfinder-enterprise-nextjs-e2e
```

Playwright installs the sample with `npm ci` when it has no `node_modules`, and serves it on port 3000 with the sample's own OAuth2 clients `WAYFINDER_ENTERPRISE` and `WAYFINDER_ENTERPRISE_BACKEND`. The global setup imports that client and creates the test users. Set `SAMPLES_ROOT` to run against another samples checkout, such as a `git archive` export.

The global setup imports the sample's own `thunderid-config/thunderid-config.yaml`, which needs a ThunderID server newer than 1.1.1, and sets the server-wide `defaultResourceServer` to the Wayfinder API. The app needs that setting, so do not use `E2E_SKIP_SERVER_CONFIGS` here, and run it against a disposable server. `npm run dev` fixes port 3000, shared with `quickstart-express` and `quickstart-nextjs-b2b`. Every run registers a new company, which stays on the server.
