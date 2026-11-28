// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Runs `npm ci` in the current directory (a sample app) when it has no node_modules yet, so a
 * suite can start the sample straight from a fresh checkout or `git archive` export. The sample
 * installs from its own lockfile, so it runs the published SDK release it pins.
 */

import {execFileSync} from 'node:child_process';
import fs from 'node:fs';

if (!fs.existsSync('node_modules')) {
  console.log(`Installing ${process.cwd()} with npm ci...`);
  execFileSync('npm', ['ci', '--no-audit', '--no-fund'], {shell: process.platform === 'win32', stdio: 'inherit'});
}
