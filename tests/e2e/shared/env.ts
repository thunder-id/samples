// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import path from 'node:path';
import dotenv from 'dotenv';
import {E2E_ROOT} from './apps.ts';

/**
 * Loads tests/e2e/.env (optional) and then shared/defaults.env. dotenv never overrides a variable
 * that is already set, so the real environment wins, then .env, then the defaults.
 */
export function loadEnv(): void {
  dotenv.config({path: path.join(E2E_ROOT, '.env'), quiet: true});
  dotenv.config({path: path.join(E2E_ROOT, 'shared/defaults.env'), quiet: true});
}
