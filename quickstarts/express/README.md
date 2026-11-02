![ThunderID Express Quickstart](https://raw.githubusercontent.com/thunder-id/samples/main/.github/assets/banners/quickstarts-express.png)

# ThunderID Express Quickstart

An Express API protected by ThunderID access tokens, using the [ThunderID Express SDK](https://www.npmjs.com/package/@thunderid/express) (`@thunderid/express`). It is a resource server, so there is no sign-in button: [http://localhost:3000](http://localhost:3000) serves API documentation with endpoints, curl examples, and a downloadable Postman collection.

Protected routes check the `Authorization: Bearer <token>` header against ThunderID's OIDC `/oauth2/userinfo` endpoint, the same check any OAuth 2.0 resource server performs. A `/login` and `/token` helper is included only to give you a quick way to get a demo access token.

## Prerequisites

- Node.js 20 or later
- A running ThunderID server (`https://localhost:8090` by default)

## Get the sample

Download the latest zip from the [releases](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fexpress&expanded=true), or copy the source:

```bash
npx degit thunder-id/samples/quickstarts/express my-app
cd my-app
```

## Configure

1. In the ThunderID Console, create an **Express** application with `http://localhost:3000/login` as its redirect URL, and copy its client ID and client secret.

2. Create your `.env`:

   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   |---|---|
   | `THUNDERID_BASE_URL` | Base URL of your ThunderID server. |
   | `THUNDERID_CLIENT_ID` | Client ID of the application. |
   | `THUNDERID_CLIENT_SECRET` | Client secret of the application. Server-only. |
   | `NODE_TLS_REJECT_UNAUTHORIZED` | Set to `0` in the example to accept a local server's self-signed certificate. Local development only. |

## Run

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) for the API documentation.

## Try the API

- `GET /api/public` needs no token.
- `GET /api/protected`, `GET /api/me`, and `PATCH /api/me/credentials` need `Authorization: Bearer <access_token>`.

To get a token, open [http://localhost:3000/login](http://localhost:3000/login) and sign in. The access token and its decoded claims are shown at [http://localhost:3000/token](http://localhost:3000/token). Then:

```bash
curl http://localhost:3000/api/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

To use Postman instead, download the collection from the API documentation page (or `/postman-collection.json`), paste your token into the `accessToken` collection variable, and send the requests.

## Back-channel logout

ThunderID can end the demo session behind `/login` and `/token` itself. When the user's ThunderID session ends somewhere else, for example by signing out of another application, ThunderID posts a logout token to this app and the SDK ends the local session. The route is one line in `index.mjs`:

```js
app.post('/backchannel-logout', handleBackchannelLogout());
```

To try it:

1. In the ThunderID Console, open this application, go to **Advanced Settings → OAuth2 Configuration**, and set **Back-Channel Logout URI** to `http://localhost:3000/backchannel-logout`.
2. ThunderID refuses localhost and private network addresses by default. For local testing only, turn that off in the server's `deployment.yaml` and restart it:

   ```yaml
   oauth:
     logout:
       backchannel:
         reject_private_addresses: false
   ```

3. Sign in at [http://localhost:3000/login](http://localhost:3000/login), then sign in to a second application in the same browser, so both share one ThunderID session.
4. Sign out of the second application, then open [http://localhost:3000/token](http://localhost:3000/token). You are sent back to sign in, because this app's session ended too.

The Bearer token routes under `/api` are not affected: they check each access token with ThunderID on every request and hold no session.

The SDK keeps sessions in memory by default. If you run more than one instance, give the SDK a shared store, since ThunderID's request reaches only one of them.

## Learn more

- [Express quickstart guide](https://thunderid.dev/docs/getting-started/connect-your-application/express)
- [Express SDK reference](https://thunderid.dev/docs/sdks-and-tools/express/overview)

## License

Apache License 2.0. See [LICENSE](https://github.com/thunder-id/samples/blob/main/LICENSE).
