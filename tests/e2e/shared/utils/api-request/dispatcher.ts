// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

let dispatcherPromise: Promise<unknown> | undefined;

/**
 * A fetch dispatcher that accepts the server's self-signed local or CI certificate, the same
 * allowance shared/scripts/thunderid.sh makes with `curl -k`.
 */
export function insecureDispatcher(): Promise<unknown> {
  dispatcherPromise ??= import('undici').then(({Agent}) => new Agent({connect: {rejectUnauthorized: false}}));
  return dispatcherPromise;
}
