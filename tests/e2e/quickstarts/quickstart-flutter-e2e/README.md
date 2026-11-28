# ThunderID Flutter Quickstart E2E

Maestro flows that drive [`quickstarts/quickstart-flutter`](../../../../quickstarts/quickstart-flutter) through real authentication against a real ThunderID server on an iOS Simulator. The sample is built from this repository with the SDK release it pins.

| Flow                           | What it checks                                                    |
| ------------------------------ | ----------------------------------------------------------------- |
| `flows/signin.yaml`            | Sign in through the server-driven credentials step, then sign out |
| `flows/signup.yaml`            | Register a new user, then sign in as them                         |
| `flows/change-credential.yaml` | Change the password from Manage Account, then change it back      |

`flows/subflows/` holds the building blocks the flows share. The flows are the ones the SDK repository's suite ran, unchanged: each platform's UI differs enough (system dialogs, field ids, scrolling) that the three mobile suites keep their own flows.

## Prerequisites

Flutter, Xcode (with an iPhone simulator), [Maestro](https://maestro.mobile.dev/getting-started/installing-maestro), `curl`, `jq`, `openssl`, `unzip`.

## Run

```bash
# Everything: start or reuse a server, provision it, build and install the sample, run the flows
./run-e2e.sh

# Iterate faster once the server is provisioned and the sample installed
./run-e2e.sh --skip-server --skip-build

# One flow
./run-e2e.sh flows/signin.yaml
```

`run-e2e.sh` uses [`shared/scripts/thunderid.sh`](../../shared/scripts/thunderid.sh) to start the server (or reuse one already serving on `SERVER_URL`), imports the sample's own `thunderid-config/thunderid-config.yaml`, creates the test user `e2e_mobile_user` / `TestPassword@123`, then writes the sample's `.env`, builds it with `flutter build ios --debug --simulator`, installs it, and opens the sign-in form once untimed (`subflows/warm-up-trust.yaml`) so a freshly booted simulator finishes its first certificate trust evaluation before any flow starts its clock. Maestro writes a JUnit report to `report.xml`. Set `SAMPLES_ROOT` to build the sample from another samples checkout. The script writes the sample's local config file (git-ignored in the sample), so point `SAMPLES_ROOT` at a copy if you keep your own config there.

Windows: the SDK repository's `run-e2e.ps1` is not ported; run the suite from macOS or Linux.

These suites do not run in CI yet. Adding them, on macOS runners with a simulator and on Linux with an Android emulator, is a follow-up.

## Things worth knowing

**The application must be `type: mobile` with `attestation.devMode: true`.** A mobile application normally proves its binary identity through platform attestation before it can start a flow directly, and `/flow/execute` rejects it with `FES-1016` otherwise. Neither Apple App Attest nor Play Integrity works on an emulated device. `devMode` is test-only and must never be enabled on a real tenant.

**`POST /import` drops the `attestation` block.** It reports success and stores `attestation: null`, so `run-e2e.sh` re-applies it over `PUT /applications/{id}`. Once the import keeps it, that step can go.

**Sign-up does not sign the user in.** The registration flow completes without an assertion, so `signup.yaml` signs in afterwards with the new credentials, which also proves the account works. Each run leaves an `e2e_signup_<timestamp>` user on the server.

**`change-credential.yaml` really changes the test user's password**, to a temporary value and back. If a run fails in between, re-running `change-credential.yaml` changes it back.

**The flows run on iOS.** The sample's iOS target accepts the local server's self-signed certificate; its Android target has no equivalent.
