// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {randomBytes} from 'node:crypto';
import {sharedClientVariable} from '../../shared/apps.ts';
import {defineSampleConfig, sampleWebServer} from '../../shared/playwright.ts';

// A client ID puts the sample in redirect mode, so its native-flow variables stay unset. The
// registered redirect URI fixes the port at 3002.
const sessionSecret = randomBytes(32).toString('base64');

const config = defineSampleConfig({
  app: 'NUXT',
  webServer: sampleWebServer('NUXT', {
    command: 'npm run dev -- --port 3002',
    env: {
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
      NUXT_PUBLIC_THUNDERID_BASE_URL: process.env.SERVER_URL!,
      NUXT_PUBLIC_THUNDERID_CLIENT_ID: sharedClientVariable('NUXT_CLIENT_ID'),
      THUNDERID_CLIENT_SECRET: sharedClientVariable('NUXT_CLIENT_SECRET'),
      THUNDERID_SESSION_SECRET: sessionSecret,
    },
  }),
});

export default config;
