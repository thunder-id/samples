#!/usr/bin/env bash
# Copyright 2026 The ThunderID Authors
# SPDX-License-Identifier: Apache-2.0
#
# Runs the quickstarts/quickstart-ios E2E suite: starts a ThunderID server (or reuses one),
# provisions the test application and user, builds the sample from this repository, installs it
# on an iOS Simulator, and drives it with Maestro. Every stage is idempotent, so re-running is
# the normal way to iterate.
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
SAMPLE_DIR="$SAMPLES_ROOT/quickstarts/quickstart-ios"
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

build_sample() {
    echo "==> Configuring the sample"
    # The sample reaches the self-signed local server because its Info.plist carries an
    # NSAllowsArbitraryLoads exemption.
    cat >"$SAMPLE_DIR/Sources/Config.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>THUNDERID_BASE_URL</key>
	<string>$SERVER_URL</string>
	<key>THUNDERID_APPLICATION_ID</key>
	<string>$APP_ID</string>
</dict>
</plist>
PLIST

    echo "==> Building and installing the sample"
    (cd "$SAMPLE_DIR" && xcodebuild \
        -project Quickstart.xcodeproj \
        -scheme Quickstart \
        -configuration Debug \
        -destination "platform=iOS Simulator,id=$SIM_UDID" \
        -derivedDataPath .build/e2e-derived \
        build)
    xcrun simctl install "$SIM_UDID" "$SAMPLE_DIR/.build/e2e-derived/Build/Products/Debug-iphonesimulator/Quickstart.app"
}

$do_server && provision_mobile_app "$CONFIG_FILE" "$APP_ID"
resolve_simulator
$do_build && build_sample
run_flows --device "$SIM_UDID"
