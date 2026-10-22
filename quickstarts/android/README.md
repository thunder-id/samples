![ThunderID Android Quickstart](https://raw.githubusercontent.com/thunder-id/samples/main/.github/assets/banners/quickstarts-android.png)

# ThunderID Android Quickstart

A Jetpack Compose app that signs users in with the [ThunderID Android SDK](https://github.com/thunder-id/android-sdks), using app-native authentication: sign-in and sign-up run inside the app through the Flow Execution API, with no browser redirect. It depends on the published SDK from [JitPack](https://jitpack.io/#thunder-id/android-sdks) (`com.github.thunder-id:android-sdks`).

What the app does:

1. Opens signed out, on the sign-in screen.
2. Starts sign-in or sign-up as an app-native flow, which the user completes in the app.
3. After sign-in, shows the user's profile, token details for debugging, and a sign-out button. Sign-up creates the account without starting a session, so it returns to the landing screen to sign in with the new credentials.
4. Signing out ends the session and returns to the sign-in screen.

## Prerequisites

- JDK 17 or later
- Android Studio, or the Android SDK with `ANDROID_HOME` set
- An Android emulator or device running API 26 or later
- A running ThunderID server (`https://localhost:8090` by default)

## Get the sample

Download the latest zip from the [releases](https://github.com/thunder-id/samples/releases?q=sample%2Fquickstarts%2Fandroid&expanded=true), or copy the source:

```bash
npx degit thunder-id/samples/quickstarts/android my-app
cd my-app
```

## Configure

1. In the ThunderID Console, create an **Android** application and copy its application ID. App-native authentication needs no OAuth2 client ID or redirect URL.

2. Create your `config.properties`:

   ```bash
   cp config.properties.example config.properties
   ```

   | Variable | Description |
   |---|---|
   | `THUNDERID_BASE_URL` | Base URL of your ThunderID server (HTTPS). |
   | `THUNDERID_APPLICATION_ID` | Application ID of the application. |
   | `THUNDERID_ATTESTATION_ENABLED` | Optional. `true` sends a Google Play Integrity token with each flow. |
   | `THUNDERID_CLOUD_PROJECT_NUMBER` | Optional. Google Cloud project number used for Play Integrity. |

   `config.properties` is gitignored. Each value can also be set as an environment variable of the same name.

   A ThunderID server on your machine is not at `localhost` from the device's point of view:

   - **Emulator**: use `https://10.0.2.2:8090`, the emulator's alias for your machine. This is the default in the example file.
   - **Physical device**: run `adb reverse tcp:8090 tcp:8090` and use `https://localhost:8090`, or use your machine's LAN IP.

## Run

Open the project in Android Studio, sync Gradle, and run it on an emulator or device. From the command line:

```bash
./gradlew installDebug
```

## Where things are

| Path | What it is |
|---|---|
| `config.properties.example` | The configuration template |
| `assetlinks.json.example` | Digital Asset Links template for passkeys |
| `thunderid-config/thunderid-config.yaml` | The application the [Android SDK end-to-end suite](https://github.com/thunder-id/android-sdks/tree/main/tests/e2e) provisions on a test server. The suite fetches this sample and builds it against the SDK checkout under test. |

## Learn more

- [Android quickstart guide](https://thunderid.dev/docs/getting-started/connect-your-application/android)
- [Try the Android sample app](https://thunderid.dev/docs/sdks-and-tools/android/guides/try-the-sample-app), including Google Play Integrity attestation and passkey setup
- [Android SDK reference](https://thunderid.dev/docs/sdks-and-tools/android/overview)

## License

Apache License 2.0. See [LICENSE](https://github.com/thunder-id/samples/blob/main/LICENSE).
