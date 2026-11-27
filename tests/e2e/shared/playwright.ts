// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * The Playwright config every web suite shares. A suite's playwright.config.ts names its app and
 * how to start it; this fills in the rest.
 */

import path from 'node:path';
import {type PlaywrightTestConfig, defineConfig, devices} from '@playwright/test';
import {E2E_ROOT, SampleApps, type SampleAppKey, sampleAppUrl, sampleDir} from './apps.ts';
import {Timeouts} from './constants/timeouts.ts';
import {loadEnv} from './env.ts';

// At import time, so a suite's playwright.config.ts can read SERVER_URL and the like.
loadEnv();

type WebServer = NonNullable<Extract<PlaywrightTestConfig['webServer'], {command: string}>>;

export interface SampleWebServerOptions {
  /** The sample's own start command, such as `npm run dev -- --port 5174`. */
  command: string;
  /** Run the command here instead of the sample's root, relative to it. */
  cwd?: string;
  /** Skip the install step, for a second server of a sample a first one already installed. */
  skipInstall?: boolean;
  /** Environment of the app: its client ID, server URL and the like, in place of a .env file. */
  env?: Record<string, string>;
  /** A port to wait for instead of a URL, for a server whose URLs all need a session or a header. */
  port?: number;
  /** What to poll until the app is up. Defaults to the app's URL. */
  url?: string;
}

/**
 * Starts the sample with its own start command, after installing it from its lockfile when it has
 * no node_modules yet. The app's configuration comes through the environment, so nothing is
 * written into the sample's directory.
 */
export function sampleWebServer(key: SampleAppKey, options: SampleWebServerOptions): WebServer {
  const app = SampleApps[key];
  const ensureInstalled = path.join(E2E_ROOT, 'shared/scripts/ensure-installed.mjs');
  return {
    command: options.skipInstall ? options.command : `node "${ensureInstalled}" && ${options.command}`,
    cwd: path.join(sampleDir(app), options.cwd ?? ''),
    env: options.env ?? {},
    // A port already taken by something else fails the run, unless E2E_REUSE_SERVER=true says the
    // app is already running there.
    reuseExistingServer: process.env.E2E_REUSE_SERVER === 'true',
    stderr: 'pipe',
    stdout: process.env.E2E_APP_LOGS === 'true' ? 'pipe' : 'ignore',
    timeout: Timeouts.WEB_SERVER,
    ...(options.port ? {port: options.port} : {url: options.url ?? sampleAppUrl(app)}),
  };
}

export interface SampleConfigOptions {
  app: SampleAppKey;
  /** Extra options merged over the defaults, such as a longer per-test timeout. */
  overrides?: PlaywrightTestConfig;
  webServer?: WebServer | WebServer[];
}

export function defineSampleConfig({app, overrides, webServer}: SampleConfigOptions): PlaywrightTestConfig {
  return defineConfig({
    testDir: './tests',
    // Tests in one file run in order (Playwright's default); files run in parallel.
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    // Kept low on purpose: ThunderID's SQLite store can answer concurrent authorization code
    // exchanges with SQLITE_BUSY ("Invalid authorization code"). E2E_WORKERS raises it.
    workers: Number(process.env.E2E_WORKERS) || 2,
    reporter: [['list'], ['html', {open: 'never'}]],
    globalSetup: path.join(E2E_ROOT, 'shared/setup/global-setup.ts'),
    metadata: {app},
    timeout: Timeouts.GLOBAL_TEST,
    use: {
      ignoreHTTPSErrors: true,
      screenshot: 'only-on-failure',
      trace: 'retain-on-failure',
      video: 'retain-on-failure',
    },
    projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
    webServer,
    ...overrides,
  });
}

export {devices};
