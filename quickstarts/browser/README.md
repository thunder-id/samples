![ThunderID Browser Quickstart](https://raw.githubusercontent.com/thunder-id/samples/main/.github/assets/banners/quickstarts-browser.png)

# ThunderID Browser Quickstart

A framework-free JavaScript app, built with Vite, that signs users in and out with the [ThunderID Browser SDK](https://www.npmjs.com/package/@thunderid/browser) (`@thunderid/browser`).

## Prerequisites

- Node.js 20 or later
- A running ThunderID server (`https://localhost:8090` by default)

## Get the sample

Download the latest zip from the [releases](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fbrowser&expanded=true), or copy the source:

```bash
npx degit thunder-id/samples/quickstarts/browser my-app
cd my-app
```

## Configure

1. In the ThunderID Console, create a **JavaScript** application with `http://localhost:5173` as its redirect URL, and copy its client ID.

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

- [Browser quickstart guide](https://thunderid.dev/docs/getting-started/connect-your-application/browser)
- [Browser SDK reference](https://thunderid.dev/docs/sdks-and-tools/browser/overview)

## License

Apache License 2.0. See [LICENSE](https://github.com/thunder-id/samples/blob/main/LICENSE).
