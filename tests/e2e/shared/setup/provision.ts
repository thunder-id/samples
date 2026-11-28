// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Puts the server in the state a suite needs: imports the app's declarative configs and makes sure
 * the test users exist with their known passwords. Every step upserts, so it runs the same against
 * a fresh CI server and against a local server a previous run (or the javascript-sdks suite)
 * already provisioned.
 */

import fs from 'node:fs';
import path from 'node:path';
import {type SampleApp, credentialTestUser, sampleDir, testUser} from '../apps.ts';
import {type ImportVariables, importConfig, readEnvFile, withoutServerConfigs} from '../utils/import-config/index.ts';
import {ensureUser} from '../utils/users-api/index.ts';

export async function provision(app: SampleApp): Promise<void> {
  const skipServerConfigs = process.env.E2E_SKIP_SERVER_CONFIGS === 'true' ? (app.serverConfigs ?? []) : [];

  for (const config of app.configs) {
    const base = config.fromSample ? sampleDir(app) : '';
    const file = path.resolve(base, config.file);
    let variables: ImportVariables = {};
    if (config.envFile) variables = readEnvFile(path.resolve(base, config.envFile));
    variables = {...variables, ...config.variables};

    const content = withoutServerConfigs(fs.readFileSync(file, 'utf8'), skipServerConfigs);
    console.log(`Importing ${path.relative(process.cwd(), file)}`);
    await importConfig(content, variables);
  }
  if (skipServerConfigs.length > 0) {
    console.log(`Left out server configs (E2E_SKIP_SERVER_CONFIGS): ${skipServerConfigs.join(', ')}`);
  }

  const user = testUser();
  await ensureUser(user.username, user.password);
  console.log(`Test user ready: ${user.username}`);

  if (app.credentialUser) {
    const credUser = credentialTestUser(app);
    await ensureUser(credUser.username, credUser.password, 'Credential Test');
    console.log(`Credential test user ready: ${credUser.username}`);
  }
}
