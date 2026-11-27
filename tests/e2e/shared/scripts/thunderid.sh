#!/usr/bin/env bash
# Copyright 2026 The ThunderID Authors
# SPDX-License-Identifier: Apache-2.0
#
# thunderid.sh: the ThunderID server plumbing every E2E suite in this repository shares, the web
# (Playwright) suites in CI and the mobile (Maestro) suites locally.
#
# Usage:
#   thunderid.sh start                      Download the latest release (or THUNDERID_VERSION), set
#                                           it up and start it. Reuses a server already serving.
#   thunderid.sh stop                       Stop the server this script started.
#   thunderid.sh restart                    Stop, then start the installed release again. Some
#                                           server configs, such as CORS, apply on start.
#   thunderid.sh wait                       Wait until the server answers its liveness check.
#   thunderid.sh token                      Print an admin access token.
#   thunderid.sh import <yaml> [env-file]   POST /import a declarative config, with the variables
#                                           of a KEY=VALUE env file (a JSON array value stays an
#                                           array). Upserts, so re-running is safe.
#   thunderid.sh ensure-user <user> <pass>  Create a Person user unless the username exists.
#
# Environment:
#   SERVER_URL         Where the server is reachable (default https://localhost:8090)
#   ADMIN_USERNAME     Admin user (default admin)
#   ADMIN_PASSWORD     Admin password (default admin)
#   ADMIN_TOKEN        Reuse this admin token instead of minting one
#   THUNDERID_VERSION  Release to run, without the leading "v" (default: latest release)
#   INSTALL_DIR        Where to unpack the release (default tests/e2e/.thunderid-server)
#   GITHUB_TOKEN       Optional. Authenticates the latest-release lookup against the API rate limit
#
# Why not `npx thunderid`? It renders an interactive TUI that needs a terminal, which a CI runner
# does not have. The release's own setup.sh and start.sh take the same arguments without one.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
E2E_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

SERVER_URL="${SERVER_URL:-https://localhost:8090}"
ADMIN_USER="${ADMIN_USERNAME:-admin}"
ADMIN_PASS="${ADMIN_PASSWORD:-admin}"
INSTALL_DIR="${INSTALL_DIR:-$E2E_ROOT/.thunderid-server}"

require() {
    local tool
    for tool in "$@"; do
        command -v "$tool" >/dev/null 2>&1 || { echo "ERROR: $tool is required but not installed." >&2; exit 1; }
    done
}

is_up() {
    curl -sk -o /dev/null --max-time 3 -f "$SERVER_URL/health/liveness" 2>/dev/null
}

wait_for_server() {
    echo "==> Waiting for $SERVER_URL" >&2
    local i
    for i in $(seq 1 120); do
        if is_up; then
            echo "    up" >&2
            return 0
        fi
        sleep 2
    done
    echo "ERROR: the server did not come up within 240s." >&2
    [ -f "$INSTALL_DIR/server.log" ] && tail -50 "$INSTALL_DIR/server.log" >&2
    exit 1
}

# The installed release, recorded by `start` so `restart` and `stop` find it again.
dist_home() {
    cat "$INSTALL_DIR/dist-home" 2>/dev/null || true
}

launch() {
    local home="$1"
    echo "==> Starting the server from $home" >&2
    # The server has to outlive the step that starts it, which means leaving this process group.
    # setsid does that but does not exist on macOS, so fall back to Python, whose
    # start_new_session flag calls setsid in the child.
    if command -v setsid >/dev/null 2>&1; then
        (cd "$home" && setsid ./start.sh >>"$INSTALL_DIR/server.log" 2>&1 </dev/null &)
    else
        python3 - "$home" "$INSTALL_DIR/server.log" <<'PY'
import subprocess
import sys

home, log_path = sys.argv[1], sys.argv[2]
with open(log_path, "ab") as log:
    subprocess.Popen(["./start.sh"], cwd=home, stdout=log, stderr=log,
                     stdin=subprocess.DEVNULL, start_new_session=True)
PY
    fi
    wait_for_server
}

