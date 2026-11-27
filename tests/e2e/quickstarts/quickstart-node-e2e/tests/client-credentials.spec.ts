// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * quickstarts/quickstart-node - a service-to-service CLI, not a browser app: it authenticates
 * with the OAuth2 `client_credentials` grant (lib/AuthService.mjs) and prints the result. There is
 * no page to drive, so this spawns the CLI directly and asserts it exits 0 having obtained a token.
 */

import {type ChildProcess, execFileSync, spawn} from 'node:child_process';
import fs from 'node:fs';
import {expect, test} from '@playwright/test';
import {SampleApps, sampleDir} from '../../../shared/apps.ts';
import {Timeouts} from '../../../shared/constants/timeouts.ts';
import {readEnvFile} from '../../../shared/utils/import-config/index.ts';

const appDir = sampleDir(SampleApps.NODE);
const clients = readEnvFile(new URL('../../../shared/thunderid-config/sample-apps.env', import.meta.url).pathname);

test.describe('quickstarts/quickstart-node - client_credentials', () => {
  test.beforeAll(() => {
    // No dev server to install it, so install the sample from its lockfile here.
    if (!fs.existsSync(`${appDir}/node_modules`)) {
      execFileSync('npm', ['ci', '--no-audit', '--no-fund'], {cwd: appDir, stdio: 'inherit'});
    }
  });

  test('TC001: obtains an access token and exits cleanly', async () => {
    test.setTimeout(Timeouts.GLOBAL_TEST * 3);
    let child: ChildProcess | undefined;

    try {
      const result = await new Promise<{code: number | null; stderr: string; stdout: string}>((resolve, reject) => {
        // `timeout` bounds a hung token request instead of leaving the child running: Playwright's
        // own test timeout never kills a spawned child process.
        child = spawn('node', ['index.mjs'], {
          cwd: appDir,
          env: {
            ...process.env,
            NODE_TLS_REJECT_UNAUTHORIZED: '0',
            THUNDERID_BASE_URL: process.env.SERVER_URL!,
            THUNDERID_CLIENT_ID: clients.NODE_CLIENT_ID as string,
            THUNDERID_CLIENT_SECRET: clients.NODE_CLIENT_SECRET as string,
          },
          timeout: Timeouts.DEFAULT_ACTION,
        });
        let stdout = '';
        let stderr = '';
        child.stdout!.on('data', (chunk: Buffer) => (stdout += chunk.toString()));
        child.stderr!.on('data', (chunk: Buffer) => (stderr += chunk.toString()));
        child.on('error', reject);
        child.on('close', (code) => resolve({code, stderr, stdout}));
      });

      expect(result.code, `stdout:\n${result.stdout}\nstderr:\n${result.stderr}`).toBe(0);
      // lib/ui.mjs's printAuthenticated() prints this banner once client_credentials succeeds.
      expect(result.stdout).toContain('AUTHENTICATED');
    } finally {
      // No-op if the process already exited.
      child?.kill();
    }
  });
});
