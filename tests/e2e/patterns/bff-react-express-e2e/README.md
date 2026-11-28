# ThunderID React and Express BFF Sample E2E

Playwright suite for [`patterns/bff-react-express`](../../../../patterns/bff-react-express). It starts the sample from its own sources with its published SDK, signs in against a real ThunderID server, and checks:

- Sign-in through the BFF, which reports the session at `/api/auth/session` and keeps the session cookie `HttpOnly`
- An API call through `/api/auth/proxy` carries the access token
- The Token debug page shows the access token the BFF exposes
- Sign-out ends the BFF session, and the BFF refuses requests without `X-Requested-With` or a session

## Run

Start a ThunderID server first (see the [E2E README](../../README.md)), then, from `tests/e2e`:

```bash
npm ci
npx playwright install chromium
npm test -w patterns/bff-react-express-e2e
```

Playwright installs the sample with `npm ci` when it has no `node_modules`, and serves it on port 5178 with the OAuth2 client `SAMPLES_E2E_BFF_REACT_EXPRESS`. The global setup imports that client and creates the test users. Set `SAMPLES_ROOT` to run against another samples checkout, such as a `git archive` export.

The suite starts two servers: the BFF on port 3004 (`npm start -w server`) and the React app on 5178 (`npm run dev -w client`), which forwards `/api/auth` to the BFF.
