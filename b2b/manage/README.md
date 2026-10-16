# ThunderID Manage

ThunderID Manage is a sample app for trying out the ThunderID React SDK on B2B management services. An administrator signs in and manages the resources of a ThunderID server from one place. It is a React (Vite + TypeScript) app built with the [ThunderID React SDK](https://www.npmjs.com/package/@thunderid/react).

## What's included

- **Home**: a short page that explains what the app is for.
- **Agents**: the agent onboarding experience, built with the SDK's React components. You can see the agents on your server, create one through the ThunderID agent onboarding flow, and delete one.

When you create an agent, the app starts the onboarding flow that lives on your ThunderID server. The SDK draws each step the flow sends back: who owns the agent, the agent's details, and the new credentials. The client secret is shown once, hidden behind dots until you choose to show it.

These SDK components are used:

| Where                      | SDK component                                         |
| -------------------------- | ----------------------------------------------------- |
| App setup                  | `ThunderIDProvider`                                   |
| Top bar and home page      | `SignInButton`, `SignedIn`, `SignedOut`, `Loading`    |
| Signed-in user             | `UserDropdown`, `User`                                |
| Agents pages               | `ProtectedRoute` (from `@thunderid/react-router`)     |
| Create agent               | `BaseInviteUser`, which runs the flow and draws steps |
| Owner step                 | The user picker (`BaseUserSelect`)                    |
| Details and dropdown steps | `TextField`, `Select`                                 |
| Credentials step           | `CopyableText`, with the secret hidden until shown    |
| Buttons                    | `Button`                                              |

The app also uses the SDK hooks `useThunderID`, `useFetchUsers`, `useFetchAuthFlows`, `useFetchUserTypes`, `useTheme` and `useTranslation`. The organization unit dropdown and the step buttons are drawn by the app itself, through the SDK's custom renderers.

## Prerequisites

- Node.js 20+ and [pnpm](https://pnpm.io/)
- ThunderID React SDK 1.4.0 or later (`@thunderid/react`). It is the first release with the user picker (`BaseUserSelect` and `useFetchUsers`) and the masked `CopyableText` that this sample uses. `pnpm install` fetches it, together with `@thunderid/react-router` 1.3.0.
- A running ThunderID server (defaults to `https://localhost:8090`) and an administrator account
- The agent onboarding flow on that server. A standard install already has one, named `default-agent-onboarding-flow`.

New to ThunderID with React? Follow the [React quickstart guide](https://thunderid.dev/docs/next/getting-started/connect-your-application/react/) to set up a ThunderID server and connect a React app to it.

## Setup

1. Start your ThunderID server.

2. In the ThunderID Console, [create a React application](https://thunderid.dev/docs/getting-started/connect-your-application/react/#:~:text=2-,Create%20an%20Application,-Sign%20in%20to). Use `http://localhost:5173` as the redirect URL, and copy the client ID it gives you. Then add `http://localhost:5173` to the allowed origins (Settings → CORS), or the browser will block the sign-in requests.

3. Configure the app:

   ```bash
   cp .env.example .env
   ```

   | Variable                            | Description                                                                                                 |
   | ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
   | `VITE_THUNDERID_BASE_URL`           | Base URL of your ThunderID server.                                                                          |
   | `VITE_THUNDERID_CLIENT_ID`          | Client ID of the application (from step 2).                                                                 |
   | `VITE_AGENT_ONBOARDING_FLOW_HANDLE` | Handle of the flow that creates agents. Defaults to `default-agent-onboarding-flow`.                        |
   | `VITE_THUNDERID_RESOURCE`           | Optional. The part of ThunderID that guards admin information. A standard install already uses the default. |

4. Install and start:

   ```bash
   pnpm install
   pnpm dev
   ```

5. Open `http://localhost:5173` and sign in as an administrator.

Only administrators can use the Agents section. Anyone else can sign in, but the server turns down the requests and the page shows an error.

## Docs

- Full SDK reference: [thunderid.dev/docs](https://thunderid.dev/docs)

## License

Apache License 2.0.
