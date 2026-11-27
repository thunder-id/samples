// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {randomBytes} from 'node:crypto';
import {sharedClientVariable} from '../../shared/apps.ts';
import {defineSampleConfig, sampleWebServer} from '../../shared/playwright.ts';

const appUrl = 'http://localhost:3003';

const config = defineSampleConfig({
  app: 'BETTER_AUTH_NEXTJS',
  webServer: sampleWebServer('BETTER_AUTH_NEXTJS', {
    command: 'npm run dev -- -p 3003',
    env: {
      BETTER_AUTH_SECRET: randomBytes(32).toString('base64'),
      // Better Auth derives its callback URL, /api/auth/callback/thunderid, from this.
      BETTER_AUTH_URL: appUrl,
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
      THUNDERID_CLIENT_ID: sharedClientVariable('BETTER_AUTH_NEXTJS_CLIENT_ID'),
      THUNDERID_CLIENT_SECRET: sharedClientVariable('BETTER_AUTH_NEXTJS_CLIENT_SECRET'),
      THUNDERID_ISSUER: process.env.SERVER_URL!,
    },
    url: appUrl,
  }),
});

export default config;
