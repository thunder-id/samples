![ThunderID Manage Sample](https://raw.githubusercontent.com/thunder-id/samples/main/.github/assets/banners/b2b-manage.png)

# ThunderID Manage Sample

A React (Vite and TypeScript) app where an administrator signs in and manages the resources of a ThunderID server from one place, built with the [ThunderID React SDK](https://www.npmjs.com/package/@thunderid/react) (`@thunderid/react`). It has two sections:

- **Home**: a short page that explains what the app is for.
- **Agents**: lists the agents on your server, creates one through the ThunderID agent onboarding flow, and deletes one.

Creating an agent starts the onboarding flow that lives on your ThunderID server. The SDK draws each step the flow sends back: who owns the agent, the agent's details, and the new credentials. The client secret is shown once, hidden until you choose to show it.

| Where                      | SDK component                                             |
| -------------------------- | --------------------------------------------------------- |
| App setup                  | `ThunderIDProvider`                                       |
| Top bar and home page      | `SignInButton`, `SignedIn`, `SignedOut`, `Loading`        |
| Signed-in user             | `UserDropdown`, `User`                                    |
| Agents pages               | `ProtectedRoute` (from `@thunderid/react-router`)         |
| Create agent               | `BaseInviteUser`, which runs the flow and draws its steps |
| Owner step                 | The user picker, `BaseUserSelect`                         |
| Details and dropdown steps | `TextField`, `Select`                                     |
| Credentials step           | `CopyableText`, with the secret hidden until shown        |
| Buttons                    | `Button`                                                  |

The app also uses the SDK hooks `useThunderID`, `useFetchUsers`, `useFetchAuthFlows`, `useFetchUserTypes`, `useTheme`, and `useTranslation`. The organization unit dropdown and the step buttons are drawn by the app itself, through the SDK's custom renderers.

## Prerequisites

- Node.js 20 or later
- A running ThunderID server (`https://localhost:8090` by default) and an administrator account
- The agent onboarding flow on that server. A standard install already has one, named `default-agent-onboarding-flow`.

The sample needs `@thunderid/react` 1.4.0 or later, the first release with the user picker (`BaseUserSelect` and `useFetchUsers`) and the masked `CopyableText`. `npm install` fetches it.

## Get the sample

Download the latest zip from the [releases](https://github.com/thunder-id/samples/releases?q=sample%2Fb2b%2Fmanage&expanded=true), or copy the source:

```bash
npx degit thunder-id/samples/b2b/manage my-app
cd my-app
```

## Configure

1. In the ThunderID Console, create a **React** application with `http://localhost:5173` as its redirect URL, and copy its client ID. Then add `http://localhost:5173` to the allowed origins (**Settings → CORS**), or the browser blocks the sign-in requests.

2. Create your `.env`:

   ```bash
   cp .env.example .env
   ```

   | Variable                            | Description                                                                                        |
   | ----------------------------------- | -------------------------------------------------------------------------------------------------- |
   | `VITE_THUNDERID_BASE_URL`           | Base URL of your ThunderID server.                                                                 |
   | `VITE_THUNDERID_CLIENT_ID`          | Client ID of the application.                                                                      |
   | `VITE_AGENT_ONBOARDING_FLOW_HANDLE` | Handle of the flow that creates agents. Defaults to `default-agent-onboarding-flow`.               |
   | `VITE_THUNDERID_RESOURCE`           | Optional. The resource that guards admin information. A standard install already uses the default. |

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and sign in as an administrator.

Only administrators can use the **Agents** section. Anyone else can sign in, but the server turns down the requests and the page shows an error.

## Learn more

- [React quickstart guide](https://thunderid.dev/docs/getting-started/connect-your-application/react)
- [React SDK reference](https://thunderid.dev/docs/sdks-and-tools/react/overview)

## License

Apache License 2.0. See [LICENSE](https://github.com/thunder-id/samples/blob/main/LICENSE).
