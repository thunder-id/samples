# ThunderID Flutter AppAuth Integration E2E

Maestro flows that drive [`integrations/app-auth-flutter`](../../../../integrations/app-auth-flutter) on an iOS Simulator. The sample signs in with [flutter_appauth](https://pub.dev/packages/flutter_appauth): the ThunderID Gate opens in the system browser, and the app gets the tokens with the authorization code and PKCE.

| Flow                 | What it checks                                                                |
| -------------------- | ----------------------------------------------------------------------------- |
| `flows/signin.yaml`  | Sign in on the Gate, see the signed-in screen, sign out (RP-initiated logout) |
| `flows/refresh.yaml` | Refresh the tokens with the refresh token, without the browser                |

## Prerequisites

Flutter, Xcode (with an iPhone simulator), [Maestro](https://maestro.mobile.dev/getting-started/installing-maestro), `curl`, `jq`, `openssl`, `unzip`.

## Run

```bash
./run-e2e.sh
./run-e2e.sh --skip-server --skip-build
./run-e2e.sh flows/signin.yaml
```

`run-e2e.sh` uses [`shared/scripts/thunderid.sh`](../../shared/scripts/thunderid.sh) to start or reuse the server, imports this folder's [`thunderid-config.yaml`](./thunderid-config.yaml) (a public client `SAMPLES_E2E_APP_AUTH_FLUTTER` with the sample's `com.example.appauth://` redirect URIs), creates the test user `e2e_mobile_user` / `TestPassword@123`, adds the server's certificate to the simulator's trusted roots, and builds the sample with `--dart-define=THUNDERID_CLIENT_ID=...`. Set `SAMPLES_ROOT` to build from another samples checkout.

The flows drive the Gate's sign-in page inside the system browser (Safari) by its placeholders and the keyboard's Next and return keys, since a tap there does not reliably move the focus. Android is not covered: it needs the server's certificate installed on the emulator by hand (see the sample's README).

These suites do not run in CI yet; adding them is a follow-up.
