![ThunderID Account Sample](https://raw.githubusercontent.com/thunder-id/samples/main/.github/assets/banners/self-care-account.png)

# ThunderID Account Sample

A React (Vite and TypeScript) app where signed-in users manage their own ThunderID account: view and edit their profile,
and change their password. It is built with the self-care components of the
[ThunderID React SDK](https://www.npmjs.com/package/@thunderid/react) (`@thunderid/react`).

| Account page tab | SDK component      |
| ---------------- | ------------------ |
| Home             | `User`             |
| Personal info    | `UserProfile`      |
| Security         | `ChangeCredential` |

The top bar uses `SignInButton`, `UserDropdown`, `SignedIn`, and `SignedOut`.

## Prerequisites

- Node.js 20 or later
- A running ThunderID server (`https://localhost:8090` by default)

## Get the sample

Download the latest zip from the
[releases](https://github.com/thunder-id/samples/releases?q=sample%2Fself-care%2Faccount&expanded=true), or copy the
source:

```bash
npx degit thunder-id/samples/self-care/account my-app
cd my-app
```

## Configure

1. In the ThunderID Console, create a **React** application with `http://localhost:5173` as its redirect URL, and copy
   its client ID.

2. Create your `.env`:

   ```bash
   cp .env.example .env
   ```

   | Variable                   | Description                        |
   | -------------------------- | ---------------------------------- |
   | `VITE_THUNDERID_BASE_URL`  | Base URL of your ThunderID server. |
   | `VITE_THUNDERID_CLIENT_ID` | Client ID of the application.      |

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and sign in. You land on the account page.

## Add a self-care component

When the SDK ships a new self-care component, bump `@thunderid/react` in `package.json` and add the component to
`src/pages/AccountPage.tsx`. For a new area, add a tab to `TABS` and `TILES`, and render the component for that tab.

## Learn more

- [React quickstart guide](https://thunderid.dev/docs/getting-started/connect-your-application/react)
- [React SDK reference](https://thunderid.dev/docs/sdks-and-tools/react/overview)

## License

Apache License 2.0. See [LICENSE](https://github.com/thunder-id/samples/blob/main/LICENSE).
