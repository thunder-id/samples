![ThunderID React Quickstart](https://raw.githubusercontent.com/thunder-id/samples/main/.github/assets/banners/quickstarts-react.png)

# ThunderID React Quickstart

A React and Vite app that signs users in with the [ThunderID React SDK](https://www.npmjs.com/package/@thunderid/react) (`@thunderid/react`), using the authorization code flow with PKCE, and shows the signed-in user's profile and tokens.

## Prerequisites

- Node.js 20 or later
- A running ThunderID server (`https://localhost:8090` by default)

## Get the sample

Download the latest zip from the [releases](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Freact&expanded=true), or copy the source:

```bash
npx degit thunder-id/samples/quickstarts/react my-app
cd my-app
```

## Configure

1. In the ThunderID Console, create a **React** application with `http://localhost:5173` as its redirect URL, and copy its client ID.

2. Create your `.env`:

   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   |---|---|
   | `VITE_THUNDERID_BASE_URL` | Base URL of your ThunderID server. |
   | `VITE_THUNDERID_CLIENT_ID` | Client ID of the application. |

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and sign in.

## Learn more

- [React quickstart guide](https://thunderid.dev/docs/getting-started/connect-your-application/react)
- [React SDK reference](https://thunderid.dev/docs/sdks-and-tools/react/overview)

## License

Apache License 2.0. See [LICENSE](https://github.com/thunder-id/samples/blob/main/LICENSE).
