// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Timeouts shared by every suite.
 */
export const Timeouts = {
  /** Default timeout for UI actions (clicks, fills). */
  DEFAULT_ACTION: 15000,

  /** Timeout for checking element visibility. */
  ELEMENT_VISIBILITY: 10000,

  /** Timeout for a redirect-flow round trip (app -> gate -> app). */
  REDIRECT: 20000,

  /** Per-test timeout (see playwright.ts). */
  GLOBAL_TEST: 60 * 1000,

  /** How long Playwright waits for a sample app's dev server, including a first `npm ci`. */
  WEB_SERVER: 5 * 60 * 1000,
} as const;
