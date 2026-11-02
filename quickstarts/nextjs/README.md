![ThunderID Next.js Quickstart](https://raw.githubusercontent.com/thunder-id/samples/main/.github/assets/banners/quickstarts-nextjs.png)

# ThunderID Next.js Quickstart

A Next.js 15 App Router app that signs users in with the [ThunderID Next.js SDK](https://www.npmjs.com/package/@thunderid/nextjs) (`@thunderid/nextjs`), on the client and the server. By default, sign-in and sign-up render inside the app on its own `/signin` and `/signup` routes (the native flow). It can also send users to ThunderID's hosted sign-in page instead.

## Prerequisites

- Node.js 20 or later
- A running ThunderID server (`https://localhost:8090` by default)

## Get the sample

Download the latest zip from the [releases](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fnextjs&expanded=true), or copy the source:

```bash
npx degit thunder-id/samples/quickstarts/nextjs my-app
cd my-app
```

## Configure

1. In the ThunderID Console, create a **Next.js** application. Copy its application ID, and its Flow Secret, which is shown once when the application is created and can be regenerated later from the application's **Credentials** tab.

2. Create your `.env`:

   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   |---|---|
   | `NEXT_PUBLIC_THUNDERID_BASE_URL` | Base URL of your ThunderID server. |
   | `NEXT_PUBLIC_THUNDERID_APPLICATION_ID` | Application ID of the application. |
   | `THUNDERID_FLOW_SECRET` | Flow Secret of the application. Server-only. |
   | `THUNDERID_SECRET` | Encrypts the session cookie. Generate it with `openssl rand -base64 32`. |
   | `NEXT_PUBLIC_THUNDERID_SIGN_IN_URL` | The app's sign-in route. Keep `/signin`. |
   | `NEXT_PUBLIC_THUNDERID_SIGN_UP_URL` | The app's sign-up route. Keep `/signup`. |
   | `NODE_TLS_REJECT_UNAUTHORIZED` | Set to `0` in the example to accept a local server's self-signed certificate. Local development only. |

   The Flow Secret is a different credential from the OAuth2 client secret used by the redirect-based flow below. An application with no OAuth2 configuration has a Flow Secret and no client secret; a redirect-based `authorization_code` application has a client secret and no Flow Secret.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in.

## Redirect-based flow

To send users to ThunderID's hosted sign-in page instead of the app's own pages:

1. Register a redirect URL on your application. The app's config notice shows the exact value.
2. Switch `.env` to the redirect flow:

   ```bash
   npm run prepare-dev:redirect
   ```

   This comments out the native flow variables (`NEXT_PUBLIC_THUNDERID_APPLICATION_ID`, `NEXT_PUBLIC_THUNDERID_SIGN_IN_URL`, `NEXT_PUBLIC_THUNDERID_SIGN_UP_URL`, `THUNDERID_FLOW_SECRET`) and adds:

   ```dotenv
   NEXT_PUBLIC_THUNDERID_CLIENT_ID=<your-client-id>
   THUNDERID_CLIENT_SECRET=<your-client-secret>
   ```

3. Fill in both values from the application's **Credentials** tab, then restart the dev server.

To switch back, run `node scripts/prepare-dev.cjs --flow=native`.

## Back-channel logout

ThunderID can end this app's session itself. When the user's ThunderID session ends somewhere else, for example by signing out of another application, ThunderID posts a logout token to this app. The route is one line in `app/api/auth/backchannel-logout/route.ts`:

```ts
export const {POST} = backchannelLogout()
```

The session lives in a cookie that only the browser can delete, so the SDK records the logout and treats every later request with that session as signed out.

To try it, use the redirect-based flow, since the logout token is addressed to the client ID:

1. In the ThunderID Console, open this application, go to **Advanced Settings → OAuth2 Configuration**, and set **Back-Channel Logout URI** to `http://localhost:3000/api/auth/backchannel-logout`.
2. ThunderID refuses localhost and private network addresses by default. For local testing only, turn that off in the server's `deployment.yaml` and restart it:

   ```yaml
   oauth:
     logout:
       backchannel:
         reject_private_addresses: false
   ```

3. Sign in at [http://localhost:3000](http://localhost:3000), then sign in to a second application in the same browser, so both share one ThunderID session.
4. Sign out of the second application, then reload this app. You are signed out here too.

Before production:

- The SDK records ended sessions in memory by default. If you run more than one instance, pass a shared `store` to both `backchannelLogout()` and `thunderIDProxy()`, since ThunderID's request reaches only one instance.
- Route protection in `thunderIDProxy()` sees the in-memory record only when the proxy runs on the Node.js runtime. On Next.js 15, add `runtime: 'nodejs'` to the `config` export of your `middleware.ts`. On the Edge runtime, use a shared `store`.
- An access token already handed to the browser or to another API stays valid until it expires.

## Learn more

- [Next.js quickstart guide](https://thunderid.dev/docs/getting-started/connect-your-application/nextjs)
- [Next.js SDK reference](https://thunderid.dev/docs/sdks-and-tools/nextjs/overview)

## License

Apache License 2.0. See [LICENSE](https://github.com/thunder-id/samples/blob/main/LICENSE).
