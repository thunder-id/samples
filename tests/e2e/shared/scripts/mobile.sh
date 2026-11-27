#!/usr/bin/env bash
# Copyright 2026 The ThunderID Authors
# SPDX-License-Identifier: Apache-2.0
#
# Helpers the mobile suites' run-e2e.sh scripts source. They expect THUNDERID (the path to
# thunderid.sh), SCRIPT_DIR, SERVER_URL, E2E_USER, E2E_PASS and the maestro_args array to be set.

# Starts or reuses the server, imports the sample's own application config, re-applies
# attestation devMode, and makes sure the test user exists.
provision_mobile_app() {
    local config_file="$1" app_id="$2"
    "$THUNDERID" start
    "$THUNDERID" import "$config_file"

    # POST /import drops the attestation block (see the note in the config), so without this the
    # app stores attestation: null and /flow/execute rejects the sample with FES-1016.
    if [ -n "$app_id" ]; then
        echo "==> Re-applying attestation devMode over PUT (import drops it)"
        local token app_json put_resp
        token=$("$THUNDERID" token)
        app_json=$(curl -sk "$SERVER_URL/applications/$app_id" -H "Authorization: Bearer $token")
        put_resp=$(jq '.attestation = {devMode: true}' <<<"$app_json" |
            curl -sk -X PUT "$SERVER_URL/applications/$app_id" \
                -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d @-)
        if [ "$(jq -r '.attestation.devMode // false' <<<"$put_resp")" != "true" ]; then
            echo "ERROR: attestation devMode did not persist. Response: $put_resp" >&2
            exit 1
        fi
    fi

    "$THUNDERID" ensure-user "$E2E_USER" "$E2E_PASS"
}

# Resolves a booted iOS Simulator into SIM_UDID, booting one if necessary. Which iPhone models
# exist depends on the installed Xcode, so prefer SIMULATOR_NAME but fall back to any iPhone.
resolve_simulator() {
    local uuid="[0-9A-F]{8}-([0-9A-F]{4}-){3}[0-9A-F]{12}"
    SIM_UDID=$(xcrun simctl list devices booted | grep -oE "$uuid" | head -1 || true)
    if [ -n "$SIM_UDID" ]; then
        echo "==> Using the booted simulator $SIM_UDID"
        return 0
    fi
    local wanted="${SIMULATOR_NAME:-iPhone 17}"
    SIM_UDID=$(xcrun simctl list devices available | grep -m1 "$wanted (" | grep -oE "$uuid" || true)
    if [ -z "$SIM_UDID" ]; then
        SIM_UDID=$(xcrun simctl list devices available | grep -m1 -E "^[[:space:]]+iPhone " | grep -oE "$uuid" || true)
    fi
    if [ -z "$SIM_UDID" ]; then
        echo "ERROR: no available iPhone simulator." >&2
        exit 1
    fi
    echo "==> Booting simulator $SIM_UDID"
    xcrun simctl boot "$SIM_UDID"
    xcrun simctl bootstatus "$SIM_UDID" -b
}

# Runs the suite's flows (or the flows passed as arguments) with Maestro and writes a JUnit report.
# Arguments select the device, such as `--device <udid>` or `--platform android`.
run_flows() {
    command -v maestro >/dev/null 2>&1 || {
        echo "ERROR: maestro is not installed. See https://maestro.mobile.dev/getting-started/installing-maestro" >&2
        exit 1
    }
    # Check the length before expanding: under `set -u`, bash 3.2 (the macOS default) treats an
    # empty array expansion as an unbound variable.
    local target
    if [ "${#maestro_args[@]}" -eq 0 ]; then
        target=("flows/")
    else
        target=("${maestro_args[@]}")
    fi
    echo "==> Running Maestro"
    (cd "$SCRIPT_DIR" && maestro "$@" test "${target[@]}" \
        --format=JUNIT \
        --output=report.xml \
        -e E2E_USERNAME="$E2E_USER" \
        -e E2E_PASSWORD="$E2E_PASS")
}
