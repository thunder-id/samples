// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Sample App Registry
 *
 * One entry per web sample under E2E test: where it lives in the samples repository, the port its
 * suite starts it on, and the declarative configs its global setup imports. Every port is distinct
 * except where a sample's own config fixes it (see the README's port table), so most suites can
 * run side by side against one server.
 *
 * The OAuth2 client IDs, secrets and redirect URIs live in thunderid-config/sample-apps.env (for
 * the clients in sample-apps.yaml) or in the sample's own thunderid-config/thunderid.env (for the
 * samples that ship one). Each suite's playwright.config.ts starts its app with matching values.
 */

import path from 'node:path';
import {type ImportVariables, readEnvFile} from './utils/import-config/index.ts';

/** tests/e2e */
export const E2E_ROOT = path.resolve(import.meta.dirname, '..');

/** The samples checkout the suites run against. Override with SAMPLES_ROOT, e.g. a `git archive` export. */
export function samplesRoot(): string {
  return path.resolve(process.env.SAMPLES_ROOT || path.resolve(E2E_ROOT, '../..'));
}

const SHARED_CONFIG = path.join(E2E_ROOT, 'shared/thunderid-config/sample-apps.yaml');
const SHARED_ENV = path.join(E2E_ROOT, 'shared/thunderid-config/sample-apps.env');

export interface ConfigImport {
  /** Variables of a KEY=VALUE env file, applied first. */
  envFile?: string;
  /** The declarative config, relative to the sample's directory when `fromSample` is set. */
  file: string;
  fromSample?: boolean;
  /** Variables that override the env file's, such as client secrets a sample ships empty. */
  variables?: ImportVariables;
}

export interface SampleApp {
  /** Imported in order by the suite's global setup. */
  configs: ConfigImport[];
  /** Whether the suite has a change-credential spec, which gets its own user. */
  credentialUser?: boolean;
  /** Short key, used for the dedicated credential-test user's name. */
  key: string;
  /** `<area>/<sample>` in the samples repository. */
  path: string;
  /** The port the suite serves the app on. Unset for a sample with no browser UI. */
  port?: number;
  /**
   * Names of server-wide settings (`server_config` documents) the sample's config sets. Setting
   * E2E_SKIP_SERVER_CONFIGS=true leaves them out of the import, for a run against a shared server
   * whose server-wide settings must stay as they are.
   */
  serverConfigs?: string[];
}

const shared: ConfigImport = {envFile: SHARED_ENV, file: SHARED_CONFIG};

export const SampleApps = {
  ADMIN_REACT: {configs: [shared], key: 'admin-react', path: 'management/admin-react', port: 5176},
  BETTER_AUTH_NEXTJS: {
    configs: [shared],
    key: 'better-auth-nextjs',
    path: 'integrations/better-auth-nextjs',
    port: 3003,
  },
  BFF_REACT_EXPRESS: {configs: [shared], key: 'bff-react-express', path: 'patterns/bff-react-express', port: 5178},
  BROWSER: {
    configs: [shared],
    credentialUser: true,
    key: 'browser',
    path: 'quickstarts/quickstart-browser',
    port: 5173,
  },
  EXPRESS: {
    configs: [shared],
    credentialUser: true,
    key: 'express',
    path: 'quickstarts/quickstart-express',
    port: 3000,
  },
  MYACCOUNT_REACT: {
    configs: [shared],
    credentialUser: true,
    key: 'myaccount-react',
    path: 'self-service/myaccount-react',
    port: 5177,
  },
  NEXTJS: {configs: [shared], credentialUser: true, key: 'nextjs', path: 'quickstarts/quickstart-nextjs', port: 3001},
  NEXTJS_B2B: {
    configs: [
      shared,
      {
        envFile: 'thunderid-config/thunderid.env',
        file: 'thunderid-config/thunderid-config.yaml',
        fromSample: true,
        variables: {NEXTJS_B2B_CLIENT_SECRET: 'e2e-nextjs-b2b-secret'},
      },
    ],
    key: 'nextjs-b2b',
    path: 'quickstarts/quickstart-nextjs-b2b',
    // Fixed by the redirect URIs in the sample's own config.
    port: 3000,
    serverConfigs: ['defaultResourceServer'],
  },
  NODE: {configs: [shared], key: 'node', path: 'quickstarts/quickstart-node'},
  NUXT: {configs: [shared], credentialUser: true, key: 'nuxt', path: 'quickstarts/quickstart-nuxt', port: 3002},
  REACT: {configs: [shared], credentialUser: true, key: 'react', path: 'quickstarts/quickstart-react', port: 5174},
  REACT_B2B: {
    configs: [
      shared,
      {envFile: 'thunderid-config/thunderid.env', file: 'thunderid-config/thunderid-config.yaml', fromSample: true},
    ],
    key: 'react-b2b',
    path: 'quickstarts/quickstart-react-b2b',
    // Fixed by the sample's vite.config.js (strictPort) and the redirect URIs in its own config.
    port: 5173,
    serverConfigs: ['defaultResourceServer'],
  },
  VUE: {configs: [shared], credentialUser: true, key: 'vue', path: 'quickstarts/quickstart-vue', port: 5175},
  WAYFINDER_ENTERPRISE_NEXTJS: {
    configs: [
      shared,
      {
        envFile: 'thunderid-config/thunderid.env',
        file: 'thunderid-config/thunderid-config.yaml',
        fromSample: true,
        variables: {
          WAYFINDER_ENTERPRISE_BACKEND_CLIENT_SECRET: 'e2e-wayfinder-backend-secret',
          WAYFINDER_ENTERPRISE_CLIENT_SECRET: 'e2e-wayfinder-secret',
        },
      },
    ],
    key: 'wayfinder-enterprise-nextjs',
    path: 'b2b/wayfinder-enterprise-nextjs',
    // Fixed by the sample's `next dev -p 3000` script.
    port: 3000,
    serverConfigs: ['defaultResourceServer'],
  },
} as const satisfies Record<string, SampleApp>;

export type SampleAppKey = keyof typeof SampleApps;

/** The sample's directory under SAMPLES_ROOT. */
export function sampleDir(app: SampleApp): string {
  return path.join(samplesRoot(), app.path);
}

/** The base URL the suite serves the app on. */
export function sampleAppUrl(app: SampleApp): string {
  if (!app.port) throw new Error(`${app.path} has no browser UI`);
  return `http://localhost:${app.port}`;
}

/** The shared user every sign-in spec signs in as. */
export function testUser(): {password: string; username: string} {
  return {password: process.env.TEST_USER_PASSWORD!, username: process.env.TEST_USER_USERNAME!};
}

/**
 * The dedicated user of a suite's change-credential spec. Those specs change the signed-in user's
 * password mid-test and change it back, so no other test may sign in as the same identity while
 * they run. A function, not a constant: the env files load after this module is imported.
 */
export function credentialTestUser(app: SampleApp): {password: string; username: string} {
  return {password: process.env.TEST_USER_PASSWORD!, username: `${process.env.TEST_USER_USERNAME}-cred-${app.key}`};
}

/** A variable of thunderid-config/sample-apps.env, such as REACT_CLIENT_ID. */
export function sharedClientVariable(name: string): string {
  const value = readEnvFile(SHARED_ENV)[name];
  if (typeof value !== 'string') throw new Error(`sample-apps.env has no string ${name}`);
  return value;
}