start_server() {
    # Reuse a server that is already serving: every suite binds the same port, and provisioning is
    # idempotent, so a reused server still ends up correct.
    if is_up; then
        echo "==> A server is already serving at $SERVER_URL, reusing it" >&2
        return 0
    fi
    require curl jq unzip

    local pkg_os pkg_arch
    case "$(uname -s)" in
        Darwin) pkg_os="macos" ;;
        Linux) pkg_os="linux" ;;
        *) echo "ERROR: unsupported OS $(uname -s)." >&2; exit 1 ;;
    esac
    case "$(uname -m)" in
        arm64 | aarch64) pkg_arch="arm64" ;;
        x86_64 | amd64) pkg_arch="x64" ;;
        *) echo "ERROR: unsupported architecture $(uname -m)." >&2; exit 1 ;;
    esac

    local version="${THUNDERID_VERSION:-}"
    if [ -z "$version" ]; then
        echo "==> Resolving the latest ThunderID release" >&2
        local auth=()
        [ -n "${GITHUB_TOKEN:-}" ] && auth=(-H "Authorization: Bearer $GITHUB_TOKEN")
        version=$(curl -sSL ${auth[@]+"${auth[@]}"} https://api.github.com/repos/thunder-id/thunderid/releases/latest |
            jq -r '.tag_name // empty' | sed 's/^v//')
        if [ -z "$version" ]; then
            echo "ERROR: could not resolve the latest release (rate limited?). Set THUNDERID_VERSION." >&2
            exit 1
        fi
    fi

    local name="thunderid-${version}-${pkg_os}-${pkg_arch}"
    local home="$INSTALL_DIR/$name"
    mkdir -p "$INSTALL_DIR"
    if [ ! -d "$home" ]; then
        echo "==> Downloading $name.zip" >&2
        local attempt
        # The release download from GitHub occasionally fails with a transient 5xx.
        for attempt in 1 2 3; do
            curl -sSLf "https://github.com/thunder-id/thunderid/releases/download/v${version}/${name}.zip" \
                -o "$INSTALL_DIR/$name.zip" && break
            [ "$attempt" = 3 ] && { echo "ERROR: download failed." >&2; exit 1; }
            sleep 15
        done
        unzip -q "$INSTALL_DIR/$name.zip" -d "$INSTALL_DIR"
        rm -f "$INSTALL_DIR/$name.zip"

        echo "==> Running first-time setup" >&2
        (cd "$home" && chmod +x setup.sh start.sh &&
            ./setup.sh --admin-username "$ADMIN_USER" --admin-password "$ADMIN_PASS")
    fi
    echo "$home" >"$INSTALL_DIR/dist-home"
    launch "$home"
}

stop_server() {
    local port
    port=$(sed -E 's#^[a-z]+://[^:/]+:?([0-9]*).*#\1#' <<<"$SERVER_URL")
    port="${port:-443}"
    if [ -z "$(dist_home)" ]; then
        echo "ERROR: no server started by this script under $INSTALL_DIR; not stopping $SERVER_URL." >&2
        exit 1
    fi
    echo "==> Stopping the server on port $port" >&2
    # start.sh runs the server binary as a separate process, so stop whatever holds the port.
    lsof -ti "tcp:$port" -sTCP:LISTEN | xargs kill 2>/dev/null || true
    local i
    for i in $(seq 1 30); do
        is_up || return 0
        sleep 1
    done
    lsof -ti "tcp:$port" -sTCP:LISTEN | xargs kill -9 2>/dev/null || true
}

restart_server() {
    local home
    home=$(dist_home)
    [ -n "$home" ] || { echo "ERROR: run '$0 start' first." >&2; exit 1; }
    stop_server
    launch "$home"
}

