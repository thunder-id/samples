#!/usr/bin/env bash
# Copyright 2026 The ThunderID Authors
# SPDX-License-Identifier: Apache-2.0
#
# Runs the integrations/app-auth-flutter E2E suite on an iOS Simulator: starts a ThunderID server
# (or reuses one), registers the suite's OAuth2 client (thunderid-config.yaml) and test user, makes
# the simulator trust the server's certificate, builds and installs the sample from this repository,
# and drives it with Maestro. Every stage is idempotent.
#
# Usage:
#   ./run-e2e.sh                      Everything
#   ./run-e2e.sh --skip-server        Server already running and provisioned
#   ./run-e2e.sh --skip-build         Sample already installed on the simulator
#   ./run-e2e.sh flows/signin.yaml    Run one flow instead of the whole suite
#
#   Any other argument is passed through to Maestro.
#
# Environment:
#   SAMPLES_ROOT    The samples checkout to build the sample from (default: this repository)
#   SIMULATOR_NAME  Simulator to boot when none is booted (default iPhone 17, else any iPhone)
#   E2E_USERNAME    Test user (default e2e_mobile_user)
#   E2E_PASSWORD    Test user password (default TestPassword@123)
#   SERVER_URL, ADMIN_USERNAME, ADMIN_PASSWORD, THUNDERID_VERSION: see ../../shared/scripts/thunderid.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
E2E_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
THUNDERID="$E2E_ROOT/shared/scripts/thunderid.sh"
SAMPLES_ROOT="${SAMPLES_ROOT:-$(cd "$E2E_ROOT/../.." && pwd)}"
SAMPLE_DIR="$SAMPLES_ROOT/integrations/app-auth-flutter"

export SERVER_URL="${SERVER_URL:-https://localhost:8090}"
E2E_USER="${E2E_USERNAME:-e2e_mobile_user}"
E2E_PASS="${E2E_PASSWORD:-TestPassword@123}"

# Must match the clientId in thunderid-config.yaml.
CLIENT_ID="SAMPLES_E2E_APP_AUTH_FLUTTER"

do_server=true
do_build=true
maestro_args=()
for arg in "$@"; do
    case "$arg" in
        --skip-server) do_server=false ;;
        --skip-build) do_build=false ;;
        -h | --help) sed -n '5,24p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0 ;;
        *) maestro_args+=("$arg") ;;
    esac
done

# shellcheck source=../../shared/scripts/mobile.sh
source "$E2E_ROOT/shared/scripts/mobile.sh"

# The sample reaches the server through the system browser and flutter_appauth, which both reject
# a self-signed certificate the simulator does not trust. Add the server's own certificate as a
# root, read from the server itself so this works for a reused server too.
trust_server_certificate() {
    local hostport cert
    hostport=$(sed -E 's#^[a-z]+://([^/]+).*#\1#' <<<"$SERVER_URL")
    cert=$(mktemp)
    # s_client exits non-zero when stdin closes, which pipefail would turn into a failure.
    { openssl s_client -connect "$hostport" -showcerts </dev/null 2>/dev/null || true; } |
        awk '/BEGIN CERTIFICATE/,/END CERTIFICATE/' >"$cert"
    [ -s "$cert" ] || { echo "ERROR: could not read the certificate of $SERVER_URL." >&2; exit 1; }
    echo "==> Trusting the server certificate on simulator $SIM_UDID"
    xcrun simctl keychain "$SIM_UDID" add-root-cert "$cert"
    rm -f "$cert"
}

build_sample() {
    echo "==> Building and installing the sample"
    (cd "$SAMPLE_DIR" && flutter pub get && flutter build ios --debug --simulator \
        --dart-define=THUNDERID_CLIENT_ID="$CLIENT_ID" \
        --dart-define=THUNDERID_ISSUER="$SERVER_URL")
    xcrun simctl install "$SIM_UDID" "$SAMPLE_DIR/build/ios/iphonesimulator/Runner.app"
}

if $do_server; then
    "$THUNDERID" start
    "$THUNDERID" import "$SCRIPT_DIR/thunderid-config.yaml"
    "$THUNDERID" ensure-user "$E2E_USER" "$E2E_PASS"
fi
resolve_simulator
trust_server_certificate
$do_build && build_sample
run_flows --device "$SIM_UDID"
