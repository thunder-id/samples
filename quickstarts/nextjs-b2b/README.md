![ThunderID Next.js B2B Quickstart](https://raw.githubusercontent.com/thunder-id/samples/main/.github/assets/banners/quickstarts-nextjs-b2b.png)

# ThunderID Next.js B2B Quickstart

A Next.js App Router app for a B2B SaaS product, built with the [ThunderID Next.js SDK](https://www.npmjs.com/package/@thunderid/nextjs) (`@thunderid/nextjs`).

| What it shows | How |
|---|---|
| Company sign-up | The sign-in page offers **Register your company**. It creates the company as an organization unit, creates the first admin and signs them in. |
| Account inside the company, or shared | Sign-up asks where the account lives. **My account belongs to this company** creates it inside the company. **I work with several companies** creates it in the Default organization unit and shares it into the company, so it can join more companies later. |
| Organization and roles in the token | The page reads the access token on the server and shows its `ouId`, `ouHandle`, `ouName`, `roles` and `scope`. |
| Switching companies | `OrganizationUnitSwitcher` lists the companies the account belongs to. See [Switching companies](#switching-companies). |
| Enterprise SSO per company | A company admin adds an OpenID Connect identity provider through the SDK's management fetcher, and selects it with `FlowVariablesForm`. Employees then choose **Sign in with enterprise SSO** and enter the company's handle. |

## Prerequisites

- Node.js 20.9 or later
- A running ThunderID server (`https://localhost:8090` by default), built from the `main` branch. The sample uses features newer than ThunderID 2.0.0-m1, such as the `org` permission.

## Get the sample

Download the latest zip from the [releases](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fnextjs-b2b&expanded=true), or copy the source:

```bash
npx degit thunder-id/samples/quickstarts/nextjs-b2b my-app
cd my-app
```

## Configure

### Import the ThunderID resources

`thunderid-config/thunderid-config.yaml` creates everything the app needs in the Default organization unit, with fixed IDs so the app's configuration works unchanged. Every company that signs up becomes a child of the Default organization unit. Import it in the ThunderID Console:

1. Generate a client secret for the application, for example with `openssl rand -base64 32`, and set it as `NEXTJS_B2B_CLIENT_SECRET` in `thunderid-config/thunderid.env`. The sample ships without one, and the Console does not import the file until it is set. You can also enter it in the Console's **Environment variables** editor during the import. Keep the value for the app's `.env`.
2. Sign in to the Console. With the quickstart image it is the Control Plane console, `https://localhost:8095/console`.
3. Choose **Import / Export**, then **Import**. Upload `thunderid-config/thunderid-config.yaml` as the configuration file and `thunderid-config/thunderid.env` as the environment variables file.
4. Choose **Continue**, then **Import configuration**.

| Resource | Name | What it does |
|---|---|---|
| User type | Next.js B2B User (`nextjs-b2b-user`) | The account schema, with self-registration on. Usable in every company. |
| Server config | `defaultResourceServer` | Makes the System resource server the default. The app names no resource when it signs in or switches, so its tokens are issued for the System resource server and an admin's token carries `org`. |
| Role | Next.js B2B Admin | Grants the `org` permission, which manages the organization the token names. The role is shared with every company. |
| Role | Next.js B2B Member | Grants no permission. The role is shared with every company. |
| Flow | Next.js B2B Quickstart Company Sign-up | Creates the company and its first admin, with the account inside the company or shared into it |
| Flow | Next.js B2B Quickstart Sign-in | Password, enterprise SSO, or company sign-up. Keeps a single sign-on session, so a switch does not ask for the password again. Shared with every company, which may set `enterpriseIdp`. |
| Application | Next.js B2B Quickstart | Confidential client with PKCE, redirecting to `http://localhost:3000`. Allows the token exchange grant, so the app's server can switch companies with its device secret. The application is shared with every company. |

The import replaces the `defaultResourceServer` setting, which only the Control Plane writes, so import there. Imported straight into a Data Plane, it is refused.

`thunderid.env` sets two variables:

| Variable | Description |
|---|---|
| `NEXTJS_B2B_CLIENT_ID` | Client ID of the application. Defaults to `NEXTJS_B2B_QUICKSTART`. |
| `NEXTJS_B2B_CLIENT_SECRET` | Client secret of the application. Empty in the sample: set your own before you import, and the same value as `THUNDERID_CLIENT_SECRET` in `.env`. |

### Configure the app

```bash
cp .env.example .env
```

Set `THUNDERID_CLIENT_SECRET` to the client secret you set as `NEXTJS_B2B_CLIENT_SECRET`, and `THUNDERID_SECRET` to a long random string, for example from `openssl rand -base64 32`. The other defaults match the import.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_THUNDERID_BASE_URL` | Base URL of your ThunderID server |
| `NEXT_PUBLIC_THUNDERID_CLIENT_ID`, `THUNDERID_CLIENT_SECRET` | Credentials of the application |
| `NEXT_PUBLIC_THUNDERID_AFTER_SIGN_IN_URL` | Where ThunderID returns the browser after sign-in |
| `NEXT_PUBLIC_THUNDERID_AFTER_SIGN_OUT_URL` | Where ThunderID returns the browser after sign-out |
| `NEXT_PUBLIC_THUNDERID_SCOPES` | `ou` and `roles` put the company and the roles held there into the tokens. `org` asks for the permission a company admin needs. `device_sso` asks for a device secret, which the server uses to switch companies. |
| `NEXT_PUBLIC_THUNDERID_SIGN_IN_FLOW_ID` | ID of the sign-in flow, whose `enterpriseIdp` variable a company admin sets |
| `THUNDERID_SECRET` | Signs the session cookie |
| `NODE_TLS_REJECT_UNAUTHORIZED` | Set to `0` in the example to accept a local server's self-signed certificate. Local development only. |

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Try it

### A company with its own accounts

1. Choose **Sign in**, then **Register your company** on the ThunderID sign-in page.
2. Choose **My account belongs to this company**. Enter a username, an email and a password, then `Northstar Labs` as the company name and `northstar` as its handle.
3. You land in the app, signed in to Northstar Labs. The access token names it in `ouId`, `ouHandle` and `ouName`, lists `Next.js B2B Admin` in `roles`, and carries `org` in `scope`.

### Plug in the company's identity provider

1. Register an OpenID Connect application in your identity provider, with the callback URL the app shows, `https://localhost:8090/gate/callback`.
2. In the app's **Enterprise SSO** section, choose **Create a connection** and enter the application's client ID, client secret and endpoints.
3. Select the new connection and choose **Save changes**.
4. Sign out, choose **Sign in**, then **Sign in with enterprise SSO**, and enter `northstar`. ThunderID sends you to the company's identity provider. A first-time employee joins the company as a `Next.js B2B Member`.

### One account across several companies

Until the sample has a flow that invites an existing account into another company, create an account that belongs to every company in the Console:

1. Register a second company, such as `Initech` with the handle `initech`, so there are two to switch between.
2. In the Control Plane console, `https://localhost:8095/console`, open **Users** and choose **Add user**. Select the user type **Next.js B2B User**, which places the account in the Default organization unit. Enter a username, such as `nextjs-consultant`, an email and a password, then choose **Create user**.
3. Open the account and select the **Affiliations** tab. Choose **Default and chosen organization units**, keep **All child organization units**, and choose **Save**. The account now belongs to every company beneath the Default organization unit, including the ones that sign up later.
4. Sign out of the app, choose **Sign in**, and sign in with the account. ThunderID asks which company to sign in to. Pick **northstar**.
5. Open the organization menu in the header and pick **Initech**. The page switches to Initech without leaving the app or asking for the password.

The account holds no role in these companies, so the token's `roles` is empty and the Enterprise SSO section does not show.

### Switching companies

The organization menu in the header lists every company the account belongs to. Picking one switches the session to that company without leaving the page: the app's server exchanges the session's device secret at the company's token endpoint and rewrites the session cookie with the new tokens. The device secret stays in the server's session store, and the browser never receives it.

When the session holds no device secret, for example after the dev server restarts, the switch sends the browser to that company's sign-in instead, where the single sign-on session signs the user in without the password.

## How it works

- **One application, many companies.** The application, both roles and the sign-in flow belong to the Default organization unit and are shared with every child, so a company works the moment it signs up.
- **Sign-up.** The sign-up flow creates the company beneath the Default organization unit (`OUExecutor`). For an account inside the company, it creates the user there and assigns `Next.js B2B Admin`. For a shared account, it creates the user in the Default organization unit, shares the user into the company (`SharingExecutor`) and assigns `Next.js B2B Admin` there (`RoleExecutor`). The sign-in flow calls the sign-up flow, so the new admin lands in the app signed in.
- **Which company a sign-in lands in.** Enterprise SSO decides it from the handle. A password sign-in picks the one company the user belongs to, or asks.
- **What a company admin can do.** The `Next.js B2B Admin` role grants `org` on the System resource server. On a Data Plane, `org` reaches only the organization unit the token names. The SDK sends the management calls from the server with the admin's session, so the admin's changes apply to their own company and the app's browser code never receives the token.
- **Enterprise SSO.** The sign-in flow declares `enterpriseIdp` as a connection variable, and its sharing policy lets every company set its own value. The OpenID Connect step reads the connection from `{{var(enterpriseIdp)}}`.

## Before you go to production

A company admin's token carries `org`, which manages everything in their company. Grant it only to people you trust with the whole company, or route management calls through your own server routes that check each call and use a client that holds the permission, as the [Wayfinder Enterprise sample](https://github.com/thunder-id/samples/tree/main/b2b/wayfinder-enterprise) does.

## Learn more

- [Secure B2B SaaS applications](https://thunderid.dev/docs/next/use-cases/b2b/overview)
- [Next.js SDK reference](https://thunderid.dev/docs/next/sdks-and-tools/nextjs/overview)

## License

Apache License 2.0. See [LICENSE](https://github.com/thunder-id/samples/blob/main/LICENSE).
