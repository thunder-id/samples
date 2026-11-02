![ThunderID iOS Quickstart](https://raw.githubusercontent.com/thunder-id/samples/main/.github/assets/banners/quickstarts-ios.png)

# ThunderID iOS Quickstart

A SwiftUI app that signs users in with the [ThunderID iOS SDK](https://github.com/thunder-id/ios-sdks), using app-native authentication: sign-in and sign-up run inside the app through the Flow Execution API, with no browser redirect. It depends on the published SDK release through Swift Package Manager, so it builds without a checkout of the SDK.

What the app does:

1. Opens signed out, on the sign-in screen.
2. Starts sign-in or sign-up as an app-native flow, which the user completes in the app.
3. After sign-in, shows the user's profile, token details for debugging, and a sign-out button. Sign-up creates the account without starting a session, so it returns to the landing screen to sign in with the new credentials.
4. Signing out ends the session and returns to the sign-in screen.

## Prerequisites

- Xcode 15 or later
- An iOS simulator or device running iOS 16 or later
- A running ThunderID server (`https://localhost:8090` by default)

## Get the sample

Download the latest zip from the [releases](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fios&expanded=true), or copy the source:

```bash
npx degit thunder-id/samples/quickstarts/ios my-app
cd my-app
```

## Configure

1. In the ThunderID Console, create an **iOS** application and copy its application ID. App-native authentication needs no OAuth2 client ID or redirect URL.

2. Create your `Config.plist`:

   ```bash
   cp Sources/Config.plist.example Sources/Config.plist
   ```

   | Key | Description |
   |---|---|
   | `THUNDERID_BASE_URL` | Base URL of your ThunderID server (HTTPS). |
   | `THUNDERID_APPLICATION_ID` | Application ID of the application. |
   | `THUNDERID_ATTESTATION_ENABLED` | Optional. `true` turns on platform attestation. |

   `Sources/Config.plist` is gitignored, so your local values are not committed.

## Run

Open `Quickstart.xcodeproj` in Xcode and run the `Quickstart` scheme on a simulator or device.

## Where things are

| Path | What it is |
|---|---|
| `Sources/` | The SwiftUI app and `Config.plist.example` |
| `Quickstart.xcodeproj` | Xcode project, with the SDK as a remote Swift package |
| `Package.swift` | The same app as a Swift package |
| `thunderid-config/thunderid-config.yaml` | The application the [iOS SDK end-to-end suite](https://github.com/thunder-id/ios-sdks/tree/main/Tests/e2e) imports into ThunderID before it drives this sample |

## Learn more

- [iOS quickstart guide](https://thunderid.dev/docs/getting-started/connect-your-application/ios)
- [Try the iOS sample app](https://thunderid.dev/docs/sdks-and-tools/ios/guides/try-the-sample-app), including attestation and passkey setup
- [iOS SDK reference](https://thunderid.dev/docs/sdks-and-tools/ios/overview)

## License

Apache License 2.0. See [LICENSE](https://github.com/thunder-id/samples/blob/main/LICENSE).
