![ThunderID Better Auth Sample](https://raw.githubusercontent.com/thunder-id/samples/main/.github/assets/banners/integrations-better-auth-nextjs.png)

# ThunderID Better Auth Sample

A Next.js 15 App Router app that signs users in to ThunderID through [Better Auth](https://better-auth.com)'s [Generic OAuth plugin](https://better-auth.com/docs/plugins/generic-oauth), configured with the [`@thunderid/better-auth`](https://www.npmjs.com/package/@thunderid/better-auth) provider helper.

Better Auth does all the OAuth 2.0 and OIDC work; there is no ThunderID SDK in the app. Users and sessions live in an in-memory store (`better-auth/adapters/memory`) that resets when the server restarts. Use a real [database adapter](https://better-auth.com/docs/adapters) in your own app.

## Prerequisites

- Node.js 20 or later
- A running ThunderID server (`https://localhost:8090` by default)

## Get the sample

Download the latest zip from the [releases](https://github.com/thunder-id/samples/releases?q=sample%2Fintegrations%2Fbetter-auth-nextjs&expanded=true), or copy the source:

```bash
npx degit thunder-id/samples/integrations/better-auth-nextjs my-app
cd my-app
```

## Configure

1. In the ThunderID Console, create an application with an OAuth 2.0 client that uses the `authorization_code` grant and has a client secret. Register this redirect URL on it:

   ```text
   http://localhost:3000/api/auth/callback/thunderid
   ```

   Copy its client ID and client secret from the **Credentials** tab.

2. Create your `.env`:

   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   |---|---|
   | `BETTER_AUTH_SECRET` | Signs and encrypts Better Auth's session cookies. Generate it with `openssl rand -base64 32`. |
   | `BETTER_AUTH_URL` | Base URL the app is served from. The callback URL is derived from it. |
   | `THUNDERID_ISSUER` | Your ThunderID server's issuer URL. |
   | `THUNDERID_CLIENT_ID` | Client ID of the application. |
   | `THUNDERID_CLIENT_SECRET` | Client secret of the application. Server-only. |
   | `NODE_TLS_REJECT_UNAUTHORIZED` | Set to `0` in the example to accept a local server's self-signed certificate. Local development only. |

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **Sign in with ThunderID**.

## How it works

- [`lib/auth.ts`](./lib/auth.ts) is the Better Auth server instance. It registers the `genericOAuth` plugin with the `thunderid()` helper, which supplies the issuer's discovery URL and the default `openid profile email` scopes.
- [`lib/auth-client.ts`](./lib/auth-client.ts) is the Better Auth React client. ThunderID needs no client plugin; sign-in goes through the standard social provider API.
- [`app/api/auth/[...all]/route.ts`](./app/api/auth/%5B...all%5D/route.ts) is the catch-all route handler that exposes Better Auth's API through `toNextJsHandler`.
- [`app/page.tsx`](./app/page.tsx) signs in with `authClient.signIn.social({provider: 'thunderid'})`, shows the session with `authClient.useSession()`, and signs out with `authClient.signOut()`.
- [`app/components/ConfigNotice.tsx`](./app/components/ConfigNotice.tsx) is shown instead of the app when a required environment variable is missing, with the exact redirect URL to register.

## Learn more

- [Better Auth guide](https://thunderid.dev/sdks-and-tools/better-auth)
- [Better Auth Generic OAuth plugin](https://better-auth.com/docs/plugins/generic-oauth)

## License

Apache License 2.0. See [LICENSE](https://github.com/thunder-id/samples/blob/main/LICENSE).
