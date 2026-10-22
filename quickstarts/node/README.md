![ThunderID Node.js Quickstart](https://raw.githubusercontent.com/thunder-id/samples/main/.github/assets/banners/quickstarts-node.png)

# ThunderID Node.js Quickstart

A machine-to-machine client built with the [ThunderID Node.js SDK](https://www.npmjs.com/package/@thunderid/node) (`@thunderid/node`). There is no user and no browser sign-in: the service authenticates as itself with the OAuth 2.0 `client_credentials` grant, then uses the access token to call another piece of business logic. Use this pattern for background jobs, scheduled tasks, or one backend service calling another.

## Prerequisites

- Node.js 20 or later
- A running ThunderID server (`https://localhost:8090` by default)

## Get the sample

Download the latest zip from the [releases](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fnode&expanded=true), or copy the source:

```bash
npx degit thunder-id/samples/quickstarts/node my-app
cd my-app
```

## Configure

1. In the ThunderID Console (`https://localhost:8090/console`), go to **Applications**, click **Add Application**, and select **Backend Service**. Give it a name, such as `node-service-quickstart`, and create it. Backend Service applications come set up for the `client_credentials` grant with `client_secret_basic` authentication.
2. Copy the **Client ID** from the **General** tab, and the **Client Secret** from the dialog shown when the application is created. The secret is shown only once.
3. Create your `.env`:

   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   |---|---|
   | `THUNDERID_BASE_URL` | Base URL of your ThunderID server. |
   | `THUNDERID_CLIENT_ID` | Client ID of the application. |
   | `THUNDERID_CLIENT_SECRET` | Client secret of the application. |
   | `THUNDERID_SCOPE` | Optional. Space-separated scopes to request. |
   | `NODE_TLS_REJECT_UNAUTHORIZED` | Set to `0` in the example to accept a local server's self-signed certificate. Local development only. |

## Run

```bash
npm install
npm start
```

The script authenticates once, calls `InventoryService.getStock()` for a few SKUs, prints the result, and exits: a scope line, then an `Inventory` panel with one line per SKU, green for items in stock, yellow for items out of stock, and red for a SKU that does not exist.

## How it works

Authentication lives in its own service instead of being spread across the business logic:

```text
├── index.mjs                 Wires the services together and prints the result
└── lib/
    ├── AuthService.mjs        Gets and caches this service's own access token
    ├── InventoryService.mjs   Business logic; asks AuthService for a token before answering
    └── ui.mjs                 Terminal output, built on boxen and picocolors
```

- `lib/AuthService.mjs` creates a `ThunderIDNodeClient` with `grantType: 'client_credentials'`. With that set, `getAccessToken()` authenticates as the service itself and fetches, caches, and refreshes the token. It is the same method a user-facing app calls to read a session's token.
- `lib/InventoryService.mjs` needs a token before it can act and asks `AuthService` for one. The rest of the app never handles a token or an `Authorization` header. In a real deployment, `InventoryService` would send the token to a separate inventory backend over HTTP.

## Learn more

- [Node.js quickstart guide](https://thunderid.dev/docs/getting-started/connect-your-application/node)
- [Node.js SDK reference](https://thunderid.dev/docs/sdks-and-tools/node/overview)
- [OAuth 2.0 client credentials grant (RFC 6749, section 4.4)](https://www.rfc-editor.org/rfc/rfc6749#section-4.4)

## License

Apache License 2.0. See [LICENSE](https://github.com/thunder-id/samples/blob/main/LICENSE).
