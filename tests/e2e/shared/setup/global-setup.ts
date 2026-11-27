// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Global setup of every web suite. The suite's playwright.config.ts names its app in
 * `metadata.app` (see playwright.ts), and this provisions the server for it.
 *
 * There is no global teardown: the test users and imported resources stay on the server, so
 * suites that run side by side never delete what another one still uses, and the next run
 * reuses them.
 */

import type {FullConfig} from '@playwright/test';
import {SampleApps, type SampleAppKey} from '../apps.ts';
import {loadEnv} from '../env.ts';
import {getAdminToken} from '../utils/authentication/index.ts';
import {provision} from './provision.ts';

export default async function globalSetup(config: FullConfig): Promise<void> {
  loadEnv();
  const key = config.metadata.app as SampleAppKey;
  const app = SampleApps[key];
  if (!app) {
    throw new Error(`playwright.config.ts names no known app in metadata.app (got "${String(key)}")`);
  }
  await provision(app);
  // Workers inherit the runner's environment, so they reuse this token instead of each signing
  // the admin in again.
  process.env.ADMIN_TOKEN ??= await getAdminToken();
}
