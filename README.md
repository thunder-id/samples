![ThunderID Samples](https://raw.githubusercontent.com/thunder-id/samples/main/.github/assets/banners/samples.png)

Sample apps for ThunderID. Ready-to-run apps that show ThunderID features in action, organized by platform or feature area and released as downloadable source zips. Each quickstart uses the published release of its SDK, so it runs on its own.

## Samples

### Quickstarts

The minimal app per platform that the [ThunderID docs](https://thunderid.dev) quickstarts walk through.

| Sample | Release | Description |
|---|---|---|
| [`quickstart-android`](quickstarts/quickstart-android) | [![release](https://img.shields.io/github/v/release/thunder-id/samples?filter=sample/quickstarts/quickstart-android/*)](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fquickstart-android&expanded=true) | Android (Jetpack Compose) app using the [ThunderID Android SDK](https://github.com/thunder-id/android-sdks) |
| [`quickstart-browser`](quickstarts/quickstart-browser) | [![release](https://img.shields.io/github/v/release/thunder-id/samples?filter=sample/quickstarts/quickstart-browser/*)](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fquickstart-browser&expanded=true) | Framework-free JavaScript app using `@thunderid/browser` |
| [`quickstart-express`](quickstarts/quickstart-express) | [![release](https://img.shields.io/github/v/release/thunder-id/samples?filter=sample/quickstarts/quickstart-express/*)](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fquickstart-express&expanded=true) | Express server app using `@thunderid/express` |
| [`quickstart-flutter`](quickstarts/quickstart-flutter) | [![release](https://img.shields.io/github/v/release/thunder-id/samples?filter=sample/quickstarts/quickstart-flutter/*)](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fquickstart-flutter&expanded=true) | Flutter app using the [`thunderid_flutter`](https://pub.dev/packages/thunderid_flutter) package |
| [`quickstart-ios`](quickstarts/quickstart-ios) | [![release](https://img.shields.io/github/v/release/thunder-id/samples?filter=sample/quickstarts/quickstart-ios/*)](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fquickstart-ios&expanded=true) | iOS (SwiftUI) app using the [ThunderID iOS SDK](https://github.com/thunder-id/ios-sdks) |
| [`quickstart-nextjs`](quickstarts/quickstart-nextjs) | [![release](https://img.shields.io/github/v/release/thunder-id/samples?filter=sample/quickstarts/quickstart-nextjs/*)](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fquickstart-nextjs&expanded=true) | Next.js app using `@thunderid/nextjs` |
| [`quickstart-nextjs-b2b`](quickstarts/quickstart-nextjs-b2b) | [![release](https://img.shields.io/github/v/release/thunder-id/samples?filter=sample/quickstarts/quickstart-nextjs-b2b/*)](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fquickstart-nextjs-b2b&expanded=true) | B2B Next.js app using `@thunderid/nextjs` |
| [`quickstart-node`](quickstarts/quickstart-node) | [![release](https://img.shields.io/github/v/release/thunder-id/samples?filter=sample/quickstarts/quickstart-node/*)](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fquickstart-node&expanded=true) | Node.js service using `@thunderid/node` for machine-to-machine access |
| [`quickstart-nuxt`](quickstarts/quickstart-nuxt) | [![release](https://img.shields.io/github/v/release/thunder-id/samples?filter=sample/quickstarts/quickstart-nuxt/*)](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fquickstart-nuxt&expanded=true) | Nuxt app using `@thunderid/nuxt` |
| [`quickstart-react`](quickstarts/quickstart-react) | [![release](https://img.shields.io/github/v/release/thunder-id/samples?filter=sample/quickstarts/quickstart-react/*)](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fquickstart-react&expanded=true) | React app using `@thunderid/react` |
| [`quickstart-react-b2b`](quickstarts/quickstart-react-b2b) | [![release](https://img.shields.io/github/v/release/thunder-id/samples?filter=sample/quickstarts/quickstart-react-b2b/*)](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fquickstart-react-b2b&expanded=true) | B2B React app using `@thunderid/react` |
| [`quickstart-vue`](quickstarts/quickstart-vue) | [![release](https://img.shields.io/github/v/release/thunder-id/samples?filter=sample/quickstarts/quickstart-vue/*)](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fquickstart-vue&expanded=true) | Vue app using `@thunderid/vue` |

### Integrations

ThunderID used through a third-party library.

| Sample | Release | Description |
|---|---|---|
| [`app-auth-flutter`](integrations/app-auth-flutter) | [![release](https://img.shields.io/github/v/release/thunder-id/samples?filter=sample/integrations/app-auth-flutter/*)](https://github.com/thunder-id/samples/releases?q=sample%2Fintegrations%2Fapp-auth-flutter&expanded=true) | Flutter sign-in with the `flutter_appauth` plugin |
| [`better-auth-nextjs`](integrations/better-auth-nextjs) | [![release](https://img.shields.io/github/v/release/thunder-id/samples?filter=sample/integrations/better-auth-nextjs/*)](https://github.com/thunder-id/samples/releases?q=sample%2Fintegrations%2Fbetter-auth-nextjs&expanded=true) | Next.js sign-in with [Better Auth](https://better-auth.com) and the `@thunderid/better-auth` provider helper |

### Patterns

Architectures that span more than one app.

| Sample | Release | Description |
|---|---|---|
| [`bff-react-express`](patterns/bff-react-express) | [![release](https://img.shields.io/github/v/release/thunder-id/samples?filter=sample/patterns/bff-react-express/*)](https://github.com/thunder-id/samples/releases?q=sample%2Fpatterns%2Fbff-react-express&expanded=true) | React app that signs in through an Express Backend for Frontend, with back-channel logout |

### Self-service

Apps where a signed-in user manages their own account.

| Sample | Release | Description |
|---|---|---|
| [`myaccount-react`](self-service/myaccount-react) | [![release](https://img.shields.io/github/v/release/thunder-id/samples?filter=sample/self-service/myaccount-react/*)](https://github.com/thunder-id/samples/releases?q=sample%2Fself-service%2Fmyaccount-react&expanded=true) | React account app for viewing and editing a profile and changing a password |

### Management

Apps where an administrator manages an organization's ThunderID resources.

| Sample | Release | Description |
|---|---|---|
| [`admin-react`](management/admin-react) | [![release](https://img.shields.io/github/v/release/thunder-id/samples?filter=sample/management/admin-react/*)](https://github.com/thunder-id/samples/releases?q=sample%2Fmanagement%2Fadmin-react&expanded=true) | React admin app for managing users, groups, roles, applications, agents, flows, projects and organization units |

### B2B

Apps that serve many business customers, each one an organization of its own.

| Sample | Release | Description |
|---|---|---|
| [`wayfinder-enterprise-nextjs`](b2b/wayfinder-enterprise-nextjs) | [![release](https://img.shields.io/github/v/release/thunder-id/samples?filter=sample/b2b/wayfinder-enterprise-nextjs/*)](https://github.com/thunder-id/samples/releases?q=sample%2Fb2b%2Fwayfinder-enterprise-nextjs&expanded=true) | Next.js travel management app where companies sign up as organizations, manage their team and plug in their own identity provider |

## Contributing

Please refer to the [Contributing Guide](https://thunderid.dev/community/overview) for the different ways to contribute to this project and the relevant guidelines.

For code contributions, refer to the [Contributing Code](https://thunderid.dev/community/contributing/contributing-code/prerequisites/) section for details on the prerequisites and instructions for running ThunderID in development mode.

## License

This project is licensed under the [Apache License 2.0](https://github.com/thunder-id/thunderid/blob/main/LICENSE).
