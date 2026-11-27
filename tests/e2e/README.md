# Sample App E2E Tests

End-to-end tests for the sample apps in this repository, one suite per app. Each suite starts its sample from the sources here, with the published SDK release the sample's lockfile pins, and drives it against a real ThunderID server.

## Layout

```text
tests/e2e/
├── package.json              npm workspace root: shared + every web suite, one package-lock.json
├── shared/                   What every suite shares
│   ├── scripts/thunderid.sh  Start, stop and restart a ThunderID server; mint an admin token;
│   │                         import a declarative config; create a user
│   ├── scripts/mobile.sh     Provisioning, simulator and Maestro helpers for the mobile suites
│   ├── thunderid-config/     sample-apps.yaml (+ .env): the OAuth2 clients of the web samples that
│   │                         ship no config of their own, and the CORS allowlist
│   ├── apps.ts               Each web sample: path, port, configs to import, test users
│   ├── playwright.ts         The shared Playwright config and the sample web server
│   ├── setup/                Global setup: import the configs, create the test users (idempotent)
│   ├── pages/                Gate sign-in, the SDK sample pages, B2B company sign-up
│   └── utils/                Admin token, API requests, users, organization units, JWT
└── <area>/<sample>-e2e/      One suite per sample, mirroring its path in this repository
```

| Suite                                   | Kind                        | Port                   | Runs in CI |
| --------------------------------------- | --------------------------- | ---------------------- | ---------- |
| `quickstarts/quickstart-browser-e2e`    | Playwright                  | 5173                   | Yes        |
| `quickstarts/quickstart-react-e2e`      | Playwright                  | 5174                   | Yes        |
| `quickstarts/quickstart-vue-e2e`        | Playwright                  | 5175                   | Yes        |
| `quickstarts/quickstart-nextjs-e2e`     | Playwright                  | 3001                   | Yes        |
| `quickstarts/quickstart-nuxt-e2e`       | Playwright                  | 3002                   | Yes        |
| `quickstarts/quickstart-express-e2e`    | Playwright                  | 3000                   | Yes        |
| `quickstarts/quickstart-node-e2e`       | Playwright (spawns the CLI) | none                   | Yes        |
| `quickstarts/quickstart-react-b2b-e2e`  | Playwright                  | 5173                   | No         |
| `quickstarts/quickstart-nextjs-b2b-e2e` | Playwright                  | 3000                   | No         |
| `b2b/wayfinder-enterprise-nextjs-e2e`   | Playwright                  | 3000                   | No         |
| `management/admin-react-e2e`            | Playwright                  | 5176                   | Yes        |
| `self-service/myaccount-react-e2e`      | Playwright                  | 5177                   | Yes        |
| `patterns/bff-react-express-e2e`        | Playwright                  | 5178 (app), 3004 (BFF) | Yes        |
| `integrations/better-auth-nextjs-e2e`   | Playwright                  | 3003                   | Yes        |
| `quickstarts/quickstart-ios-e2e`        | Maestro, iOS Simulator      |                        | No         |
| `quickstarts/quickstart-android-e2e`    | Maestro, Android emulator   |                        | No         |
| `quickstarts/quickstart-flutter-e2e`    | Maestro, iOS Simulator      |                        | No         |
| `integrations/app-auth-flutter-e2e`     | Maestro, iOS Simulator      |                        | No         |

The ports are where each suite serves its sample. Most are distinct, so those suites can run side by side against one server. A few are fixed by the sample itself: `quickstart-browser` and `quickstart-react-b2b` both need 5173, and `quickstart-express`, `quickstart-nextjs-b2b` and `wayfinder-enterprise-nextjs` all need 3000, so run those one at a time. The Nuxt redirect URI fixes 3002.

## Prerequisites

- Node.js 22.18 or later, and npm
- Bash, `curl`, `jq`, `openssl` and `unzip`, for the server script
- A ThunderID server at `https://localhost:8090` (override with `SERVER_URL`), with the admin account `admin` / `admin` (override with `ADMIN_USERNAME` and `ADMIN_PASSWORD`). The B2B suites (`quickstart-react-b2b`, `quickstart-nextjs-b2b`, `wayfinder-enterprise-nextjs`) need a server newer than ThunderID 1.1.1: their samples use features such as the `org` permission.

## Start a server

```bash
# Downloads the latest release (or THUNDERID_VERSION) into .thunderid-server/, sets it up and starts it.
# Reuses a server that is already serving on SERVER_URL.
./shared/scripts/thunderid.sh start

./shared/scripts/thunderid.sh stop
```

## Run the web suites

```bash
npm ci
npx playwright install chromium

# One suite
npm test -w quickstarts/quickstart-react-e2e

# Every web suite, one after another
npm test
```

A suite's global setup imports what its app needs (`shared/thunderid-config/sample-apps.yaml`, and for the B2B samples their own `thunderid-config/thunderid-config.yaml`) and creates the test users, so it works against a fresh server and against one a previous run provisioned. Playwright then starts the sample with its own `npm run dev` or `npm start`, running `npm ci` in it first when it has no `node_modules`, and passes the sample its configuration through the environment, so nothing is written into the sample.

| Variable                                   | Default                            | Purpose                                                                                                                     |
| ------------------------------------------ | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `SAMPLES_ROOT`                             | this repository                    | The samples checkout to run, such as a `git archive HEAD` export when your working tree has local edits                     |
| `SERVER_URL`                               | `https://localhost:8090`           | The ThunderID server                                                                                                        |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD`         | `admin`, `admin`                   | The admin account the setup uses, and that the admin-react suite signs in as                                                |
| `ADMIN_TOKEN`                              | unset                              | Use this admin token instead of minting one                                                                                 |
| `TEST_USER_USERNAME`, `TEST_USER_PASSWORD` | `e2e-test-user`, `E2ePassword@123` | The shared test user                                                                                                        |
| `E2E_SKIP_SERVER_CONFIGS`                  | unset                              | `true` leaves server-wide settings (`defaultResourceServer`) out of the B2B samples' imports, for a server other people use |
| `E2E_REUSE_SERVER`                         | unset                              | `true` reuses an app already listening on the suite's port instead of failing                                               |
| `E2E_APP_LOGS`                             | unset                              | `true` prints the sample's output                                                                                           |
| `E2E_WORKERS`                              | `2`                                | Parallel Playwright workers. Kept low because the server's SQLite store can refuse racing authorization code exchanges      |

Defaults live in `shared/defaults.env`; a `tests/e2e/.env` file overrides them.

The suites leave what they create on the server: the test users, the imported resources, and the companies the B2B suites register. Use a disposable server for the B2B suites, whose imports also change the server-wide `defaultResourceServer` setting.

## Run the mobile suites

Each mobile suite has a `run-e2e.sh` that starts or reuses the server with `shared/scripts/thunderid.sh`, provisions it, builds and installs the sample, and runs Maestro. See the suite's README. The SDK repositories' Windows scripts are not ported.

## CI

[`.github/workflows/e2e.yml`](../../.github/workflows/e2e.yml) runs a web suite on a pull request when its sample, its suite, or `tests/e2e/shared` changes. Each suite gets its own job and a fresh server of the latest ThunderID release, and uploads its Playwright report when it fails. The mobile suites are not in CI yet; adding them is a follow-up.

A suite whose sample needs more than the latest ThunderID release offers carries a `ci-skip` file with the reason, and CI leaves it out. The B2B suites have one, because the latest release rejects their samples' configuration. Delete the file once a release supports the sample.

## Formatting

```bash
npm run format:check
npm run type-check
```
