#!/usr/bin/env bash
# Copyright 2026 The ThunderID Authors
# SPDX-License-Identifier: Apache-2.0
#
# Runs the quickstarts/quickstart-android E2E suite: starts a ThunderID server (or reuses one),
# provisions the test application and user, builds the sample from this repository, installs it
# on a running Android emulator, and drives it with Maestro. Every stage is idempotent, so re-running is
# the normal way to iterate.
#
# Usage:
#   ./run-e2e.sh                      Everything
#   ./run-e2e.sh --skip-server        Server already running and provisioned
#   ./run-e2e.sh --skip-build         Sample already installed on the device
#   ./run-e2e.sh flows/signin.yaml    Run one flow instead of the whole suite
#
#   Any other argument is passed through to Maestro.
#
# Environment:
#   SAMPLES_ROOT    The samples checkout to build the sample from (default: this repository)
#   (A running Android emulator, reachable with adb, is required.)
#   E2E_USERNAME    Test user (default e2e_mobile_user)
#   E2E_PASSWORD    Test user password (default TestPassword@123)
#   SERVER_URL, ADMIN_USERNAME, ADMIN_PASSWORD, THUNDERID_VERSION: see ../../shared/scripts/thunderid.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
E2E_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
THUNDERID="$E2E_ROOT/shared/scripts/thunderid.sh"
SAMPLES_ROOT="${SAMPLES_ROOT:-$(cd "$E2E_ROOT/../.." && pwd)}"
SAMPLE_DIR="$SAMPLES_ROOT/quickstarts/quickstart-android"
CONFIG_FILE="$SAMPLE_DIR/thunderid-config/thunderid-config.yaml"

export SERVER_URL="${SERVER_URL:-https://localhost:8090}"
E2E_USER="${E2E_USERNAME:-e2e_mobile_user}"
E2E_PASS="${E2E_PASSWORD:-TestPassword@123}"

# Must match the `id` in $CONFIG_FILE.
APP_ID="019e5b10-1001-7a2b-9c3d-4e5f60718293"

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

# The Android emulator spawns crashpad_handler as a detached child that outlives it, which can
# deadlock reactivecircus/android-emulator-runner's shutdown in CI
# (ReactiveCircus/android-emulator-runner#385). Stopping it on exit is the known workaround.
terminate_crashpad_handler() {
    pkill -SIGTERM crashpad_handler 2>/dev/null || true
    sleep 5
    pkill -SIGKILL crashpad_handler 2>/dev/null || true
}
trap terminate_crashpad_handler EXIT

build_sample() {
    echo "==> Configuring the sample"
    # 10.0.2.2 is the emulator's alias for the host loopback, where the server listens. The debug
    # build sets allowInsecureConnections, which lets the app accept the self-signed certificate.
    local host_url
    host_url=$(sed -E 's#://(localhost|127\.0\.0\.1)#://10.0.2.2#' <<<"$SERVER_URL")
    cat >"$SAMPLE_DIR/config.properties" <<PROPS
THUNDERID_BASE_URL=$host_url
THUNDERID_APPLICATION_ID=$APP_ID
THUNDERID_ATTESTATION_ENABLED=false
THUNDERID_CLOUD_PROJECT_NUMBER=
PROPS

    echo "==> Building and installing the sample"
    (cd "$SAMPLE_DIR" && ./gradlew installDebug)
}

$do_server && provision_mobile_app "$CONFIG_FILE" "$APP_ID"
command -v adb >/dev/null 2>&1 || { echo "ERROR: adb is required (Android SDK platform-tools)." >&2; exit 1; }
$do_build && build_sample
run_flows --platform android