# Mints an admin token through the CONSOLE application: authorization code with PKCE, whose
# credentials step runs over the Flow Execution API. Mirrors utils/authentication in this folder.
mint_admin_token() {
    if [ -n "${ADMIN_TOKEN:-}" ]; then
        echo "$ADMIN_TOKEN"
        return 0
    fi
    require curl jq openssl

    local redirect_uri="$SERVER_URL/console"
    local verifier challenge
    verifier=$(openssl rand -hex 32 | cut -c1-43)
    challenge=$(printf '%s' "$verifier" | openssl dgst -sha256 -binary | openssl base64 -A | tr '+/' '-_' | tr -d '=')

    local headers_file location auth_id exec_id
    headers_file=$(mktemp)
    curl -sk -o /dev/null -D "$headers_file" \
        -G "$SERVER_URL/oauth2/authorize" \
        --data-urlencode "client_id=CONSOLE" \
        --data-urlencode "redirect_uri=$redirect_uri" \
        --data-urlencode "scope=system" \
        --data-urlencode "resource=$SERVER_URL/mcp" \
        --data-urlencode "response_type=code" \
        --data-urlencode "code_challenge=$challenge" \
        --data-urlencode "code_challenge_method=S256"
    location=$(grep -i "^location:" "$headers_file" | tr -d '\r' | sed 's/^[Ll]ocation: //' || true)
    rm -f "$headers_file"
    auth_id=$(sed -n 's/.*[?&]authId=\([^&]*\).*/\1/p' <<<"$location")
    exec_id=$(sed -n 's/.*[?&]executionId=\([^&]*\).*/\1/p' <<<"$location")
    if [ -z "$auth_id" ] || [ -z "$exec_id" ]; then
        echo "ERROR: could not parse authId/executionId from the authorize redirect: $location" >&2
        exit 1
    fi

    # The console sign-in flow runs an SSO check before the credentials prompt: the first call
    # advances past it and mints a challenge token, the second submits the credentials with it.
    local prompt_resp challenge_token flow_resp assertion
    prompt_resp=$(curl -sk -X POST "$SERVER_URL/flow/execute" \
        -H "Content-Type: application/json" -d "{\"executionId\": \"$exec_id\"}")
    challenge_token=$(jq -r '.challengeToken // empty' <<<"$prompt_resp")
    [ -n "$challenge_token" ] || { echo "ERROR: no challenge token: $prompt_resp" >&2; exit 1; }

    flow_resp=$(curl -sk -X POST "$SERVER_URL/flow/execute" \
        -H "Content-Type: application/json" \
        -d "$(jq -n --arg e "$exec_id" --arg c "$challenge_token" --arg u "$ADMIN_USER" --arg p "$ADMIN_PASS" \
            '{executionId: $e, challengeToken: $c, action: "action_001", inputs: {username: $u, password: $p}}')")
    assertion=$(jq -r '.assertion // empty' <<<"$flow_resp")
    [ -n "$assertion" ] || { echo "ERROR: admin sign-in returned no assertion: $flow_resp" >&2; exit 1; }

    local callback_resp auth_code token_resp token
    callback_resp=$(curl -sk -X POST "$SERVER_URL/oauth2/auth/callback" \
        -H "Content-Type: application/json" -d "{\"authId\": \"$auth_id\", \"assertion\": \"$assertion\"}")
    auth_code=$(jq -r '.redirect_uri // empty' <<<"$callback_resp" | sed -n 's/.*[?&]code=\([^&]*\).*/\1/p')
    [ -n "$auth_code" ] || { echo "ERROR: callback returned no authorization code: $callback_resp" >&2; exit 1; }

    token_resp=$(curl -sk -X POST "$SERVER_URL/oauth2/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        --data-urlencode "grant_type=authorization_code" \
        --data-urlencode "code=$auth_code" \
        --data-urlencode "redirect_uri=$redirect_uri" \
        --data-urlencode "client_id=CONSOLE" \
        --data-urlencode "resource=$SERVER_URL/mcp" \
        --data-urlencode "code_verifier=$verifier")
    token=$(jq -r '.access_token // empty' <<<"$token_resp")
    [ -n "$token" ] || { echo "ERROR: token endpoint returned no access token: $token_resp" >&2; exit 1; }
    echo "$token"
}

# Reads a KEY=VALUE env file into a JSON object. A value that parses as a JSON array stays one, so
# a list variable such as REDIRECT_URIS=["http://localhost:3000"] reaches the template as a list.
env_file_to_json() {
    local file="$1"
    if [ -z "$file" ]; then
        echo '{}'
        return 0
    fi
    grep -E '^[A-Za-z_][A-Za-z0-9_]*=' "$file" | jq -R -n '
        [inputs | capture("^(?<k>[^=]+)=(?<v>.*)$")
         | .v as $v | {key: .k, value: (try ($v | fromjson | select(type == "array")) catch $v // $v)}]
        | from_entries'
}

import_config() {
    local yaml="$1" env_file="${2:-}"
    require curl jq
    [ -f "$yaml" ] || { echo "ERROR: no config at $yaml" >&2; exit 1; }
    local token variables response status
    token=$(mint_admin_token)
    variables=$(env_file_to_json "$env_file")
    echo "==> Importing $yaml" >&2
    response=$(mktemp)
    status=$(jq -n --rawfile content "$yaml" --argjson variables "$variables" \
        '{content: $content, variables: $variables, options: {upsert: true}}' |
        curl -sk -o "$response" -w "%{http_code}" -X POST "$SERVER_URL/import" \
            -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d @-)
    if [ "$status" != "200" ] || [ "$(jq -r '.summary.failed // 1' "$response")" != "0" ]; then
        echo "ERROR: import of $yaml failed (HTTP $status):" >&2
        cat "$response" >&2
        rm -f "$response"
        exit 1
    fi
    rm -f "$response"
}

ensure_user() {
    local username="$1" password="$2"
    require curl jq
    local token filter existing ou_id created
    token=$(mint_admin_token)
    # The filter grammar accepts exactly one `attribute eq "value"` clause.
    filter=$(printf 'username eq "%s"' "$username" | jq -sRr @uri)
    existing=$(curl -sk "$SERVER_URL/users?filter=$filter" -H "Authorization: Bearer $token")
    if [ "$(jq -r '(.users // []) | length' <<<"$existing")" -gt 0 ]; then
        echo "==> User '$username' already exists" >&2
        return 0
    fi
    ou_id=$(curl -sk "$SERVER_URL/user-types?limit=100" -H "Authorization: Bearer $token" |
        jq -r '.types[] | select(.name == "Person") | .ouId')
    [ -n "$ou_id" ] && [ "$ou_id" != "null" ] || { echo "ERROR: no Person user type." >&2; exit 1; }
    created=$(curl -sk -X POST "$SERVER_URL/users" \
        -H "Authorization: Bearer $token" -H "Content-Type: application/json" \
        -d "$(jq -n --arg u "$username" --arg p "$password" --arg ou "$ou_id" \
            '{ouId: $ou, type: "Person", attributes: {username: $u, password: $p,
              email: ($u + "@example.com"), given_name: "E2E", family_name: "User"}}')")
    [ -n "$(jq -r '.id // empty' <<<"$created")" ] || { echo "ERROR: user creation failed: $created" >&2; exit 1; }
    echo "==> Created user '$username'" >&2
}

case "${1:-}" in
    start) start_server ;;
    stop) stop_server ;;
    restart) restart_server ;;
    wait) wait_for_server ;;
    token) mint_admin_token ;;
    import) [ $# -ge 2 ] || { echo "usage: $0 import <yaml> [env-file]" >&2; exit 2; }; import_config "$2" "${3:-}" ;;
    ensure-user) [ $# -eq 3 ] || { echo "usage: $0 ensure-user <user> <pass>" >&2; exit 2; }; ensure_user "$2" "$3" ;;
    *) sed -n '5,30p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 2 ;;
esac
