![ThunderID Flutter Quickstart](https://raw.githubusercontent.com/thunder-id/samples/main/.github/assets/banners/quickstarts-flutter.png)

# ThunderID Flutter Quickstart

A Flutter app for iOS and Android that signs users in with the [`thunderid_flutter`](https://pub.dev/packages/thunderid_flutter) package, using app-native authentication: sign-in and sign-up run inside the app through the Flow Execution API, with no browser redirect.

What the app does:

1. Opens signed out, on the sign-in screen.
2. Starts sign-in or sign-up as an app-native flow, which the user completes in the app.
3. After sign-in, shows the user's profile, token details for debugging, and a sign-out button. Sign-up creates the account without starting a session, so it returns to the landing screen to sign in with the new credentials.
4. Signing out ends the session and returns to the sign-in screen.

## Prerequisites

- Flutter 3.16 or later
- An Android emulator or device, or an iOS simulator or device
- A running ThunderID server (`https://localhost:8090` by default)

## Get the sample

Download the latest zip from the [releases](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fflutter&expanded=true), or copy the source:

```bash
npx degit thunder-id/samples/quickstarts/flutter my-app
cd my-app
```

## Configure

1. In the ThunderID Console, create a **Flutter** application and copy its application ID. App-native authentication needs no OAuth2 client ID or redirect URL.

2. Create your `.env`:

   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   |---|---|
   | `THUNDERID_BASE_URL` | Base URL of your ThunderID server. |
   | `THUNDERID_APP_ID` | Application ID of the application. |
   | `THUNDERID_ATTESTATION_ENABLED` | Optional. `true` turns on platform attestation. |
   | `THUNDERID_CLOUD_PROJECT_NUMBER` | Optional. Google Cloud project number used for Play Integrity attestation on Android. |

## Run

```bash
flutter pub get
flutter run
```

## Where things are

| Path | What it is |
|---|---|
| `lib/` | The app |
| `assetlinks.json.example` | Digital Asset Links template for passkeys on Android |
| `thunderid-config/thunderid-config.yaml` | The application the [Flutter SDK end-to-end suite](https://github.com/thunder-id/flutter-sdks) provisions on a test server before it drives this sample |

## Learn more

- [Flutter quickstart guide](https://thunderid.dev/docs/getting-started/connect-your-application/flutter)
- [Try the Flutter sample app](https://thunderid.dev/docs/sdks-and-tools/flutter/guides/try-the-sample-app), including attestation and passkey setup
- [Flutter SDK reference](https://thunderid.dev/docs/sdks-and-tools/flutter/overview)

## License

Apache License 2.0. See [LICENSE](https://github.com/thunder-id/samples/blob/main/LICENSE).
